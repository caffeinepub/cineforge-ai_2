# CineForge AI

## Current State
New project. No existing code beyond scaffold.

## Requested Changes (Diff)

### Add
- Manuscript ingestion: a large text input where users paste raw manuscripts
- Blueprint Generator: parses the manuscript and produces a structured JSON "Production Slate" with five sections: visual_style, identity_vault, shot_list, audio_direction, assembly_logic
- The generator runs entirely on the frontend using a deterministic rule-based engine (no external AI APIs) seeded with the Kola/Kampanda story content as a demo
- Tab 1 "Ingest": manuscript input area + "Generate Blueprint" button
- Tab 2 "The Vision": displays the shot_list in card format, each card showing camera direction, action beats, and cinematography notes; includes a "Copy Shot Prompt" button per card
- Tab 3 "Identity Vault": displays character cards with visual DNA descriptions and role tags
- Tab 4 "Audio Direction": shows layered audio prompts (ambient, rhythmic, ethereal) per scene
- Tab 5 "Assembly Logic": timeline instructions, text hook timestamps, and the marketing launch pack (hooks, captions, hashtags)
- Tab 6 "Rendering Lab": gallery grid placeholder for rendered assets; shows empty state with "No renders yet" message; each slot has a download button (disabled until render exists)
- Full JSON export button: downloads the entire blueprint as a .json file
- Backend storage: save and retrieve production slates (title + JSON blob) per user session
- Pre-loaded demo slate based on the Kola/Kampanda "The Source" manuscript so the app is immediately useful

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: define `ProductionSlate` type with id, title, createdAt, jsonBlob fields; expose createSlate, getSlates, getSlate, deleteSlate methods
2. Frontend: build 6-tab layout with persistent tab state
3. Ingest tab: textarea for manuscript, generate button that runs the client-side blueprint engine, auto-populates all other tabs
4. Vision tab: shot cards with camera direction, action beats, copy-prompt button
5. Identity Vault tab: character grid cards with visual DNA
6. Audio Direction tab: layered prompt display per scene
7. Assembly Logic tab: timeline table + marketing pack section
8. Rendering Lab tab: gallery grid with empty/placeholder states
9. JSON export: serialize current slate and trigger browser download
10. Backend save/load: allow saving named slates and reloading them
11. Pre-seed demo slate for the Kola/Kampanda "The Source" story
