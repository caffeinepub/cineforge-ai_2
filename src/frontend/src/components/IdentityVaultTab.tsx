import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { motion } from "motion/react";
import type { Blueprint } from "../types/blueprint";

interface IdentityVaultTabProps {
  blueprint: Blueprint | null;
}

const archetypeColors: Record<string, string> = {
  "Trickster-Sage": "border-amber-500/40 text-amber-400 bg-amber-500/10",
  "The Founding Father":
    "border-orange-500/40 text-orange-400 bg-orange-500/10",
  "The Keeper of Order": "border-slate-400/40 text-slate-300 bg-slate-400/10",
  "The Divine Feminine": "border-blue-400/40 text-blue-300 bg-blue-400/10",
  "The Visionary": "border-yellow-400/40 text-yellow-300 bg-yellow-400/10",
  "The Wanderer": "border-green-400/40 text-green-300 bg-green-400/10",
};

function getArchetypeColor(archetype: string): string {
  return (
    archetypeColors[archetype] || "border-primary/40 text-primary bg-primary/10"
  );
}

export default function IdentityVaultTab({ blueprint }: IdentityVaultTabProps) {
  if (!blueprint || blueprint.identity_vault.length === 0) {
    return (
      <div
        data-ocid="vault.empty_state"
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg font-display">
          Generate a blueprint to populate the Identity Vault
        </p>
        <p className="text-muted-foreground/50 text-sm mt-2">
          Character profiles will appear here after manuscript ingestion
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Style Info */}
      <div className="p-6 rounded-lg bg-card border border-border">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Visual Style
            </p>
            <h2 className="text-2xl font-display font-bold text-primary mb-2">
              {blueprint.visual_style.title}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {blueprint.visual_style.description}
            </p>
          </div>
          {/* Color Palette */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Palette
            </p>
            <div className="flex gap-2">
              {blueprint.visual_style.color_palette.map((color) => (
                <div
                  key={color.name}
                  className="group relative"
                  title={`${color.name}: ${color.hex}`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/10 cursor-default transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {blueprint.visual_style.color_palette.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-muted-foreground">{color.name}</span>
                  <span className="font-mono text-muted-foreground/50">
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cinematography Notes */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Cinematography Notes
          </p>
          <div className="flex flex-wrap gap-2">
            {blueprint.visual_style.cinematography_notes.map((note) => (
              <Badge
                key={note}
                variant="outline"
                className="text-xs border-border text-muted-foreground"
              >
                {note}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Character Roster — {blueprint.identity_vault.length} identities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueprint.identity_vault.map((character, index) => (
            <motion.div
              key={character.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group"
            >
              {/* Character Name + Archetype */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {character.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {character.role}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded border ${getArchetypeColor(character.archetype)}`}
                >
                  {character.archetype}
                </span>
              </div>

              {/* Visual DNA */}
              <div className="border-l-2 border-primary/40 pl-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Visual DNA
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{character.visual_dna}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
