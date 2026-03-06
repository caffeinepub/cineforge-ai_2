export interface ColorPaletteItem {
  name: string;
  hex: string;
  role: string;
}

export interface VisualStyle {
  title: string;
  description: string;
  color_palette: ColorPaletteItem[];
  cinematography_notes: string[];
}

export interface Character {
  name: string;
  role: string;
  archetype: string;
  visual_dna: string;
}

export interface Shot {
  shot_id: string;
  camera_direction: string;
  action_beat: string;
  cinematography: string;
  duration_seconds: number;
}

export interface Scene {
  scene_id: string;
  scene_title: string;
  shots: Shot[];
}

export interface AudioDirection {
  scene_id: string;
  ambient: string;
  rhythmic: string;
  ethereal: string;
  bpm: number;
  music_prompt: string;
}

export interface TimelineEntry {
  timecode: string;
  instruction: string;
  text_hook?: string;
}

export interface MarketingPack {
  hook_9x16: string;
  caption: string;
  hashtags: string[];
}

export interface AssemblyLogic {
  timeline: TimelineEntry[];
  marketing: MarketingPack;
}

export interface Blueprint {
  visual_style: VisualStyle;
  identity_vault: Character[];
  shot_list: Scene[];
  audio_direction: AudioDirection[];
  assembly_logic: AssemblyLogic;
}
