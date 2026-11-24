import { CaseFile, Suspect, Clue, SceneHotspot, SceneTheme, Victim } from '../../types/game';

interface TemplateScene {
  theme: SceneTheme;
  title: string;
  briefing: string;
  victimPool: Array<{
    name: string;
    title: string;
    estimatedTimeOfDeath: string;
    apparentCause: string;
    foundLocation: string;
    backgroundBrief: string;
  }>;
  hotspotLayout: Array<{
    id: string;
    name: string;
    xPercent: number;
    yPercent: number;
    requiresUV: boolean;
    icon: string;
  }>;
}

const SCENE_TEMPLATES: TemplateScene[] = [
  {
    theme: 'victorian_study',
    title: 'The Study at Blackwood Manor',
    briefing: 'Lord Reginald Blackwood was found slumped across his mahogany desk shortly after midnight. Heavy rain has washed away outdoor tracks, leaving all suspects stranded inside the estate.',
    victimPool: [
      {
        name: 'Lord Reginald Blackwood',
        title: 'Industrialist & Antiquities Collector',
        estimatedTimeOfDeath: 'Between 11:15 PM and 11:45 PM',
        apparentCause: 'Acute respiratory collapse, signs of cyanotic poisoning.',
        foundLocation: 'Slumped over antique leather blotter, Study desk.',
        backgroundBrief: 'A reclusive billionaire who rewritten his will three days ago, stripping heirs of their trust funds.'
      },
      {
        name: 'Sir Arthur Pendelton',
        title: 'Retired High Court Magistrate',
        estimatedTimeOfDeath: 'Between 11:30 PM and 12:00 AM',
        apparentCause: 'Blunt trauma to the occipital bone from a heavy brass object.',
        foundLocation: 'Behind the velvet reading armchair, Study library alcove.',
        backgroundBrief: 'Presided over high-profile corruption trials; was writing a tell-all memoir detailing high-society scandals.'
      }
    ],
    hotspotLayout: [
      { id: 'desk', name: 'Mahogany Writing Desk', xPercent: 52, yPercent: 58, requiresUV: false, icon: 'FileText' },
      { id: 'wall_safe', name: 'Gilded Wall Safe', xPercent: 23, yPercent: 32, requiresUV: false, icon: 'Lock' },
      { id: 'fireplace', name: 'Granite Hearth & Mantle', xPercent: 78, yPercent: 44, requiresUV: false, icon: 'Flame' },
      { id: 'bookshelf', name: 'Archive Bookshelf', xPercent: 12, yPercent: 52, requiresUV: false, icon: 'BookOpen' },
      { id: 'window_sill', name: 'Leaded Glass French Window', xPercent: 88, yPercent: 62, requiresUV: false, icon: 'Compass' },
      { id: 'floor_carpet', name: 'Persian Rug Centerpiece', xPercent: 45, yPercent: 74, requiresUV: true, icon: 'Footprints' },
      { id: 'liquor_cabinet', name: 'Crystal Decanter Bar', xPercent: 68, yPercent: 30, requiresUV: true, icon: 'Wine' },
      { id: 'wall_portrait', name: 'Oil Portrait of the Ancestor', xPercent: 38, yPercent: 25, requiresUV: true, icon: 'Sparkles' }
    ]
  },
  {
    theme: 'jazz_club_office',
    title: 'Backstage Office at The Velvet Lounge',
    briefing: 'Club proprietor "Lucky" Lorenzo was discovered in his private soundproof office during the intermission of the midnight jazz revue. The jazz quartet was playing so loudly no one heard the altercation.',
    victimPool: [
      {
        name: '"Lucky" Vito Lorenzo',
        title: 'Jazz Club Owner & Bookmaker',
        estimatedTimeOfDeath: 'Between 11:20 PM and 11:50 PM',
        apparentCause: 'Single puncture wound to the chest through silk waistcoat.',
        foundLocation: 'Sprawled behind the counting desk near open safe.',
        backgroundBrief: 'Ran high-stakes underground poker and held leverage against half the city council.'
      }
    ],
    hotspotLayout: [
      { id: 'desk', name: 'Bookmaker Counter Desk', xPercent: 48, yPercent: 60, requiresUV: false, icon: 'DollarSign' },
      { id: 'wall_safe', name: 'Cast-Iron Vault Door', xPercent: 18, yPercent: 38, requiresUV: false, icon: 'ShieldAlert' },
      { id: 'fireplace', name: 'Cast Iron Stove & Ashbin', xPercent: 82, yPercent: 52, requiresUV: false, icon: 'Flame' },
      { id: 'bookshelf', name: 'Vinyl Record Rack & Shelves', xPercent: 14, yPercent: 65, requiresUV: false, icon: 'Disc' },
      { id: 'window_sill', name: 'Fire Escape Window', xPercent: 86, yPercent: 28, requiresUV: false, icon: 'Key' },
      { id: 'floor_carpet', name: 'Spilled Bourbon Stains', xPercent: 42, yPercent: 78, requiresUV: true, icon: 'Search' },
      { id: 'liquor_cabinet', name: 'Art-Deco Liquor Cart', xPercent: 64, yPercent: 36, requiresUV: true, icon: 'Wine' },
      { id: 'wall_portrait', name: 'Framed Show Poster', xPercent: 34, yPercent: 28, requiresUV: true, icon: 'Eye' }
    ]
  }
];

