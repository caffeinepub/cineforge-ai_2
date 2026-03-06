import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CameraIcon, Clock, Copy, Film } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Blueprint } from "../types/blueprint";

interface VisionTabProps {
  blueprint: Blueprint | null;
}

export default function VisionTab({ blueprint }: VisionTabProps) {
  if (!blueprint || blueprint.shot_list.length === 0) {
    return (
      <div
        data-ocid="vision.empty_state"
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <Film className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg font-display">
          Ingest a manuscript to see your shot list
        </p>
        <p className="text-muted-foreground/50 text-sm mt-2">
          The Vision tab will populate with cinematic shot sequences
        </p>
      </div>
    );
  }

  let globalShotIndex = 0;

  return (
    <div className="space-y-12">
      {blueprint.shot_list.map((scene, sceneIndex) => (
        <motion.section
          key={scene.scene_id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sceneIndex * 0.1 }}
        >
          {/* Scene Header */}
          <div className="flex items-end gap-4 mb-6">
            <span className="font-display text-6xl font-black text-primary/20 leading-none select-none">
              {scene.scene_id}
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Scene
              </p>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {scene.scene_title}
              </h2>
            </div>
          </div>

          {/* Shot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scene.shots.map((shot, shotIndex) => {
              globalShotIndex++;
              const ocidIndex = globalShotIndex;
              return (
                <motion.div
                  key={shot.shot_id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: sceneIndex * 0.1 + shotIndex * 0.06 }}
                  className="bg-card rounded-lg border border-border border-l-0 overflow-hidden group hover:border-primary/30 transition-colors"
                >
                  {/* Amber left border */}
                  <div className="flex h-full">
                    <div className="w-1 flex-shrink-0 bg-primary/60 group-hover:bg-primary transition-colors" />
                    <div className="flex-1 p-4 space-y-3">
                      {/* Shot Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary font-bold tracking-wider">
                          {shot.shot_id}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Clock className="h-3 w-3" />
                          {shot.duration_seconds}s
                        </div>
                      </div>

                      {/* Camera Direction */}
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                          <CameraIcon className="h-3 w-3" />
                          Camera
                        </p>
                        <p className="text-sm text-foreground leading-snug font-medium">
                          {shot.camera_direction}
                        </p>
                      </div>

                      {/* Action Beat */}
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                          Action
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {shot.action_beat}
                        </p>
                      </div>

                      {/* Cinematography Badge */}
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary bg-primary/5"
                      >
                        {shot.cinematography}
                      </Badge>

                      {/* Copy Button */}
                      <Button
                        data-ocid={`shot.copy_button.${ocidIndex}`}
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent/10 mt-1"
                        onClick={() => {
                          const prompt = `Shot: ${shot.shot_id}\nCamera: ${shot.camera_direction}\nAction: ${shot.action_beat}\nCinematography: ${shot.cinematography}\nDuration: ${shot.duration_seconds}s`;
                          navigator.clipboard.writeText(prompt);
                          toast.success("Shot prompt copied.");
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Shot Prompt
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
