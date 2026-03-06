import type {
  AudioDirection,
  Blueprint,
  Character,
  Scene,
  Shot,
  TimelineEntry,
} from "../types/blueprint";

const DRAMATIC_KEYWORDS = [
  "fire",
  "water",
  "ancestor",
  "spirit",
  "death",
  "born",
  "power",
  "source",
  "sacred",
  "ritual",
  "migration",
  "blood",
  "earth",
  "light",
  "darkness",
  "rise",
  "fall",
  "war",
  "peace",
  "ceremony",
  "name",
  "heal",
  "die",
  "live",
  "king",
  "queen",
  "chief",
  "god",
  "holy",
  "ancient",
  "machine",
  "engine",
  "wire",
  "electric",
  "soul",
  "memory",
  "river",
  "mountain",
  "plateau",
  "dust",
];

const WATER_KEYWORDS = [
  "water",
  "river",
  "mami",
  "rain",
  "flow",
  "stream",
  "lake",
  "ocean",
  "source",
];
const ENGINE_KEYWORDS = [
  "engine",
  "machine",
  "wire",
  "mechanic",
  "motor",
  "truck",
  "vehicle",
  "repair",
  "fix",
];
const CEREMONY_KEYWORDS = [
  "ceremony",
  "ancestor",
  "spirit",
  "ritual",
  "name",
  "sacred",
  "elder",
  "chief",
  "bell",
];

function tokenize(text: string): string[] {
  return text
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isProperNoun(word: string): boolean {
  return /^[A-Z][a-z]{2,}$/.test(word) && !STOP_WORDS.has(word);
}

const STOP_WORDS = new Set([
  "The",
  "A",
  "An",
  "In",
  "On",
  "At",
  "By",
  "For",
  "With",
  "To",
  "Of",
  "And",
  "Or",
  "But",
  "Is",
  "Are",
  "Was",
  "Were",
  "Be",
  "Been",
  "Being",
  "Have",
  "Has",
  "Had",
  "Do",
  "Does",
  "Did",
  "Will",
  "Would",
  "Could",
  "Should",
  "May",
  "Might",
  "Shall",
  "Can",
  "From",
  "Into",
  "Upon",
  "This",
  "That",
  "These",
  "Those",
  "He",
  "She",
  "It",
  "They",
  "We",
  "I",
  "You",
  "His",
  "Her",
  "Its",
  "Their",
  "Our",
  "My",
  "Your",
  "Who",
  "Which",
  "What",
  "When",
  "Where",
  "Why",
  "How",
  "All",
  "Each",
  "Every",
  "Both",
  "Few",
  "More",
  "Most",
  "Other",
  "Some",
  "Such",
  "Then",
  "Than",
  "So",
  "As",
  "If",
  "While",
  "After",
  "Before",
  "During",
  "There",
  "Here",
  "Now",
  "Also",
  "Only",
  "Just",
  "Very",
  "Much",
  "Many",
]);

function extractCharacters(text: string): Character[] {
  const tokens = tokenize(text);
  const nameCounts: Record<string, number> = {};

  for (const word of tokens) {
    if (isProperNoun(word)) {
      nameCounts[word] = (nameCounts[word] || 0) + 1;
    }
  }

  const candidates = Object.entries(nameCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name]) => name);

  if (candidates.length === 0) {
    // Fallback: extract any capitalized word appearing once
    const singleCandidates = Object.entries(nameCounts)
      .filter(([, count]) => count >= 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);
    candidates.push(...singleCandidates);
  }

  const archetypes = [
    "The Visionary",
    "The Keeper of Order",
    "The Trickster-Sage",
    "The Divine Feminine",
    "The Founding Father",
    "The Wanderer",
  ];

  const roles = [
    "Central Figure",
    "The Guardian",
    "The Catalyst",
    "The Spirit Guide",
    "The Elder",
    "The Seeker",
  ];

  const vdnaTemplates = [
    (name: string) =>
      `Weathered presence marked by years of purpose. ${name} carries the weight of lineage in every gesture. Eyes that speak before words do. An authority earned through sacrifice and silence.`,
    (name: string) =>
      `Commanding figure rooted in tradition and earth. ${name} moves with deliberate gravity. The land recognizes them. Their voice carries the frequency of old things that refuse to be forgotten.`,
    (name: string) =>
      `Fluid and unpredictable, ${name} exists between worlds. They see the unseen mechanism beneath surface reality. Their hands know things their tongue cannot say. A bridge between eras.`,
    (name: string) =>
      `Luminous and ancient, ${name} embodies transformation itself. Their arrival reshapes the atmosphere. Half-present, half-myth. Every encounter leaves those nearby fundamentally altered.`,
    (name: string) =>
      `Broad-shouldered keeper of forgotten knowledge. ${name} wears history like a second skin. Scarification tells their biography. Silence from them means more than speech from others.`,
    (name: string) =>
      `Restless seeker navigating between old and new worlds. ${name} carries a wound and a gift in equal measure. Their eyes hold distances most people never travel to.`,
  ];

  return candidates.map((name, i) => ({
    name,
    role: roles[i % roles.length],
    archetype: archetypes[i % archetypes.length],
    visual_dna: vdnaTemplates[i % vdnaTemplates.length](name),
  }));
}