interface SuspectArchetype {
  name: string;
  role: string;
  age: number;
  relation: string;
  motiveTemplate: string;
  alibiTemplate: string;
  actualActivityTemplate: string;
  demeanor: string;
  testimonyTemplate: string;
  avatarSeed: string;
}

const SUSPECT_ARCHETYPES: SuspectArchetype[] = [
  {
    name: 'Eleanor Vance',
    role: 'Private Secretary',
    age: 32,
    relation: 'Managed all personal correspondence and daily appointments for 5 years.',
    motiveTemplate: 'Was recently caught forging signatures on ledger disbursements.',
    alibiTemplate: 'I was in the east conservatory taking dictation notes from 11:00 PM until 12:15 AM. You can ask anyone.',
    actualActivityTemplate: 'Slip into the study to retrieve the incriminating black ledger before the police arrived.',
    demeanor: 'Calm and precise, but nervously clutching a lace handkerchief with embroidered initials.',
    testimonyTemplate: '"The Lord was agitated all evening. He said someone close to him was a traitor. I left him to his privacy at eleven."',
    avatarSeed: 'eleanor'
  },
  {
    name: 'Julian Montgomery',
    role: 'Disinherited Nephew & Gambler',
    age: 28,
    relation: 'Eldest surviving nephew; had his monthly allowance revoked yesterday.',
    motiveTemplate: 'Massive debt to downtown loan sharks due at midnight.',
    alibiTemplate: 'I was at the Grand Central Hotel dining room until midnight, having oysters and port with three acquaintances.',
    actualActivityTemplate: 'Arrived at the estate via the back service lane at 11:20 PM to demand money.',
    demeanor: 'Arrogant and defensive, wearing a tailored double-breasted suit smelling of expensive Turkish tobacco.',
    testimonyTemplate: '"My uncle was paranoid and miserable. But I have an airtight alibi, Detective. Check the hotel bill if you doubt me."',
    avatarSeed: 'julian'
  },
  {
    name: 'Dr. Alistair Sterling',
    role: 'Personal Physician',
    age: 54,
    relation: 'Lifelong friend and medical advisor with free access to the estate.',
    motiveTemplate: 'The victim discovered the doctor was misdiagnosing illnesses to charge exorbitant treatments.',
    alibiTemplate: 'I was in the dispensary downstairs compounding digitalis heart tinctures until 12:30 AM without interruption.',
    actualActivityTemplate: 'Met secretly in the corridor to argue over medical license blackmail.',
    demeanor: 'Weary, dignified, with slight tremors in his fingers and spectacles perched on his nose.',
    testimonyTemplate: '"Reginald’s heart was fragile as spun glass. Any sudden shock or improper dose could have triggered myocardial arrest."',
    avatarSeed: 'sterling'
  },
  {
    name: 'Madame Beatrice Laurent',
    role: 'Visiting Opera Singer & Guest',
    age: 41,
    relation: 'Longtime acquaintance who was promised financing for her European tour.',
    motiveTemplate: 'The victim abruptly withdrew sponsorship contracts worth fifty thousand pounds.',
    alibiTemplate: 'I retired to the guest suite at 10:30 PM with a severe migraine and slept through the storm until the sirens rang.',
    actualActivityTemplate: 'Paced outside the study door attempting to slip an appeal letter under the threshold.',
    demeanor: 'Theatrical and dramatic, wrapped in a black silk shawl and vintage pearls.',
    testimonyTemplate: '"A tragic loss to art and culture. I was fast asleep with lavender oil on my temples. I heard nothing through these thick oak doors."',
    avatarSeed: 'beatrice'
  }
];

