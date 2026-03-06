# CineForge AI

## Current State
The Assembly Logic tab shows:
- Per-shot Veo 3 prompts (one card per shot, each with a Copy button)
- Each prompt combines: visual style, shot action beat, camera direction, cinematography, audio direction, and all character DNA

## Requested Changes (Diff)

### Add
- A "Master Prompt" section at the top of the Veo 3 Prompts area in the Assembly Logic tab
- The master prompt combines ALL scenes, ALL shots, full character vault, visual style, and audio direction into a single coherent text block
- A one-click "Copy Master Prompt" button for the entire block

### Modify
- `AssemblyLogicTab.tsx`: Add `buildMasterPrompt()` function and a Master Prompt card rendered above the per-shot cards

### Remove
- Nothing removed

## Implementation Plan
1. In `AssemblyLogicTab.tsx`, add a `buildMasterPrompt(blueprint)` function that:
   - Opens with the Visual Style title, palette description, and cinematography notes
   - Lists all characters from the identity vault (name + visual DNA)
   - For each scene: scene title, then each shot's action beat, camera direction, cinematography, duration
   - Appends the audio direction for each scene
   - Appends the assembly timeline text hooks at the end
2. Render a "Master Prompt" card above the per-shot cards in the Veo 3 Prompts section, with a prominent Copy button
3. The card should be visually distinct (e.g. subtle gold/primary border glow) to signal it is the master/full prompt
