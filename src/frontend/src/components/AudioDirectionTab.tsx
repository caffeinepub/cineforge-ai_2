import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Drum, Music, Sparkles, Wind } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Blueprint } from "../types/blueprint";

interface AudioDirectionTabProps {
  blueprint: Blueprint | null;
}

export default function AudioDirectionTab({
  blueprint,
}: AudioDirectionTabProps) {
  if (!blueprint || blueprint.audio_direction.length === 0) {
    return (
      <div
        data-ocid="audio.empty_state"
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <Music className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg font-display">
          Generate a blueprint to see audio direction
        </p>
        <p className="text-muted-foreground/50 text-sm mt-2">
          Sound layers and music prompts will appear after manuscript ingestion
        </p>
      </div>
    );
  }

  // Match audio to scenes for titles
  const sceneMap: Record<string, string> = {};
  for (const scene of blueprint.shot_list) {
    sceneMap[scene.scene_id] = scene.scene_title;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
        {blueprint.audio_direction.length} Sound Profiles
      </p>

      <Accordion type="multiple" defaultValue={["0"]} className="space-y-3">
        {blueprint.audio_direction.map((audio, index) => (
          <motion.div
            key={audio.scene_id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AccordionItem
              value={String(index)}
              className="bg-card border border-border rounded-lg overflow-hidden data-[state=open]:border-primary/40 transition-colors px-0"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                <div className="flex items-center gap-4 text-left">
                  <span className="font-mono text-primary font-bold text-sm">
                    {audio.scene_id}
                  </span>
                  <div>
                    <p className="font-display font-semibold text-foreground group-data-[state=open]:text-primary transition-colors">
                      {sceneMap[audio.scene_id] || `Scene ${audio.scene_id}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sound Profile
                    </p>
                  </div>
                  {audio.bpm > 0 && (
                    <Badge className="ml-auto mr-4 bg-primary/15 text-primary border-primary/30 text-xs font-mono">
                      {audio.bpm} BPM
                    </Badge>
                  )}
                  {audio.bpm === 0 && (
                    <Badge className="ml-auto mr-4 bg-muted text-muted-foreground border-border text-xs">
                      Ceremonial
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 space-y-5">
                {/* Ambient */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    <Wind className="h-3.5 w-3.5" />
                    Ambient Layer
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pl-5 border-l border-border">
                    {audio.ambient}
                  </p>
                </div>

                {/* Rhythmic */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    <Drum className="h-3.5 w-3.5" />
                    Rhythmic Layer
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pl-5 border-l border-primary/40">
                    {audio.rhythmic}
                  </p>
                </div>

                {/* Ethereal */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ethereal Layer
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pl-5 border-l border-blue-400/40">
                    {audio.ethereal}
                  </p>
                </div>

                {/* Music Prompt */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Music Prompt (Gemini Lyria)
                  </p>
                  <div className="relative">
                    <pre className="code-block text-xs whitespace-pre-wrap break-words">
                      {audio.music_prompt}
                    </pre>
                    <Button
                      data-ocid={`audio.copy_button.${index + 1}`}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(audio.music_prompt);
                        toast.success("Music prompt copied.");
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}