export function generateMysteryCase(seedModifier: number = Date.now()): CaseFile {
  // Deterministic or randomized scenario pick
  const sceneTemplate = SCENE_TEMPLATES[seedModifier % SCENE_TEMPLATES.length];
  const victim = sceneTemplate.victimPool[seedModifier % sceneTemplate.victimPool.length];

  // Pick 3 suspects
  const shuffledSuspects = [...SUSPECT_ARCHETYPES].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Pick one suspect as the actual culprit
  const culpritIndex = Math.floor(Math.random() * shuffledSuspects.length);
  const culpritArchetype = shuffledSuspects[culpritIndex];

  // Case details
  const caseId = `case-${seedModifier.toString(36)}`;
  const caseNumber = `NOIR-${Math.floor(100 + Math.random() * 899)}`;
  const dateStr = 'November 14, 1947 — 01:15 AM';

  // Weapon variations
  const weapons = [
    {
      title: 'Scorched Antique Brass Paperweight',
      hotspotId: 'fireplace',
      category: 'Weapon' as const,
      short: 'Heavy solid brass figurine with blunt edge, found partly buried in fireplace ashes.',
      full: 'Forensic examination shows trace hair strands and microscopic dried blood on the left base edge. The soot suggests someone hurriedly attempted to incinerate biological residue.',
      uv: 'Under ultraviolet light, faint iridescent bone dust luminescence glows along the base curve.',
      breakdownReason: 'Matched blunt occipital skull fracture angle.'
    },
    {
      title: 'Cyanide-Dipped Crystal Decanter Stopper',
      hotspotId: 'liquor_cabinet',
      category: 'Weapon' as const,
      short: 'Ornate faceted crystal stopper coated in an unusual bitter almond smelling resin.',
      full: 'Chemical reagent drop test produces Prussian blue reaction, indicating high concentration of potassium cyanide applied directly to the contact rim.',
      uv: 'UV blacklight reveals glowing powdery fingerprints on the glass facet, matching ring finger ridge patterns.',
      breakdownReason: 'Prussian blue chemical test confirms lethal cyanide dose matching victim’s asphyxiation.'
    },
    {
      title: 'Inlaid Pearl Letter Opener Stiletto',
      hotspotId: 'desk',
      category: 'Weapon' as const,
      short: 'Slender Italian stiletto disguised as an antique letter opener, wiped clean with oil.',
      full: 'The blade tip displays micro-grooves and faint microscopic hemoglobin traces trapped inside the filigree engraving.',
      uv: 'UV reveals wiped blood spatter streaks radiating outward from the brass hilt guard.',
      breakdownReason: 'Triangular wound channel precisely matches the custom Italian blade bevel.'
    }
  ];

  const chosenWeapon = weapons[seedModifier % weapons.length];

  // Contradiction Clues (The definitive smoking gun that disproves culprit's alibi)
  const contradictionClues = [
    {
      title: 'Waterlogged Train Ticket & Stub',
      hotspotId: 'window_sill',
      category: 'Timeline' as const,
      short: 'First-class commuter rail ticket stub stamped 11:42 PM arrival from Grand Central.',
      full: 'The ticket was punched by the conductor on the late express. The time stamp completely disproves any claim of having been inside the manor or hotel dining room before midnight.',
      uv: 'UV blacklight reveals faint rain-droplet smear patterns and conductor’s fluorescent validation stamp.',
      disprovedAlibiNote: 'Disproves the alibi of being at the Grand Central Hotel dining room from 11:00 PM.'
    },
    {
      title: 'Torn Monogrammed Pocket Square',
      hotspotId: 'floor_carpet',
      category: 'Forensic Trace' as const,
      short: 'Torn fragment of Egyptian cotton handkerchief caught in the heavy drawer runner.',
      full: 'The fabric fiber analysis confirms high-thread count cotton matching the private secretary’s monogram pattern. Strands were pulled under high velocity during a struggle.',
      uv: 'UV blacklight causes the starch treatment on the fibers to fluoresce brightly, highlighting embroidered script initials.',
      disprovedAlibiNote: 'Proves presence directly at the victim’s desk during the struggle, contrary to conservatory claims.'
    },
    {
      title: 'Prescription Ledger & Pharmacy Dispatch',
      hotspotId: 'wall_safe',
      category: 'Timeline' as const,
      short: 'Courier dispatch log with signed delivery receipt dated 11:35 PM tonight.',
      full: 'The registered courier signed off on a delivery receipt in the main hall at 11:35 PM, proving the person claiming to be in the basement dispensary was actually upstairs intercepting packages.',
      uv: 'UV light exposes an overwritten time alteration on the dispatch sheet where "11:35 PM" was forged into "10:00 PM".',
      disprovedAlibiNote: 'Proves the alibi of working uninterrupted in the dispensary was fabricated.'
    }
  ];

  const chosenContradiction = contradictionClues[(seedModifier + 1) % contradictionClues.length];

  // Other contextual clues in the scene
  const otherClues: Clue[] = [
    {
      id: 'clue-will',
      hotspotId: 'desk',
      title: 'Draft of Revoked Last Will & Testament',
      type: 'document',
      category: 'Motive',
      shortDescription: 'Freshly inked legal document dated yesterday disinheriting beneficiaries.',
      fullForensicNote: 'The testator’s ink is still barely dry on page three. A red wax seal is stamped with the family signet, leaving the vast majority of the fortune to an anonymous overseas trust.',
      isKeyEvidence: false,
      iconName: 'FileText'
    },
    {
      id: 'clue-safe-dials',
      hotspotId: 'wall_safe',
      title: 'Scratched Safe Tumbler Dial',
      type: 'physical',
      category: 'Physical Item' as any,
      shortDescription: 'Combination safe found cracked three inches ajar with the lock dial forced.',
      fullForensicNote: 'Microscopic examination indicates the safe was opened with the correct combination, not brute-forced. Only three people in the household held the combination.',
      isKeyEvidence: false,
      iconName: 'Lock'
    },
    {
      id: 'clue-glass-uv',
      hotspotId: 'liquor_cabinet',
      title: 'Wiped Crystal Tumbler',
      type: 'forensic_uv',
      category: 'Forensic Trace',
      shortDescription: 'Two crystal tumblers on the silver tray, one wiped dry with a cloth.',
      fullForensicNote: 'The clean glass contains faint traces of almond-scented chemical residue around the inner lip. The cloth used to wipe it left lint fibers on the base.',
      uvRevelation: 'Under UV light, three luminescent fingerprints are visible on the base of the tumbler, untouched by the hasty wipe.',
      isKeyEvidence: false,
      iconName: 'Wine'
    },
    {
      id: 'clue-cipher',
      hotspotId: 'wall_portrait',
      title: 'Hidden Message Behind Ancestral Canvas',
      type: 'forensic_uv',
      category: 'Document',
      shortDescription: 'Faint chalk and grease pencil numbers written directly onto the wallpaper behind the frame.',
      fullForensicNote: 'The numbers correspond to safe combination sequence 42-18-87, followed by the initials of the culprit.',
      uvRevelation: 'Phosphor residue reveals the date: "Nov 14 — Payment due or else."',
      isKeyEvidence: false,
      iconName: 'Sparkles'
    },
    {
      id: 'clue-muddy-prints',
      hotspotId: 'floor_carpet',
      title: 'Faint Muddy Heel Imprint',
      type: 'physical',
      category: 'Timeline',
      shortDescription: 'Size 9 men’s dress brogue heel impression pointing toward the French doors.',
      fullForensicNote: 'Clay composition matches the red loam of the estate rose garden path, which was soaked in rain starting at 11:15 PM.',
      isKeyEvidence: false,
      iconName: 'Footprints'
    },
    {
      id: 'clue-bookshelf-book',
      hotspotId: 'bookshelf',
      title: 'Hollowed-Out Toxicology Compendium',
      type: 'physical',
      category: 'Forensic Trace',
      shortDescription: 'Leather-bound volume of "Forensic Alkaloids" with the center pages cut out.',
      fullForensicNote: 'The cutout interior held a small amber glass vial, now missing. Traces of white powder adhere to the velvet lining.',
      isKeyEvidence: false,
      iconName: 'BookOpen'
    }
  ];

  // Key clues
  const weaponClue: Clue = {
    id: 'clue-weapon-key',
    hotspotId: chosenWeapon.hotspotId,
    title: chosenWeapon.title,
    type: chosenWeapon.uv ? 'forensic_uv' : 'physical',
    category: chosenWeapon.category,
    shortDescription: chosenWeapon.short,
    fullForensicNote: chosenWeapon.full,
    uvRevelation: chosenWeapon.uv,
    isKeyEvidence: true,
    contradictionReason: chosenWeapon.breakdownReason,
    iconName: chosenWeapon.category === 'Weapon' ? 'ShieldAlert' : 'Wine'
  };

  const contradictionClue: Clue = {
    id: 'clue-contradiction-key',
    hotspotId: chosenContradiction.hotspotId,
    title: chosenContradiction.title,
    type: 'alibi_break',
    category: chosenContradiction.category,
    shortDescription: chosenContradiction.short,
    fullForensicNote: chosenContradiction.full,
    uvRevelation: chosenContradiction.uv,
    isKeyEvidence: true,
    contradictsSuspectId: `suspect-${culpritIndex}`,
    contradictionReason: chosenContradiction.disprovedAlibiNote,
    iconName: 'AlertCircle'
  };

  const allClues = [weaponClue, contradictionClue, ...otherClues];

  // Build Suspect objects
  const suspects: Suspect[] = shuffledSuspects.map((arch, idx) => {
    const isCulprit = idx === culpritIndex;
    return {
      id: `suspect-${idx}`,
      name: arch.name,
      role: arch.role,
      age: arch.age,
      relationToVictim: arch.relation,
      motive: arch.motiveTemplate,
      statedAlibi: isCulprit ? arch.alibiTemplate : `I was accounted for in the library lounge, reading the evening bulletin. Several household staff saw me between 11:00 PM and midnight.`,
      actualActivity: isCulprit ? arch.actualActivityTemplate : arch.alibiTemplate,
      demeanor: arch.demeanor,
      testimony: arch.testimonyTemplate,
      crossExaminationClueId: isCulprit ? contradictionClue.id : undefined,
      breakdownQuote: isCulprit 
        ? `"Damn you and your prying light! He was going to ruin my life... he didn't leave me any choice!"`
        : undefined,
      isCulprit,
      avatarSeed: arch.avatarSeed
    };
  });

  // Hotspots
  const hotspots: SceneHotspot[] = sceneTemplate.hotspotLayout.map(h => ({
    ...h,
    radiusPx: 48,
    discovered: false
  }));

  return {
    id: caseId,
    caseNumber,
    title: `${sceneTemplate.title}: The Murder of ${victim.name.split(' ').slice(-1)[0]}`,
    dateString: dateStr,
    sceneTheme: sceneTemplate.theme,
    sceneName: sceneTemplate.title,
    briefing: sceneTemplate.briefing,
    victim,
    suspects,
    clues: allClues,
    hotspots,
    solution: {
      culpritId: `suspect-${culpritIndex}`,
      keyWeaponClueId: weaponClue.id,
      keyContradictionClueId: contradictionClue.id,
      explanation: `The murderer is ${suspects[culpritIndex].name}. While they claimed an airtight alibi, the ${contradictionClue.title} proved their presence and timing at the crime scene. Furthermore, the fatal act was committed using the ${weaponClue.title}, which bore their irrefutable forensic traces.`
    }
  };
}
