import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  Copy,
  Download,
  LayoutList,
  Megaphone,
  PackageOpen,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  AudioDirection,
  Blueprint,
  Character,
  Scene,
  Shot,
  VisualStyle,
} from "../types/blueprint";
import { exportPack } from "../utils/exportPack";

function buildMasterPrompt(blueprint: Blueprint): string {
  const {
    visual_style,
    identity_vault,
    shot_list,
    audio_direction,
    assembly_logic,
  } = blueprint;

  const paletteLine = visual_style.color_palette
    .map((c) => `  ${c.name} (${c.role}): ${c.hex}`)
    .join("\n");

  const cinNotes = visual_style.cinematography_notes.join(" | ");

  const characterLines = identity_vault
    .map((c) => `  - ${c.name} [${c.archetype}]: ${c.visual_dna}`)
    .join("\n");

  const sceneBlocks = shot_list
    .map((scene, si) => {
      const audio = audio_direction.find((a) => a.scene_id === scene.scene_id);
      const shotLines = scene.shots
        .map(
          (shot, sj) =>
            `  Shot ${sj + 1}:\n    ACTION: ${shot.action_beat}\n    CAMERA: ${shot.camera_direction}\n    CINEMATOGRAPHY: ${shot.cinematography} | Duration: ${shot.duration_seconds}s`,
        )
        .join("\n\n");
      const audioLine = audio
        ? `  AUDIO: Ambient: ${audio.ambient} | Rhythmic: ${audio.rhythmic} | Ethereal: ${audio.ethereal}`
        : "";
      return `SCENE ${si + 1} — ${scene.scene_title}\n\n${shotLines}${audioLine ? `\n\n${audioLine}` : ""}`;
    })
    .join(`\n\n${"─".repeat(60)}\n\n`);

  const timelineLines = assembly_logic.timeline
    .map(
      (t) =>
        `  ${t.timecode} — ${t.instruction}${t.text_hook ? ` "${t.text_hook}"` : ""}`,
    )
    .join("\n");

  const { marketing } = assembly_logic;
  const hashtagLine = marketing.hashtags.join(" ");

  return [
    `[PRODUCTION] ${visual_style.title}`,
    `[STYLE GUIDE] ${visual_style.description}`,
    "",
    "[COLOR PALETTE]",
    paletteLine,
    "",
    `[CINEMATOGRAPHY] ${cinNotes}`,
    "",
    "═".repeat(60),
    "[CHARACTER VAULT]",
    characterLines,
    "",
    "═".repeat(60),
    "[PRODUCTION SLATE]",
    "",
    sceneBlocks,
    "",
    "═".repeat(60),
    "[ASSEMBLY TIMELINE]",
    timelineLines,
    "",
    "═".repeat(60),
    "[MARKETING]",
    `Hook: ${marketing.hook_9x16}`,
    `Caption: ${marketing.caption}`,
    `Hashtags: ${hashtagLine}`,
  ].join("\n");
}

function buildVeo3Prompt(
  scene: Scene,
  shot: Shot,
  visualStyle: VisualStyle,
  audioDirection: AudioDirection[],
  identityVault: Character[],
): string {
  const cinNotes = visualStyle.cinematography_notes.join(", ");
  const audio = audioDirection.find((a) => a.scene_id === scene.scene_id);
  const audioBlock = audio
    ? `Ambient: ${audio.ambient} | Rhythmic: ${audio.rhythmic} | Ethereal: ${audio.ethereal}`
    : "No audio direction available";
  const characters = identityVault
    .map((c) => `${c.name}: ${c.visual_dna}`)
    .join("\n");

  return [
    `[VISUAL STYLE] ${visualStyle.title} — ${cinNotes}`,
    "",
    `[SHOT] ${shot.action_beat}`,
    "",
    `[CAMERA] ${shot.camera_direction}`,
    "",
    `[CINEMATOGRAPHY] ${shot.cinematography} | Duration: ${shot.duration_seconds}s`,
    "",
    `[AUDIO] ${audioBlock}`,
    "",
    "[CHARACTERS]",
    characters,
  ].join("\n");
}

interface ShotCard {
  scene: Scene;
  shot: Shot;
  sceneIndex: number;
  shotIndex: number;
  globalIndex: number;
  prompt: string;
}

function CopyButton({ prompt, ocid }: { prompt: string; ocid: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      data-ocid={ocid}
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-3 shrink-0 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 mr-1.5 text-green-500" />
          <span className="text-xs text-green-500">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 mr-1.5" />
          <span className="text-xs">Copy</span>
        </>
      )}
    </Button>
  );
}

interface AssemblyLogicTabProps {
  blueprint: Blueprint | null;
  title: string;
}

