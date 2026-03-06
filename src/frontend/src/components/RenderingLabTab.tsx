import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Film, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Blueprint } from "../types/blueprint";

interface RenderingLabTabProps {
  blueprint: Blueprint | null;
}

export default function RenderingLabTab({ blueprint }: RenderingLabTabProps) {
  if (!blueprint || blueprint.shot_list.length === 0) {
    return (
      <div
        data-ocid="lab.empty_state"
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <Film className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg font-display">
          Generate a blueprint to prepare render slots
        </p>
        <p className="text-muted-foreground/50 text-sm mt-2">
          Render slots will be created for each shot in your production slate
        </p>
      </div>
    );
  }

  // Flatten all shots
  const allShots = blueprint.shot_list.flatMap((scene) =>
    scene.shots.map((shot) => ({
      ...shot,
      scene_title: scene.scene_title,
      scene_id: scene.scene_id,
    })),
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5"
      >
        <Zap className="h-5 w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">
            {allShots.length} render slots ready.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect a video generation API (e.g., Veo 3) to synthesize pixels.
            Rendering is not available in this environment.
          </p>
        </div>
      </motion.div>

      {/* Render Slot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {allShots.map((shot, index) => (
          <motion.div
            key={shot.shot_id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Film Frame Placeholder */}
            <div className="relative aspect-video bg-[oklch(0.08_0.008_30)] flex items-center justify-center overflow-hidden">
              {/* Film strip holes */}
              <div className="absolute top-0 left-0 right-0 h-3 flex gap-2 px-2 items-center bg-black/40">
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-3 flex gap-2 px-2 items-center bg-black/40">
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
                <div className="w-2.5 h-1.5 rounded-sm bg-foreground/20 flex-shrink-0" />
              </div>

              {/* Center content */}
              <div className="text-center space-y-2 px-4">
                <Film className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                <p className="font-mono text-xs text-muted-foreground/40">
                  SLOT EMPTY
                </p>
                <p className="font-mono text-xs text-primary/40">
                  {shot.shot_id}
                </p>
              </div>

              {/* Status overlay */}
              <div className="absolute top-4 right-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-border text-muted-foreground/50"
                >
                  Pending
                </Badge>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary font-bold">
                  {shot.shot_id}
                </span>
                <span className="text-xs text-muted-foreground">
                  {shot.scene_id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {shot.camera_direction}
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled
                className="w-full text-xs border-border text-muted-foreground/40 cursor-not-allowed"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
