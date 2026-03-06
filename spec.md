# CineForge AI

## Current State
The app generates a cinematic production blueprint from a manuscript. The Assembly Logic tab shows a timeline table and a marketing pack. There is an "Export Pack" button that downloads a JSON + Python script. Shot-level data (camera direction, action beats, cinematography, audio direction, character DNA) exists in the blueprint but is not surfaced in the Assembly Logic tab.

## Requested Changes (Diff)

### Add
- A new "Veo 3 Prompts" section in the Assembly Logic tab, rendered after the timeline table and before the marketing pack.
- For each shot in each scene, display a fully assembled Veo 3 prompt as a single clean block of text combining:
  - Shot description (action beat)
  - Camera direction
  - Cinematography style
  - Relevant audio cues (ambient + rhythmic layers from matching audio_direction)
  - Visual style guide (title + cinematography notes)
  - Relevant character DNA (visual_dna of characters mentioned or all if ambiguous)
- Each prompt card includes:
  - Scene and shot label (e.g., "Scene 1 · Shot 2")
  - The assembled prompt text in a monospace/code-style block
  - A one-click "Copy" button that copies the full prompt to clipboard and shows a toast confirmation

### Modify
- AssemblyLogicTab.tsx: add the Veo 3 Prompts section using blueprint data already passed as props.

### Remove
- Nothing removed.

## Implementation Plan
1. In AssemblyLogicTab.tsx, add a `buildVeo3Prompt(shot, scene, blueprint)` utility function that assembles all relevant elements into one clean text block.
2. Render a new "Veo 3 Prompts" section after the timeline table, iterating over all scenes and their shots.
3. Each shot card shows the assembled prompt in a scrollable pre/code block with a Copy button using the Clipboard API + sonner toast.
4. Add deterministic `data-ocid` markers: `assembly.veo3_prompt.panel`, `assembly.veo3_copy_button.{index}`.
