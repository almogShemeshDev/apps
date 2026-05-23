// Mage Knight enemy database
// traits: Fortified, Flying, Swift, Brutal, Poison, Paralyze
// resistances: Physical, Fire, Ice, Arcane
// attackElement: Physical, Fire, Ice, Coldfire

export const ENEMIES = [
  // ── Dungeon enemies ────────────────────────────────────────────
  { id: 'marauding-orcs',     name: 'Marauding Orcs',     armor: 4,  attack: 3, attackElement: 'Physical', traits: [],             resistances: [] },
  { id: 'savage-wolves',      name: 'Savage Wolves',      armor: 3,  attack: 2, attackElement: 'Physical', traits: ['Swift'],       resistances: [] },
  { id: 'dungeon-boss',       name: 'Dungeon Boss',       armor: 7,  attack: 5, attackElement: 'Physical', traits: ['Brutal'],      resistances: ['Physical'] },
  { id: 'crypt-worm',         name: 'Crypt Worm',         armor: 6,  attack: 4, attackElement: 'Physical', traits: ['Poison'],      resistances: [] },
  { id: 'medusa',             name: 'Medusa',             armor: 6,  attack: 4, attackElement: 'Physical', traits: ['Paralyze'],    resistances: [] },
  // ── Keep / Tower enemies ───────────────────────────────────────
  { id: 'crossbowmen',        name: 'Crossbowmen',        armor: 5,  attack: 3, attackElement: 'Physical', traits: ['Fortified'],   resistances: [] },
  { id: 'guardsmen',          name: 'Guardsmen',          armor: 6,  attack: 4, attackElement: 'Physical', traits: ['Fortified'],   resistances: ['Physical'] },
  { id: 'militia',            name: 'Militia',            armor: 4,  attack: 3, attackElement: 'Physical', traits: ['Fortified'],   resistances: [] },
  // ── Mage enemies ──────────────────────────────────────────────
  { id: 'fire-mage',          name: 'Fire Mage',          armor: 5,  attack: 4, attackElement: 'Fire',     traits: [],             resistances: ['Fire'] },
  { id: 'ice-mage',           name: 'Ice Mage',           armor: 5,  attack: 4, attackElement: 'Ice',      traits: [],             resistances: ['Ice'] },
  { id: 'ice-witch',          name: 'Ice Witch',          armor: 6,  attack: 5, attackElement: 'Ice',      traits: ['Swift'],       resistances: ['Ice'] },
  // ── Monsters ──────────────────────────────────────────────────
  { id: 'dragon',             name: 'Dragon',             armor: 9,  attack: 6, attackElement: 'Fire',     traits: ['Flying','Brutal'], resistances: ['Fire'] },
  { id: 'gargoyle',           name: 'Gargoyle',           armor: 5,  attack: 4, attackElement: 'Physical', traits: ['Flying'],      resistances: ['Physical'] },
  { id: 'werewolf',           name: 'Werewolf',           armor: 5,  attack: 4, attackElement: 'Physical', traits: ['Swift','Brutal'], resistances: [] },
  { id: 'vampire',            name: 'Vampire',            armor: 7,  attack: 5, attackElement: 'Physical', traits: ['Swift','Paralyze'], resistances: [] },
  { id: 'golems',             name: 'Golems',             armor: 7,  attack: 4, attackElement: 'Physical', traits: [],             resistances: ['Physical','Fire','Ice'] },
  { id: 'fog-demons',         name: 'Fog Demons',         armor: 5,  attack: 3, attackElement: 'Coldfire', traits: [],             resistances: [] },
]
