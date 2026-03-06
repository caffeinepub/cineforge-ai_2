import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Loader2,
  Play,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateSlate,
  useDeleteSlate,
  useGetSlate,
  useGetSlates,
} from "../hooks/useQueries";
import type { Blueprint } from "../types/blueprint";
import { generateBlueprint } from "../utils/blueprintEngine";
import { DEMO_BLUEPRINT, DEMO_MANUSCRIPT } from "../utils/demoBlueprint";

interface IngestTabProps {
  onBlueprintGenerated: (blueprint: Blueprint, title: string) => void;
  currentBlueprint: Blueprint | null;
  currentTitle: string;
  setCurrentTitle: (t: string) => void;
  manuscript: string;
  setManuscript: (m: string) => void;
}

export default function IngestTab({
  onBlueprintGenerated,
  currentBlueprint,
  currentTitle,
  setCurrentTitle,
  manuscript,
  setManuscript,
}: IngestTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: slates, isLoading: slatesLoading } = useGetSlates();
  const createSlate = useCreateSlate();
  const deleteSlate = useDeleteSlate();
  const getSlate = useGetSlate();

  const handleGenerate = () => {
    if (!manuscript.trim()) {
      toast.error("Please paste a manuscript first.");
      return;
    }
    setIsGenerating(true);
    // Simulate a brief "thinking" moment for UX
    setTimeout(() => {
      try {
        const bp = generateBlueprint(manuscript);
        onBlueprintGenerated(bp, currentTitle || "Untitled Slate");
        toast.success("Blueprint generated successfully.");
      } catch {
        toast.error("Failed to generate blueprint. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 600);
  };

  const handleLoadDemo = () => {
    setManuscript(DEMO_MANUSCRIPT);
    setCurrentTitle("The Source — Kola/Kampanda Demo");
    onBlueprintGenerated(DEMO_BLUEPRINT, "The Source — Kola/Kampanda Demo");
    toast.success("Demo slate loaded.");
  };

  const handleSave = async () => {
    if (!currentBlueprint) {
      toast.error("Generate a blueprint first.");
      return;
    }
    try {
      const title = currentTitle.trim() || "Untitled Slate";
      await createSlate.mutateAsync({
        title,
        jsonBlob: JSON.stringify(currentBlueprint),
      });
      toast.success("Slate saved.");
    } catch {
      toast.error("Failed to save slate.");
    }
  };

  const handleLoad = async (id: bigint, title: string) => {
    try {
      const json = await getSlate.mutateAsync(id);
      const bp = JSON.parse(json) as Blueprint;
      onBlueprintGenerated(bp, title);
      setCurrentTitle(title);
      toast.success(`Loaded: ${title}`);
    } catch {
      toast.error("Failed to load slate.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteSlate.mutateAsync(id);
      toast.success("Slate deleted.");
    } catch {
      toast.error("Failed to delete slate.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Input */}
      <div className="space-y-2">
        <label
          htmlFor="ingest-title"
          className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
        >
          Production Title
        </label>
        <Input
          id="ingest-title"
          data-ocid="ingest.title_input"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          placeholder="Enter your production title..."
          className="bg-card border-border text-foreground text-lg h-12 font-display placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Manuscript Textarea */}
      <div className="space-y-2">
        <label
          htmlFor="ingest-manuscript"
          className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
        >
          Raw Manuscript
        </label>
        <Textarea
          id="ingest-manuscript"
          data-ocid="ingest.textarea"
          value={manuscript}
          onChange={(e) => setManuscript(e.target.value)}
          placeholder="Paste your manuscript here..."
          className="bg-card border-border text-foreground resize-none min-h-[320px] font-sans text-sm leading-relaxed placeholder:text-muted-foreground/40"
          rows={14}
        />
        <p className="text-xs text-muted-foreground">
          {manuscript.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          data-ocid="ingest.generate_button"
          onClick={handleGenerate}
          disabled={isGenerating || !manuscript.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-semibold tracking-wide"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Blueprint
            </>
          )}
        </Button>

        <Button
          data-ocid="ingest.demo_button"
          variant="secondary"
          onClick={handleLoadDemo}
          className="h-11 px-6"
        >
          <Play className="mr-2 h-4 w-4" />
          Load Demo
        </Button>

        <Button
          data-ocid="ingest.save_button"
          variant="outline"
          onClick={handleSave}
          disabled={!currentBlueprint || createSlate.isPending}
          className="h-11 px-6 border-border hover:border-primary/50"
        >
          {createSlate.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Slate
            </>
          )}
        </Button>
      </div>

      {/* Status Feedback */}
      {createSlate.isSuccess && (
        <motion.div
          data-ocid="ingest.success_state"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-green-400"
        >
          <CheckCircle className="h-4 w-4" />
          Slate saved successfully.
        </motion.div>
      )}
      {createSlate.isError && (
        <div
          data-ocid="ingest.error_state"
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4" />
          Save failed. Please try again.
        </div>
      )}

      {/* Saved Slates */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Saved Slates
        </h3>

        {slatesLoading ? (
          <div
            data-ocid="slates.loading_state"
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading slates...
          </div>
        ) : !slates || slates.length === 0 ? (
          <p
            data-ocid="slates.empty_state"
            className="text-muted-foreground text-sm italic"
          >
            No saved slates yet.
          </p>
        ) : (
          <ul data-ocid="slates.list" className="space-y-2">
            {slates.map(([id, title], index) => (
              <motion.li
                key={id.toString()}
                data-ocid={`slates.item.${index + 1}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {id.toString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    data-ocid={`slates.load_button.${index + 1}`}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLoad(id, title)}
                    disabled={getSlate.isPending}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                  <Button
                    data-ocid={`slates.delete_button.${index + 1}`}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(id)}
                    disabled={deleteSlate.isPending}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
