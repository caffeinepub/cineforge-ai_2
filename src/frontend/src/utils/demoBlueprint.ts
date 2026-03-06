import type { Blueprint } from "../types/blueprint";

export const DEMO_MANUSCRIPT = `The Kola people had always lived west of the great Kampanda plateau, in the shadow of the mountains that older men called the Ancestors' Spine. When the drought came in the seventh year of Lusaka's reign, it came like a sentence — final and without appeal.

Lusaka, the ancestor-king, made the decision that would echo for three hundred years. He gathered Kazembe, his most trusted chieftain, and the elders who remembered the old migrations, and he spoke words that would be carved into the plateau rock: "We do not wait for the water to find us. We go to the source."

The migration from the west was unlike any movement of people before it. Two hundred souls, four hundred cattle, everything that could be carried on a back or pulled by an animal. The red laterite dust rose behind them like smoke from a fire that had not yet been lit.

It was Mwansabombwe who discovered the powerhouse red wire. The truck — a 1973 Bedford that had somehow survived two decades of plateau roads — had died three kilometers from the new settlement site. Mwansabombwe, the bush mechanic, laid his hands on the engine the way a healer lays hands on the sick. His fingers traced wire bundles in the dark engine bay, guided by something that was not quite sight and not quite knowledge but something older than both. The red wire, frayed at its connection, glowed faintly in the afternoon heat. He whispered what his grandmother had told him: "Dead things don't die. They wait."

The naming ceremony for the first child born on the plateau was held under a sky thick with stars. Kazembe held the child aloft. The fire illuminated fifty elders seated in concentric rings. When the name "Mwansabombwe" was given to the infant — a name meaning "one who emerges from the deep" — a bell rang once, clear and resonant across the new land. The crowd erupted in ululation that reached the stars. The healing had begun.

Mami Wata, the water spirit of the eastern river, was seen by three women at the source site on the morning the first well was dug. They described her as luminous, half-woman half-current, her hair like river reeds and her skin like moonlit water. They said she smiled and stepped backward into the water, and where she had stood, the ground was wet in the shape of a blessing.`;