function scoreSentence(sentence: string): number {
  const lower = sentence.toLowerCase();
  let score = sentence.length * 0.01;
  for (const kw of DRAMATIC_KEYWORDS) {
    if (lower.includes(kw)) score += 10;
  }
  return score;
}

function extractDramaticSentences(text: string): string[] {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  return sentences
    .map((s) => ({ text: s, score: scoreSentence(s) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.text);
}

function buildShots(
  sentence: string,
  sceneIndex: number,
  scenePrefixes: string[],
): Shot[] {
  const lowerText = sentence.toLowerCase();
  const hasWater = WATER_KEYWORDS.some((k) => lowerText.includes(k));
  const hasEngine = ENGINE_KEYWORDS.some((k) => lowerText.includes(k));
  const hasCeremony = CEREMONY_KEYWORDS.some((k) => lowerText.includes(k));

  const baseScene = scenePrefixes[sceneIndex] || `S0${sceneIndex + 1}`;

  const shotTemplates: Shot[] = [];

  if (hasCeremony) {
    shotTemplates.push(
      {
        shot_id: `${baseScene}-01`,
        camera_direction:
          "Slow overhead crane shot descending into the gathering",
        action_beat: `Firelight illuminates faces in concentric rings. The air is thick with expectation. ${sentence.substring(0, 80)}...`,
        cinematography: "Deep Focus, warm practical firelight only",
        duration_seconds: 10,
      },
      {
        shot_id: `${baseScene}-02`,
        camera_direction:
          "Extreme close-up on the elder's lips, rack focus to the crowd",
        action_beat:
          "Words spoken that will echo for generations. A bell rings once, clear and resonant. Silence holds.",
        cinematography: "Macro lens, 120fps slow motion",
        duration_seconds: 5,
      },
      {
        shot_id: `${baseScene}-03`,
        camera_direction: "Wide shot pulling back to reveal the full sky",
        action_beat:
          "The crowd responds. The sound rises to meet the stars. The moment crystallizes into history.",
        cinematography: "Tilt-shift effect, stars in sharp focus",
        duration_seconds: 7,
      },
    );
  } else if (hasEngine) {
    shotTemplates.push(
      {
        shot_id: `${baseScene}-01`,
        camera_direction: "Handheld close-up following skilled hands at work",
        action_beat: `Fingers trace the problem methodically. ${sentence.substring(0, 80)}... Sweat drops onto hot surface.`,
        cinematography: "Handheld, naturalistic tungsten light",
        duration_seconds: 7,
      },
      {
        shot_id: `${baseScene}-02`,
        camera_direction:
          "Extreme close-up on the critical detail, cut to widening eyes",
        action_beat:
          "The root cause revealed. A beat of silence. Then understanding floods the face. A slow smile forms.",
        cinematography: "Shallow focus, warm practical light",
        duration_seconds: 5,
      },
      {
        shot_id: `${baseScene}-03`,
        camera_direction: "Wide shot — resolution, bystanders react",
        action_beat:
          "The machine or situation transforms. Dust erupts. Crowd reacts. Cut to black.",
        cinematography: "Static wide, rack focus from subject to environment",
        duration_seconds: 6,
      },
    );
  } else if (hasWater) {
    shotTemplates.push(
      {
        shot_id: `${baseScene}-01`,
        camera_direction:
          "Low-angle shot at water's surface, camera barely above the waterline",
        action_beat: `The water carries meaning beyond its physical form. ${sentence.substring(0, 80)}... Mist rises in the early light.`,
        cinematography: "Anamorphic lens flares, polarized filter",
        duration_seconds: 8,
      },
      {
        shot_id: `${baseScene}-02`,
        camera_direction:
          "Underwater shot looking up at the surface, a figure's silhouette visible",
        action_beat:
          "The boundary between worlds made visible. What lives below and what walks above exist in parallel.",
        cinematography: "Underwater housing, diffused natural light",
        duration_seconds: 5,
      },
      {
        shot_id: `${baseScene}-03`,
        camera_direction:
          "Wide establishing shot as figure emerges from water, backlit",
        action_beat:
          "Transformation made physical. The crossing is complete. The world is irrevocably altered.",
        cinematography: "Golden hour backlight, haze filter",
        duration_seconds: 7,
      },
    );
  } else {
    // Default: migration/journey type
    shotTemplates.push(
      {
        shot_id: `${baseScene}-01`,
        camera_direction:
          "Aerial establishing shot descending slowly from altitude",
        action_beat: `${sentence.substring(0, 100)}... The landscape dwarfs the human story unfolding within it.`,
        cinematography: "70mm IMAX wide",
        duration_seconds: 8,
      },
      {
        shot_id: `${baseScene}-02`,
        camera_direction: "Low-angle tracking shot at ground level",
        action_beat:
          "Movement has weight. Each step carries history. The ground remembers.",
        cinematography: "Deep Focus, f/16",
        duration_seconds: 6,
      },
      {
        shot_id: `${baseScene}-03`,
        camera_direction:
          "Medium close-up on the protagonist's face, tracking alongside",
        action_beat:
          "They do not look back. Forward is the only direction left. Eyes carry the burden of purpose.",
        cinematography: "Shallow depth of field, bokeh environment behind",
        duration_seconds: 5,
      },
    );
  }

  return shotTemplates;
}

function detectSceneType(sentence: string): string {
  const lower = sentence.toLowerCase();
  if (CEREMONY_KEYWORDS.some((k) => lower.includes(k))) return "The Ceremony";
  if (ENGINE_KEYWORDS.some((k) => lower.includes(k))) return "The Discovery";
  if (WATER_KEYWORDS.some((k) => lower.includes(k))) return "The Crossing";
  if (
    lower.includes("migrat") ||
    lower.includes("journey") ||
    lower.includes("walk") ||
    lower.includes("move")
  )
    return "The Migration";
  if (
    lower.includes("death") ||
    lower.includes("die") ||
    lower.includes("kill")
  )
    return "The Reckoning";
  if (
    lower.includes("born") ||
    lower.includes("birth") ||
    lower.includes("new")
  )
    return "The Birth";
  return "The Revelation";
}

function buildAudioDirections(
  sentences: string[],
  sceneIds: string[],
): AudioDirection[] {
  return sentences.map((sentence, i) => {
    const lower = sentence.toLowerCase();
    const hasWater = WATER_KEYWORDS.some((k) => lower.includes(k));
    const hasEngine = ENGINE_KEYWORDS.some((k) => lower.includes(k));
    const hasCeremony = CEREMONY_KEYWORDS.some((k) => lower.includes(k));
    const sceneId = sceneIds[i] || `S0${i + 1}`;

    if (hasCeremony) {
      return {
        scene_id: sceneId,
        ambient:
          "Crackling fire, night insects, soft breathing of a large crowd. Complete absence of wind.",
        rhythmic:
          "Single bell strike at ceremony peak. Silence held for 3 full seconds before any music re-enters.",
        ethereal:
          "Sacred water harmonic undertone: distant river, droplets on stone, rising overtones suggesting presence.",
        bpm: 0,
        music_prompt:
          "Sacred ceremony soundscape, near silence, single bronze bell, fire crackle, night insects, rising to euphoric climax, no drums, pure vocal and bell, spiritual frequency, 528Hz healing tone.",
      };
    }
    if (hasEngine) {
      return {
        scene_id: sceneId,
        ambient:
          "Hot engine tick, metal expansion sounds, distant birds, boot scrape on dry earth.",
        rhythmic:
          "Engine diagnostic rhythm: irregular tapping resolving into syncopated mechanical groove at 95 BPM.",
        ethereal:
          "Tension drone: bowed metal, rising frequency, cut to silence before ignition. The silence IS the tension.",
        bpm: 95,
        music_prompt:
          "Mechanical tension build, engine diagnostic percussion, 95 BPM syncopated groove, bowed metal drone rising to cut-silence, then explosive climax, industrial-African fusion, no melody until resolution.",
      };
    }
    if (hasWater) {
      return {
        scene_id: sceneId,
        ambient:
          "River current, water on stone, wind through reeds, distant frogs calling.",
        rhythmic:
          "Water percussion: dripping into pools at variable tempo, building to 60 BPM current-rush.",
        ethereal:
          "Mami Wata harmonic signature: female voice layered with river resonance at 432Hz, otherworldly and magnetic.",
        bpm: 60,
        music_prompt:
          "Aquatic spiritual ambience, river current, water percussion 60 BPM, female voice overtone, 432Hz tuning, Mami Wata presence sonic signature, mystical and transformative.",
      };
    }
    return {
      scene_id: sceneId,
      ambient:
        "Dry wind across open plateau, distant cattle, sparse trees rustling. Sub-bass earth resonance.",
      rhythmic:
        "Kalimba and djembe at 72 BPM. Slow, processional. Builds every 8 bars with additional percussion.",
      ethereal:
        "Low female choir humming a pentatonic ancestor melody. Fades in and out like memory. Frequency: 432Hz.",
      bpm: 72,
      music_prompt:
        "Processional African epic, 72 BPM, kalimba lead, djembe rhythm section, female choir undertone, dry plateau ambience, building tension, cinematic scope, pentatonic scale, 432Hz tuning.",
    };
  });
}

function buildTimeline(scenes: Scene[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      timecode: "0:00-0:03",
      instruction: "Cold open — black screen",
      text_hook: "A STORY WRITTEN IN DUST",
    },
  ];

  let timeSeconds = 3;

  scenes.forEach((scene, si) => {
    scene.shots.forEach((shot, shi) => {
      const start = formatTime(timeSeconds);
      const end = formatTime(timeSeconds + shot.duration_seconds);
      const isLastShot =
        si === scenes.length - 1 && shi === scene.shots.length - 1;

      const entry: TimelineEntry = {
        timecode: `${start}-${end}`,
        instruction: `${scene.scene_id} Shot ${shi + 1} — ${shot.camera_direction.substring(0, 40)}`,
      };

      if (isLastShot) {
        entry.text_hook = "Dead things don't die.";
      } else if (shi === scene.shots.length - 1 && si === 1) {
        entry.text_hook = "The healing has begun.";
      }

      entries.push(entry);
      timeSeconds += shot.duration_seconds;

      if (shi === scene.shots.length - 1 && si < scenes.length - 1) {
        entries.push({
          timecode: `${formatTime(timeSeconds)}-${formatTime(timeSeconds + 2)}`,
          instruction: "Hard cut to black — 2 second beat",
        });
        timeSeconds += 2;
      }
    });
  });

  entries.push({
    timecode: `${formatTime(timeSeconds)}-${formatTime(timeSeconds + 3)}`,
    instruction: "Fade to black — title card",
    text_hook: "FROM THE SOURCE",
  });

  return entries;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function deriveColorPalette(text: string) {
  const lower = text.toLowerCase();
  const hasGold =
    lower.includes("gold") ||
    lower.includes("amber") ||
    lower.includes("copper");
  const hasBlue =
    lower.includes("blue") ||
    lower.includes("ocean") ||
    lower.includes("river") ||
    lower.includes("water");
  const hasGreen =
    lower.includes("forest") ||
    lower.includes("green") ||
    lower.includes("jungle");

  return [
    {
      name: "Fertile Soil",
      hex: "#6B3A2A",
      role: "Dominant shadow and ground",
    },
    {
      name: "Dust & Warmth",
      hex: hasGold ? "#E8B84B" : "#C4874A",
      role: "Midtone warmth, skin highlights",
    },
    {
      name: "Deep Water",
      hex: hasBlue ? "#2E5F8A" : "#4A7C9E",
      role: "Water scenes, spiritual moments",
    },
    {
      name: "Ancestral Gold",
      hex: "#E8B84B",
      role: "Ceremonial light, title cards",
    },
    {
      name: "Night Sky",
      hex: hasGreen ? "#1A2E1A" : "#2C1810",
      role: "Deep shadow, night sequences",
    },
  ];
}

export function generateBlueprint(manuscript: string): Blueprint {
  const characters = extractCharacters(manuscript);
  const dramaticSentences = extractDramaticSentences(manuscript);

  // Ensure we have 3 sentences
  while (dramaticSentences.length < 3) {
    const fallbacks = [
      "The land remembers those who walked upon it and carried the weight of generations.",
      "In the silence between heartbeats, the old world and the new world negotiate their terms.",
      "What was broken shall be made whole again by hands that refused to stop working.",
    ];
    dramaticSentences.push(fallbacks[dramaticSentences.length]);
  }

  const sceneIds = ["S01", "S02", "S03"];
  const sceneTitles = dramaticSentences.map((s) => detectSceneType(s));

  const shotList: Scene[] = dramaticSentences.map((sentence, i) => ({
    scene_id: sceneIds[i],
    scene_title: sceneTitles[i],
    shots: buildShots(sentence, i, sceneIds),
  }));

  const audioDirections = buildAudioDirections(dramaticSentences, sceneIds);
  const timeline = buildTimeline(shotList);
  const colorPalette = deriveColorPalette(manuscript);

  const wordCount = manuscript.split(/\s+/).length;
  const hasWater = WATER_KEYWORDS.some((k) =>
    manuscript.toLowerCase().includes(k),
  );
  const hasEngine = ENGINE_KEYWORDS.some((k) =>
    manuscript.toLowerCase().includes(k),
  );

  return {
    visual_style: {
      title: "Gilded Earth Realism",
      description:
        "A visual language rooted in ochre dust and ancestral memory, where warm saturated earth tones anchor every frame. Light behaves like liquid gold at dusk, bending toward the sacred.",
      color_palette: colorPalette,
      cinematography_notes: [
        "70mm IMAX for wide landscape vistas",
        "Deep Focus during ceremonial sequences",
        "Low-angle Tracking Shot for movement and migration",
        "Parallax Scrolling for ancestral flashback sequences",
        ...(hasWater ? ["Underwater anamorphic for water spirit scenes"] : []),
        ...(hasEngine ? ["Handheld intimacy for mechanical diagnostics"] : []),
        ...(wordCount > 500
          ? ["Slow-motion at 120fps for critical revelation moments"]
          : []),
      ],
    },
    identity_vault:
      characters.length > 0
        ? characters
        : [
            {
              name: "The Protagonist",
              role: "Central Figure",
              archetype: "The Visionary",
              visual_dna:
                "Weathered presence carrying the weight of their world. Eyes that have seen the old order and the new. Movements deliberate, unhurried, each one an act of intention.",
            },
          ],
    shot_list: shotList,
    audio_direction: audioDirections,
    assembly_logic: {
      timeline,
      marketing: {
        hook_9x16:
          "They said it was impossible. They forgot who built it in the first place.",
        caption:
          "Some stories don't just get told — they demand to be witnessed. This is what it looks like when history becomes cinema. 🔥",
        hashtags: [
          "#AfricanCinema",
          "#CineForgeAI",
          "#DeadThingsDontDie",
          "#GildedEarthRealism",
          "#TheSource",
        ],
      },
    },
  };
}