export default function AssemblyLogicTab({
  blueprint,
  title,
}: AssemblyLogicTabProps) {
  if (!blueprint) {
    return (
      <div
        data-ocid="assembly.empty_state"
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <LayoutList className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg font-display">
          Generate a blueprint to see assembly logic
        </p>
        <p className="text-muted-foreground/50 text-sm mt-2">
          Timeline and marketing pack will appear after manuscript ingestion
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const json = JSON.stringify(blueprint, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cineforge-blueprint.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Blueprint exported.");
  };

  const { timeline, marketing } = blueprint.assembly_logic;

  return (
    <div className="space-y-10">
      {/* Export Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {title || "Production Blueprint"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {timeline.length} timeline entries · {marketing.hashtags.length}{" "}
            hashtags
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="assembly.export_pack_button"
            variant="outline"
            onClick={() => {
              exportPack(blueprint, title);
              toast.success("Export pack downloaded: JSON + Python script.");
            }}
            className="h-10 px-5 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 transition-colors"
          >
            <PackageOpen className="mr-2 h-4 w-4" />
            Export Pack
          </Button>
          <Button
            data-ocid="assembly.export_button"
            onClick={handleExport}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5"
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Timeline Table */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
          Edit Decision List (Timeline)
        </h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground uppercase tracking-widest w-28">
                  Timecode
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-widest">
                  Instruction
                </TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-widest">
                  Text Hook
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeline.map((entry, index) => (
                <TableRow
                  key={`${entry.timecode}-${index}`}
                  className="border-border hover:bg-card/50 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-primary font-bold whitespace-nowrap">
                    {entry.timecode}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {entry.instruction}
                  </TableCell>
                  <TableCell>
                    {entry.text_hook ? (
                      <span
                        className="inline-block px-3 py-1 rounded text-xs font-bold italic"
                        style={{
                          background: "oklch(0.76 0.145 75 / 0.12)",
                          color: "oklch(0.76 0.145 75)",
                          border: "1px solid oklch(0.76 0.145 75 / 0.3)",
                        }}
                      >
                        "{entry.text_hook}"
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">
                        —
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.section>

      {/* Veo 3 Prompts */}
      {(() => {
        const shotCards: ShotCard[] = [];
        let globalIndex = 0;
        blueprint.shot_list.forEach((scene, si) => {
          scene.shots.forEach((shot, sj) => {
            globalIndex++;
            shotCards.push({
              scene,
              shot,
              sceneIndex: si + 1,
              shotIndex: sj + 1,
              globalIndex,
              prompt: buildVeo3Prompt(
                scene,
                shot,
                blueprint.visual_style,
                blueprint.audio_direction,
                blueprint.identity_vault,
              ),
            });
          });
        });

        return (
          <motion.section
            data-ocid="assembly.veo3_prompt.panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-4 w-4 text-primary" />
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Veo 3 Prompts
              </h3>
              <span className="ml-1 text-xs text-muted-foreground/50">
                — {shotCards.length} copy-ready prompt
                {shotCards.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {/* Master Prompt Card */}
              {(() => {
                const masterPrompt = buildMasterPrompt(blueprint);
                return (
                  <div
                    data-ocid="assembly.master_prompt.card"
                    className="bg-card border rounded-xl overflow-hidden"
                    style={{
                      borderColor: "oklch(0.76 0.145 75 / 0.4)",
                      boxShadow:
                        "0 0 20px oklch(0.76 0.145 75 / 0.15), inset 0 1px 0 oklch(0.76 0.145 75 / 0.08)",
                    }}
                  >
                    {/* Card Header */}
                    <div
                      className="flex items-center justify-between px-4 py-3 border-b"
                      style={{
                        borderColor: "oklch(0.76 0.145 75 / 0.25)",
                        background: "oklch(0.76 0.145 75 / 0.06)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider"
                          style={{ color: "oklch(0.76 0.145 75)" }}
                        >
                          <Video className="h-3.5 w-3.5" />
                          Master Prompt — Full Production
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded font-semibold"
                          style={{
                            background: "oklch(0.76 0.145 75 / 0.15)",
                            color: "oklch(0.76 0.145 75)",
                          }}
                        >
                          All Scenes · All Characters · Full Slate
                        </span>
                      </div>
                      <CopyButton
                        prompt={masterPrompt}
                        ocid="assembly.master_prompt_copy_button"
                      />
                    </div>

                    {/* Prompt Block */}
                    <pre
                      className="text-xs font-mono leading-relaxed text-foreground/80 p-4 overflow-y-auto whitespace-pre-wrap break-words"
                      style={{
                        maxHeight: "400px",
                        background: "oklch(0.12 0.015 260 / 0.7)",
                      }}
                    >
                      {masterPrompt}
                    </pre>
                  </div>
                );
              })()}

              {shotCards.length === 0 ? (
                <div
                  data-ocid="assembly.veo3_prompt.empty_state"
                  className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground/50 text-sm"
                >
                  No shots found in the production slate.
                </div>
              ) : (
                shotCards.map((card) => (
                  <div
                    key={`${card.scene.scene_id}-${card.shot.shot_id}`}
                    data-ocid={`assembly.veo3_prompt.item.${card.globalIndex}`}
                    className="bg-card border border-border rounded-lg overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono font-bold text-primary shrink-0">
                          Scene {card.sceneIndex} · Shot {card.shotIndex}
                        </span>
                        <span className="text-xs text-muted-foreground/50 shrink-0">
                          —
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {card.scene.scene_title}
                        </span>
                      </div>
                      <CopyButton
                        prompt={card.prompt}
                        ocid={`assembly.veo3_copy_button.${card.globalIndex}`}
                      />
                    </div>

                    {/* Prompt Block */}
                    <pre
                      className="text-xs font-mono leading-relaxed text-foreground/80 p-4 overflow-y-auto whitespace-pre-wrap break-words"
                      style={{
                        maxHeight: "300px",
                        background: "oklch(0.14 0.01 260 / 0.6)",
                      }}
                    >
                      {card.prompt}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        );
      })()}

      {/* Marketing Pack */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-4 w-4 text-primary" />
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Marketing Pack
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 9:16 Hook Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              9:16 On-Screen Hook
            </p>
            <blockquote className="text-xl font-display font-bold text-primary leading-snug">
              "{marketing.hook_9x16}"
            </blockquote>
          </div>

          {/* Caption Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Viral Caption
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {marketing.caption}
            </p>
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-4 p-5 bg-card border border-border rounded-lg">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Hashtags
          </p>
          <div className="flex flex-wrap gap-2">
            {marketing.hashtags.map((tag) => (
              <Badge
                key={tag}
                className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 cursor-default text-sm font-semibold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
