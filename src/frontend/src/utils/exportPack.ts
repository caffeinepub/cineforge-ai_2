import type { Blueprint } from "../types/blueprint";

/**
 * Generates a complete, ready-to-run Python script that:
 * 1. Loads the exported JSON production slate
 * 2. Iterates over every shot and calls the Veo 3 API
 * 3. Polls each long-running operation until completion
 * 4. Saves rendered MP4 files to a local `rendered_shots/` directory
 */
export function generatePythonScript(
  blueprint: Blueprint,
  title: string,
): string {
  const shotCount = blueprint.shot_list.reduce(
    (acc, scene) => acc + scene.shots.length,
    0,
  );

  return `#!/usr/bin/env python3
"""
CineForge AI — Veo 3 Batch Renderer
Production Slate: ${title || "Untitled Project"}
Total Shots: ${shotCount}

This script reads the exported production slate JSON and renders every shot
sequentially using Google's Veo 3 video generation API.

Requirements:
  pip install requests

Usage:
  1. Place this file in the same directory as cineforge-production-slate.json
  2. Set your API key: export VEO_API_KEY="your-api-key-here"
     (or the script will prompt you at runtime)
  3. Run: python3 veo3_render.py

Output:
  Rendered MP4 files are saved to ./rendered_shots/shot_N.mp4
"""

import os
import json
import time
import base64
import requests
from pathlib import Path


# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────

# Load API key from environment variable or prompt the user
API_KEY = os.environ.get("VEO_API_KEY") or input(
    "Enter your Google AI Studio API key: "
).strip()

# Veo 3 API endpoint (long-running operation)
VEO_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "veo-3.0-generate-preview:predictLongRunning"
)

# Operation polling endpoint base
OPERATIONS_URL = "https://generativelanguage.googleapis.com/v1beta/"

# Output directory for rendered shots
OUTPUT_DIR = Path("rendered_shots")

# Seconds to wait between polling attempts
POLL_INTERVAL = 10

# Maximum number of polling attempts before giving up (10s × 180 = 30 minutes)
MAX_POLL_ATTEMPTS = 180


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def load_production_slate(json_path: str = "cineforge-production-slate.json") -> dict:
    """Load the CineForge production slate from the JSON export file."""
    path = Path(json_path)
    if not path.exists():
        raise FileNotFoundError(
            f"Production slate not found at '{json_path}'.\\n"
            "Make sure cineforge-production-slate.json is in the same directory."
        )
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"✓ Loaded production slate: {path.resolve()}")
    return data


def extract_shot_prompts(slate: dict) -> list[dict]:
    """
    Flatten all shots from every scene into a single list of render tasks.
    Each task contains the shot index, scene title, and combined prompt string.
    """
    tasks = []
    index = 1
    for scene in slate.get("shot_list", []):
        scene_title = scene.get("scene_title", "Untitled Scene")
        for shot in scene.get("shots", []):
            # Combine camera direction, action beat, and cinematography style
            # into a single rich prompt for the video model
            camera = shot.get("camera_direction", "")
            action = shot.get("action_beat", "")
            cinestyle = shot.get("cinematography", "")
            duration = shot.get("duration_seconds", 8)

            # Build a descriptive prompt — the more detail, the better the output
            prompt_parts = [p for p in [camera, action, cinestyle] if p.strip()]
            full_prompt = ". ".join(prompt_parts)

            tasks.append({
                "index": index,
                "shot_id": shot.get("shot_id", f"shot_{index}"),
                "scene_title": scene_title,
                "prompt": full_prompt,
                "duration_seconds": min(max(int(duration), 1), 8),  # Veo max = 8s
            })
            index += 1

    print(f"✓ Extracted {len(tasks)} shots across {len(slate.get('shot_list', []))} scenes")
    return tasks


def start_render_job(prompt: str, duration_seconds: int) -> str:
    """
    Submit a single shot prompt to the Veo 3 API.
    Returns the operation name (used to poll for completion).
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "aspectRatio": "16:9",
            "durationSeconds": duration_seconds,
        },
    }

    response = requests.post(VEO_API_URL, headers=headers, json=payload, timeout=60)

    if response.status_code == 401:
        raise PermissionError(
            "API key is invalid or expired. "
            "Generate a new key at https://aistudio.google.com/app/apikey"
        )
    if response.status_code == 403:
        raise PermissionError(
            "Your API key does not have access to Veo 3. "
            "Veo 3 is in limited preview — request access at Google AI Studio."
        )
    if not response.ok:
        raise RuntimeError(
            f"Veo API error {response.status_code}: {response.text[:500]}"
        )

    operation = response.json()
    operation_name = operation.get("name", "")
    if not operation_name:
        raise RuntimeError(f"No operation name in response: {operation}")

    return operation_name


def poll_until_done(operation_name: str, shot_label: str) -> dict:
    """
    Poll the Veo operation endpoint every POLL_INTERVAL seconds until
    the job completes or we exceed MAX_POLL_ATTEMPTS.
    Returns the completed operation response dict.
    """
    poll_url = f"{OPERATIONS_URL}{operation_name}"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    for attempt in range(1, MAX_POLL_ATTEMPTS + 1):
        response = requests.get(poll_url, headers=headers, timeout=30)

        if not response.ok:
            raise RuntimeError(
                f"Polling error {response.status_code} for {shot_label}: {response.text[:300]}"
            )

        data = response.json()

        if data.get("done"):
            # Check for error in the completed operation
            if "error" in data:
                err = data["error"]
                raise RuntimeError(
                    f"Render failed for {shot_label}: {err.get('message', str(err))}"
                )
            print(f"  ✓ {shot_label} — completed after {attempt * POLL_INTERVAL}s")
            return data

        elapsed = attempt * POLL_INTERVAL
        print(f"  ⏳ {shot_label} — rendering... ({elapsed}s elapsed)", end="\\r")
        time.sleep(POLL_INTERVAL)

    raise TimeoutError(
        f"Render timed out for {shot_label} after {MAX_POLL_ATTEMPTS * POLL_INTERVAL}s. "
        "Try increasing MAX_POLL_ATTEMPTS."
    )


def save_video(operation_result: dict, output_path: Path, shot_label: str) -> None:
    """
    Extract the video from the completed operation response and save it.
    Veo may return a base64-encoded video or a signed download URL.
    """
    response_body = operation_result.get("response", {})
    predictions = response_body.get("predictions", [])

    if not predictions:
        raise RuntimeError(
            f"No predictions in completed operation for {shot_label}. "
            f"Full response: {json.dumps(operation_result, indent=2)[:1000]}"
        )

    prediction = predictions[0]

    # Case 1: base64-encoded video bytes
    if "bytesBase64Encoded" in prediction:
        video_bytes = base64.b64decode(prediction["bytesBase64Encoded"])
        output_path.write_bytes(video_bytes)
        size_mb = len(video_bytes) / (1024 * 1024)
        print(f"  💾 Saved {output_path.name} ({size_mb:.1f} MB) [base64]")
        return

    # Case 2: signed download URL
    if "uri" in prediction or "url" in prediction:
        url = prediction.get("uri") or prediction.get("url")
        dl_response = requests.get(url, timeout=120)
        if not dl_response.ok:
            raise RuntimeError(
                f"Failed to download video from signed URL: {dl_response.status_code}"
            )
        output_path.write_bytes(dl_response.content)
        size_mb = len(dl_response.content) / (1024 * 1024)
        print(f"  💾 Saved {output_path.name} ({size_mb:.1f} MB) [url]")
        return

    raise RuntimeError(
        f"Unrecognised prediction format for {shot_label}: {list(prediction.keys())}"
    )


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main():
    print("\\n╔══════════════════════════════════════════════════╗")
    print("║   CineForge AI — Veo 3 Batch Renderer            ║")
    print("╚══════════════════════════════════════════════════╝\\n")

    # Create output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output directory: {OUTPUT_DIR.resolve()}\\n")

    # Step 1: Load the production slate
    slate = load_production_slate()

    # Step 2: Extract all shot prompts
    tasks = extract_shot_prompts(slate)
    if not tasks:
        print("⚠️  No shots found in production slate. Exiting.")
        return

    print(f"\\n🎬 Starting sequential render of {len(tasks)} shots...\\n")

    # Step 3: Render each shot sequentially
    rendered = 0
    failed = []

    for task in tasks:
        index = task["index"]
        shot_id = task["shot_id"]
        scene = task["scene_title"]
        prompt = task["prompt"]
        duration = task["duration_seconds"]
        shot_label = f"[{index}/{len(tasks)}] {shot_id} ({scene})"
        output_path = OUTPUT_DIR / f"shot_{index:03d}.mp4"

        # Skip if already rendered (resume support)
        if output_path.exists():
            print(f"  ⏭️  {shot_label} — already exists, skipping")
            rendered += 1
            continue

        print(f"\\n🎥 {shot_label}")
        print(f"   Prompt: {prompt[:120]}{'...' if len(prompt) > 120 else ''}")
        print(f"   Duration: {duration}s")

        try:
            # Submit to Veo 3
            operation_name = start_render_job(prompt, duration)
            print(f"  ✓ Job submitted: {operation_name}")

            # Poll until done
            result = poll_until_done(operation_name, shot_label)

            # Save the video file
            save_video(result, output_path, shot_label)
            rendered += 1

        except (RuntimeError, TimeoutError, PermissionError) as e:
            print(f"\\n  ❌ FAILED: {shot_label}")
            print(f"     {e}")
            failed.append({"shot": shot_label, "error": str(e)})
            # Continue with the next shot — don't abort the whole run

    # Step 4: Summary
    print("\\n" + "═" * 52)
    print(f"✅ Rendered: {rendered}/{len(tasks)} shots")
    if failed:
        print(f"❌ Failed:   {len(failed)} shots")
        for f in failed:
            print(f"   • {f['shot']}: {f['error'][:100]}")
    print(f"📁 Output:  {OUTPUT_DIR.resolve()}")
    print("═" * 52 + "\\n")


if __name__ == "__main__":
    main()
`;
}

