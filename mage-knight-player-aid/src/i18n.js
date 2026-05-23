import { ref, watch } from 'vue'

export const lang = ref('en')

watch(lang, l => {
  document.documentElement.dir  = l === 'he' ? 'rtl' : 'ltr'
  document.documentElement.lang = l
})

const translations = {
  en: {
    enemy:             '👹 Enemy',
    yourActions:       '🦸 Player',
    combatResolution:  'Combat Resolution',
    armor:             'Armor',
    attack:            'Attack',
    element:           'Element',
    traits:            'Traits',
    resistances:       'Resistances',
    type:              'Type',
    value:             'Value',
    add:               'Add',
    reset:             'Reset',
    addHint:           'Add your cards / actions for this combat.',
    melee:             'Melee',
    ranged:            'Ranged',
    siege:             'Siege',
    block:             'Block',
    fortified:         'Fortified',
    swift:             'Swift',
    brutal:            'Brutal',
    poison:            'Poison',
    paralyze:          'Paralyze',
    physical:          'Physical',
    fire:              'Fire',
    ice:               'Ice',
    coldfire:          'Coldfire',
    rangedPhase:       'Ranged / Siege Phase',
    blockPhase:        'Block Phase',
    meleePhase:        'Melee Attack Phase',
    kills:             'Kills!',
    noRangedActions:   'No ranged or siege actions added.',
    enemyKilledRanged: 'Enemy defeated before melee — no need to block.',
    continueToBlock:   (needed) => `Need ${needed} damage to kill in this phase. Continue to block phase.`,
    fortifiedWarn:     'Fortified: non-siege ranged attacks deal half damage.',
    fullyBlocked:      'Fully Blocked',
    woundCount:        (n) => `${n} wound${n !== 1 ? 's' : ''}`,
    mustUseBlock:      (el) => `Must use ${el} block.`,
    swiftWarn:         'Swift: single block card must cover full value.',
    enoughDamage:      'Enough damage to kill the enemy.',
    dealingOf:         (dmg, needed) => `Dealing ${dmg} of ${needed} needed.`,
    resistancesHalve:  (rs) => ` Resistances halve ${rs.join(', ')} attacks.`,
    unblockedWarn:     (unblocked, brutal, wounds, poisoned, paralyzed) => {
      let s = `${unblocked} unblocked →`
      if (brutal)   s += ' doubled by Brutal →'
      s += ` ${wounds} wound${wounds !== 1 ? 's' : ''}`
      if (poisoned)  s += ' + Poisoned (wounds on top of deck)'
      if (paralyzed) s += ' + Paralyzed (discard hand)'
      return s
    },
    enemyAttacksFor: (val) => `Enemy attacks for`,
  },
  he: {
    enemy:             '👹 אויב',
    yourActions:       '🦸 שחקן',
    combatResolution:  'פתרון הקרב',
    armor:             'שריון',
    attack:            'התקפה',
    element:           'יסוד',
    traits:            'תכונות',
    resistances:       'עמידויות',
    type:              'סוג',
    value:             'ערך',
    add:               'הוסף',
    reset:             'איפוס',
    addHint:           'הוסף קלפים / פעולות לקרב זה.',
    melee:             'פנים אל פנים',
    ranged:            'טווח',
    siege:             'מצור',
    block:             'חסימה',
    fortified:         'מבוצר',
    swift:             'זריז',
    brutal:            'אכזרי',
    poison:            'ארס',
    paralyze:          'שיתוק',
    physical:          'פיזי',
    fire:              'אש',
    ice:               'קרח',
    coldfire:          'קור-אש',
    rangedPhase:       'שלב טווח / מצור',
    blockPhase:        'שלב חסימה',
    meleePhase:        'שלב התקפת פנים',
    kills:             'הורג!',
    noRangedActions:   'לא נוספו פעולות טווח או מצור.',
    enemyKilledRanged: 'האויב הובס לפני קרב — אין צורך לחסום.',
    continueToBlock:   (needed) => `נדרש נזק של ${needed} להרוג בשלב זה. המשך לשלב החסימה.`,
    fortifiedWarn:     'מבוצר: התקפות טווח שאינן מצור גורמות חצי נזק.',
    fullyBlocked:      'חסימה מלאה',
    woundCount:        (n) => `${n} פצע${n !== 1 ? 'ות' : ''}`,
    mustUseBlock:      (el) => `יש להשתמש בחסימת ${el}.`,
    swiftWarn:         'זריז: קלף חסימה בודד חייב לכסות את הערך המלא.',
    enoughDamage:      'מספיק נזק להרוג את האויב.',
    dealingOf:         (dmg, needed) => `גורם ${dmg} מתוך ${needed} הנדרשים.`,
    resistancesHalve:  (rs) => ` עמידויות מחצות התקפות ${rs.join(', ')}.`,
    unblockedWarn:     (unblocked, brutal, wounds, poisoned, paralyzed) => {
      let s = `${unblocked} לא חסום ←`
      if (brutal)   s += ' מוכפל ע״י אכזרי ←'
      s += ` ${wounds} פצע${wounds !== 1 ? 'ות' : ''}`
      if (poisoned)  s += ' + הורעל (פצעים על גבי חפיסה)'
      if (paralyzed) s += ' + שותק (זרוק את כל היד)'
      return s
    },
    enemyAttacksFor: () => `האויב תוקף ב-`,
  },
}

export function useI18n() {
  const t = (key, ...args) => {
    const val = translations[lang.value]?.[key] ?? translations.en[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
  return { t, lang }
}