export const DEMO_BLUEPRINT: Blueprint = {
  visual_style: {
    title: "Gilded Earth Realism",
    description:
      "A visual language rooted in the ochre dust of the Kampanda plateau, where ancestral memory bleeds into the present. Warm, saturated earth tones anchor every frame. Light behaves like liquid gold at dusk.",
    color_palette: [
      {
        name: "Fertile Soil",
        hex: "#6B3A2A",
        role: "Dominant shadow and ground",
      },
      {
        name: "Kampanda Dust",
        hex: "#C4874A",
        role: "Midtone warmth, skin highlights",
      },
      {
        name: "Source Water",
        hex: "#4A7C9E",
        role: "Water scenes, spiritual moments",
      },
      {
        name: "Ancestral Gold",
        hex: "#E8B84B",
        role: "Ceremonial light, title cards",
      },
      {
        name: "Plateau Sky",
        hex: "#2C1810",
        role: "Deep shadow, night sequences",
      },
    ],
    cinematography_notes: [
      "70mm IMAX for wide plateau vistas",
      "Deep Focus during the naming ceremony",
      "Low-angle Tracking Shot for the cattle migration",
      "Parallax Scrolling for ancestral flashback sequences",
      "Handheld intimacy for Mwansabombwe's engine diagnostics",
    ],
  },
  identity_vault: [
    {
      name: "Mwansabombwe",
      role: "The Bush Mechanic",
      archetype: "Trickster-Sage",
      visual_dna:
        "Weathered hands stained with engine oil and red laterite dust. Eyes that diagnose machines and men alike. A worn blue coverall, always one button undone. Calm authority in chaos.",
    },
    {
      name: "Lusaka",
      role: "The Ancestor-King",
      archetype: "The Founding Father",
      visual_dna:
        "Tall, draped in leopard skin and copper beads. Moves with the weight of lineage. Deep-set eyes that see across centuries. Voice like distant thunder over the plateau.",
    },
    {
      name: "Kazembe",
      role: "The Chieftain",
      archetype: "The Keeper of Order",
      visual_dna:
        "Broad-shouldered elder with a carved walking staff. Face mapped with ritual scarification. Commands silence without speaking. Wears the colors of the Kampanda earth.",
    },
    {
      name: "Mami Wata",
      role: "The Water Spirit",
      archetype: "The Divine Feminine",
      visual_dna:
        "Luminous presence emerging from river mist. Half-woman, half-current. Hair like river reeds, skin like moonlit water. Her arrival signals transformation and danger simultaneously.",
    },
  ],
  shot_list: [
    {
      scene_id: "S01",
      scene_title: "The Migration From The West",
      shots: [
        {
          shot_id: "S01-01",
          camera_direction:
            "Aerial establishing shot, drone descending slowly onto the plateau from 400m",
          action_beat:
            "Vast ochre landscape. A column of 200 people and cattle emerge from the treeline moving east. Dust rises like smoke.",
          cinematography: "70mm IMAX wide",
          duration_seconds: 8,
        },
        {
          shot_id: "S01-02",
          camera_direction:
            "Low-angle tracking shot at ground level following the hooves of cattle",
          action_beat:
            "Red dust coats everything. The rhythmic percussion of hooves fills the audio. A child's bare feet step between cattle hooves with ease.",
          cinematography: "Deep Focus, f/16",
          duration_seconds: 6,
        },
        {
          shot_id: "S01-03",
          camera_direction:
            "Medium close-up on Lusaka's face, tracking alongside him",
          action_beat:
            "Lusaka stares forward, jaw set, copper beads catching the last light. He does not look back. Ever.",
          cinematography: "Shallow depth of field, bokeh migration behind",
          duration_seconds: 5,
        },
      ],
    },
    {
      scene_id: "S02",
      scene_title: "The Naming Ceremony",
      shots: [
        {
          shot_id: "S02-01",
          camera_direction:
            "Slow overhead crane shot descending into the ceremony circle",
          action_beat:
            "Firelight. 50 elders seated in concentric rings. A newborn is held aloft by Kazembe. Absolute silence before the name is spoken.",
          cinematography: "Deep Focus, warm practical firelight only",
          duration_seconds: 10,
        },
        {
          shot_id: "S02-02",
          camera_direction:
            "Extreme close-up on the elder's lips, then rack focus to the baby's eyes",
          action_beat:
            "The name 'Mwansabombwe' is spoken. The baby's eyes open wide. A bell rings once, clear and resonant.",
          cinematography: "Macro lens, 120fps slow motion",
          duration_seconds: 4,
        },
        {
          shot_id: "S02-03",
          camera_direction:
            "Wide shot pulling back to reveal the plateau sky full of stars",
          action_beat:
            "The crowd erupts in ululation. The sound rises to meet the stars. Text hook appears: 'The healing has begun.'",
          cinematography: "Tilt-shift effect, stars in sharp focus",
          duration_seconds: 7,
        },
      ],
    },
    {
      scene_id: "S03",
      scene_title: "The Discovery of the Red Wire",
      shots: [
        {
          shot_id: "S03-01",
          camera_direction:
            "Handheld close-up following Mwansabombwe's hands inside the engine bay",
          action_beat:
            "Fingers trace wire bundles methodically. Sweat drops onto hot metal. The camera tilts to reveal a single red wire, frayed and glowing faintly.",
          cinematography: "Handheld, naturalistic tungsten light",
          duration_seconds: 7,
        },
        {
          shot_id: "S03-02",
          camera_direction:
            "Extreme close-up on the red wire, then cut to Mwansabombwe's eyes widening",
          action_beat:
            "He recognizes the fault. A beat of silence. Then a slow smile. The engine ticks. He whispers: 'Dead things don't die.'",
          cinematography: "Shallow focus, warm practical light",
          duration_seconds: 5,
        },
        {
          shot_id: "S03-03",
          camera_direction:
            "Wide shot — engine roars to life, Mwansabombwe steps back, cattle scatter",
          action_beat:
            "The machine LIVES. Dust erupts. The crowd cheers. Cut to black. Text hook: 'Dead things don't die.'",
          cinematography: "Static wide, rack focus crowd to machine",
          duration_seconds: 6,
        },
      ],
    },
  ],
  audio_direction: [
    {
      scene_id: "S01",
      ambient:
        "Dry wind across open plateau, distant cattle lowing, sparse acacia trees rustling. Sub-bass earth resonance.",
      rhythmic:
        "Kalimba and djembe at 72 BPM. Slow, processional. Builds every 8 bars with additional percussion voices.",
      ethereal:
        "Low female choir humming a pentatonic ancestor melody. Fades in and out like memory. Frequency: 432Hz tuning.",
      bpm: 72,
      music_prompt:
        "Gemini Lyria prompt: Processional African epic, 72 BPM, kalimba lead, djembe rhythm section, female choir undertone, dry plateau ambience, building tension, cinematic scope, pentatonic scale, 432Hz tuning, no Western instrumentation.",
    },
    {
      scene_id: "S02",
      ambient:
        "Crackling fire, night insects, soft breathing of a large crowd. Complete absence of wind.",
      rhythmic:
        "Single bell strike at ceremony peak. Silence held for 3 full seconds before any music re-enters.",
      ethereal:
        "Mami Wata water sounds: distant river, droplets on stone, rising harmonic overtones suggesting presence. Mixed low under the ceremony.",
      bpm: 0,
      music_prompt:
        "Gemini Lyria prompt: Sacred ceremony soundscape, near silence, single bronze bell, fire crackle, night insects, Mami Wata water harmonic undertone, rising to euphoric ululation climax, no drums, pure vocal and bell, spiritual frequency, 528Hz healing tone.",
    },
    {
      scene_id: "S03",
      ambient:
        "Hot engine tick, metal expansion sounds, distant birds, boot scrape on dry earth.",
      rhythmic:
        "Engine diagnostic rhythm: irregular tapping that slowly resolves into a syncopated mechanical groove at 95 BPM. Builds to engine ignition.",
      ethereal:
        "Tension drone: bowed metal, rising frequency, cut to silence before engine fires. The silence IS the tension.",
      bpm: 95,
      music_prompt:
        "Gemini Lyria prompt: Mechanical tension build, engine diagnostic percussion, 95 BPM syncopated groove, bowed metal drone rising to cut-silence, then explosive engine roar climax, crowd cheer audio burst, industrial-African fusion, no melody until resolution, pure rhythm and texture.",
    },
  ],
  assembly_logic: {
    timeline: [
      {
        timecode: "0:00-0:03",
        instruction: "Cold open — black screen",
        text_hook: "FROM THE DUST OF KAMPANDA",
      },
      {
        timecode: "0:03-0:11",
        instruction: "Scene S01 Shot 1 — aerial establishing",
      },
      {
        timecode: "0:11-0:17",
        instruction: "Scene S01 Shot 2 — cattle hooves tracking",
      },
      { timecode: "0:17-0:22", instruction: "Scene S01 Shot 3 — Lusaka face" },
      {
        timecode: "0:22-0:24",
        instruction: "Hard cut to black — 2 second beat",
      },
      {
        timecode: "0:24-0:34",
        instruction: "Scene S02 Shot 1 — ceremony crane descent",
      },
      {
        timecode: "0:34-0:38",
        instruction: "Scene S02 Shot 2 — macro naming moment",
      },
      {
        timecode: "0:38-0:45",
        instruction: "Scene S02 Shot 3 — wide sky pullback",
        text_hook: "The healing has begun.",
      },
      { timecode: "0:45-0:47", instruction: "Fade to black — 2 second beat" },
      {
        timecode: "0:47-0:54",
        instruction: "Scene S03 Shot 1 — engine hands handheld",
      },
      {
        timecode: "0:54-0:59",
        instruction: "Scene S03 Shot 2 — red wire discovery",
      },
      {
        timecode: "0:59-1:05",
        instruction: "Scene S03 Shot 3 — engine fires, crowd erupts",
        text_hook: "Dead things don't die.",
      },
      {
        timecode: "1:05-1:08",
        instruction: "Fade to black — title card",
        text_hook: "THE SOURCE",
      },
    ],
    marketing: {
      hook_9x16: "They said the machine was dead. They forgot who built it.",
      caption:
        "The Kola people didn't just migrate to the Kampanda plateau. They carried an entire civilization on their backs. This is what that looks like in motion. 🔥 #TheSource",
      hashtags: [
        "#KampandaStories",
        "#AfricanCinema",
        "#TheSource",
        "#DeadThingsDontDie",
        "#GildedEarthRealism",
      ],
    },
  },
};