/**
 * Triggers two simultaneous browser downloads:
 * 1. `cineforge-production-slate.json` — the full Blueprint as pretty-printed JSON
 * 2. `veo3_render.py` — a ready-to-run Python script for Veo 3 rendering
 */
export function exportPack(blueprint: Blueprint, title: string): void {
  // ── Download 1: Full production slate JSON ──────────────────────────────
  const json = JSON.stringify(blueprint, null, 2);
  const jsonBlob = new Blob([json], { type: "application/json" });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonAnchor = document.createElement("a");
  jsonAnchor.href = jsonUrl;
  jsonAnchor.download = "cineforge-production-slate.json";
  jsonAnchor.click();
  URL.revokeObjectURL(jsonUrl);

  // ── Download 2: Python rendering script ────────────────────────────────
  const pythonScript = generatePythonScript(blueprint, title);
  const pyBlob = new Blob([pythonScript], { type: "text/x-python" });
  const pyUrl = URL.createObjectURL(pyBlob);
  const pyAnchor = document.createElement("a");
  pyAnchor.href = pyUrl;
  pyAnchor.download = "veo3_render.py";
  // Slight delay so both downloads trigger correctly in all browsers
  setTimeout(() => {
    pyAnchor.click();
    URL.revokeObjectURL(pyUrl);
  }, 100);
}
