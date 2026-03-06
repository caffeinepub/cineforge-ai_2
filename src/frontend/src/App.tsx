import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clapperboard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AssemblyLogicTab from "./components/AssemblyLogicTab";
import AudioDirectionTab from "./components/AudioDirectionTab";
import IdentityVaultTab from "./components/IdentityVaultTab";
import IngestTab from "./components/IngestTab";
import RenderingLabTab from "./components/RenderingLabTab";
import VisionTab from "./components/VisionTab";
import type { Blueprint } from "./types/blueprint";

type TabId = "ingest" | "vision" | "vault" | "audio" | "assembly" | "lab";

const TABS: { id: TabId; label: string; shortLabel: string }[] = [
  { id: "ingest", label: "Ingest", shortLabel: "Ingest" },
  { id: "vision", label: "The Vision", shortLabel: "Vision" },
  { id: "vault", label: "Identity Vault", shortLabel: "Vault" },
  { id: "audio", label: "Audio Direction", shortLabel: "Audio" },
  { id: "assembly", label: "Assembly Logic", shortLabel: "Assembly" },
  { id: "lab", label: "Rendering Lab", shortLabel: "Lab" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("ingest");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [title, setTitle] = useState("");
  const [manuscript, setManuscript] = useState("");

  const handleBlueprintGenerated = (bp: Blueprint, t: string) => {
    setBlueprint(bp);
    setTitle(t);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "oklch(0.76 0.145 75 / 0.15)",
                border: "1px solid oklch(0.76 0.145 75 / 0.3)",
              }}
            >
              <Clapperboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-none">
                Cine<span className="text-primary">Forge</span> AI
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
                Production Slate Generator
              </p>
            </div>
          </div>

          {/* Blueprint status */}
          {blueprint && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {title || "Untitled Slate"}
              </span>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border rounded-lg p-1.5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  data-ocid={`${tab.id === "vault" ? "vault" : tab.id === "lab" ? "lab" : tab.id}.tab`}
                  className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition-all
                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                    data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <TabsContent
                  value="ingest"
                  forceMount
                  className={activeTab === "ingest" ? "" : "hidden"}
                >
                  <IngestTab
                    onBlueprintGenerated={handleBlueprintGenerated}
                    currentBlueprint={blueprint}
                    currentTitle={title}
                    setCurrentTitle={setTitle}
                    manuscript={manuscript}
                    setManuscript={setManuscript}
                  />
                </TabsContent>

                <TabsContent
                  value="vision"
                  forceMount
                  className={activeTab === "vision" ? "" : "hidden"}
                >
                  <VisionTab blueprint={blueprint} />
                </TabsContent>

                <TabsContent
                  value="vault"
                  forceMount
                  className={activeTab === "vault" ? "" : "hidden"}
                >
                  <IdentityVaultTab blueprint={blueprint} />
                </TabsContent>

                <TabsContent
                  value="audio"
                  forceMount
                  className={activeTab === "audio" ? "" : "hidden"}
                >
                  <AudioDirectionTab blueprint={blueprint} />
                </TabsContent>

                <TabsContent
                  value="assembly"
                  forceMount
                  className={activeTab === "assembly" ? "" : "hidden"}
                >
                  <AssemblyLogicTab blueprint={blueprint} title={title} />
                </TabsContent>

                <TabsContent
                  value="lab"
                  forceMount
                  className={activeTab === "lab" ? "" : "hidden"}
                >
                  <RenderingLabTab blueprint={blueprint} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clapperboard className="h-3.5 w-3.5 text-primary/60" />
            <span>CineForge AI — Professional Cinematic Production Slate</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
