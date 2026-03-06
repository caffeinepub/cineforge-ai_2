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
import { Download, LayoutList, Megaphone } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Blueprint } from "../types/blueprint";

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
        <Button
          data-ocid="assembly.export_button"
          onClick={handleExport}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5"
        >
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
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
