import { ref, computed } from 'vue'

const lang = ref('en')

const COLOR_NAMES = {
  en: { yellow: 'Yellow', blue: 'Blue', red: 'Red', green: 'Green', white: 'White' },
  he: { yellow: 'צהוב', blue: 'כחול', red: 'אדום', green: 'ירוק', white: 'לבן' },
}

const strings = {
  en: {
    subtitle: 'A potion I cut, you choose card game',
    playerLabel: (i) => `Player ${i}`,
    playersLabel: 'Players',
    startGame: 'Start Game',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    roundLabel: (n, total) => `Round ${n} / ${total}`,
    deckLabel: (n) => `Deck: ${n}`,
    dealerBadge: 'Dealer',
    turnBadge: 'Turn',

    colorName: (c) => COLOR_NAMES.en[c] ?? c,

    dealingTitle: (name) => `${name} is dealing`,
    dealingHint:
        'Drag each potion into a group, or tap a potion then tap a group (or the pool) to drop it there. Every potion must be placed, and every group needs at least 1 potion.',
    poolLabel: 'Dealt potions',
    groupLabel: (letter) => `Group ${letter}`,
    emptyGroup: 'Empty',
    confirmGroupsBtn: 'Confirm Groups',

    pickingTitle: (name) => `${name} is picking a group`,
    pickingHint: 'Choose one whole group to take into your hand',
    pickGroupBtn: 'Take this group',
    confirmTurnBtn: 'Next Player',

    dealerFinalTitle: (name) => `${name} takes the last group`,
    claimFinalBtn: 'Take remaining group',
    endRoundBtn: 'End Round',

    handLabel: 'Hand',
    cardsLeftLabel: (n) => `${n} card${n !== 1 ? 's' : ''}`,

    abilitiesLabel: 'Abilities',
    trashThreeBtn: (color) => `Trash 3 ${strings.en.colorName(color)}`,
    blueAbilityBtn: 'Blue: draw & return',
    blueReturnPrompt: 'Choose a potion to return to the bottom of the deck',
    redAbilityBtn: 'Red: trash 1',
    redChoosePrompt: 'Choose a potion to trash',
    yellowAbilityBtn: 'Yellow: trash lowest set',
    yellowChoosePrompt: 'Tied for lowest — choose which color to trash',
    greenAbilityBtn: 'Green: snipe from a group',
    greenPickPrompt: 'Choose a potion from any group to take',
    whiteAbilityBtn: 'White: convert & trash',
    whiteChoosePrompt: 'Choose a color — trash 3 of it along with your 4 white',
    cancel: 'Cancel',

    otherPlayers: 'Other Players',
    removedInfo: (n) => `${n} potion${n !== 1 ? 's' : ''} secretly removed from this game`,

    gameOverTitle: 'Game Over',
    finalStandings: 'Final Standings',
    winnerLabel: (name) => `🏆 ${name} wins!`,
    tiedLabel: 'Tied!',
    playAgain: 'Play Again',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק רקיחת שיקויים — אני מחלק, אחרים בוחרים',
    playerLabel: (i) => `שחקן ${i}`,
    playersLabel: 'שחקנים',
    startGame: 'התחל משחק',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    roundLabel: (n, total) => `סיבוב ${n} / ${total}`,
    deckLabel: (n) => `חבילה: ${n}`,
    dealerBadge: 'מחלק',
    turnBadge: 'תור',

    colorName: (c) => COLOR_NAMES.he[c] ?? c,

    dealingTitle: (name) => `${name} מחלק קלפים`,
    dealingHint:
        'גרור כל שיקוי לקבוצה, או הקש על שיקוי ואז על קבוצה (או על המאגר) כדי להניח אותו שם. כל השיקויים חייבים להיות ממוקמים, ובכל קבוצה חייב להיות לפחות שיקוי אחד.',
    poolLabel: 'שיקויים שחולקו',
    groupLabel: (letter) => `קבוצה ${letter}`,
    emptyGroup: 'ריקה',
    confirmGroupsBtn: 'אשר קבוצות',

    pickingTitle: (name) => `${name} בוחר קבוצה`,
    pickingHint: 'בחר קבוצה שלמה אחת לקחת לידך',
    pickGroupBtn: 'קח קבוצה זו',
    confirmTurnBtn: 'שחקן הבא',

    dealerFinalTitle: (name) => `${name} מקבל את הקבוצה האחרונה`,
    claimFinalBtn: 'קח את הקבוצה שנותרה',
    endRoundBtn: 'סיים סיבוב',

    handLabel: 'יד',
    cardsLeftLabel: (n) => `${n} קלפים`,

    abilitiesLabel: 'יכולות',
    trashThreeBtn: (color) => `השמד 3 ${strings.he.colorName(color)}`,
    blueAbilityBtn: 'כחול: שלוף והחזר',
    blueReturnPrompt: 'בחר שיקוי להחזיר לתחתית החבילה',
    redAbilityBtn: 'אדום: השמד 1',
    redChoosePrompt: 'בחר שיקוי להשמדה',
    yellowAbilityBtn: 'צהוב: השמד את הקבוצה הקטנה ביותר',
    yellowChoosePrompt: 'תיקו בקבוצה הקטנה ביותר — בחר איזה צבע להשמיד',
    greenAbilityBtn: 'ירוק: חטוף מקבוצה',
    greenPickPrompt: 'בחר שיקוי מכל קבוצה לקחת',
    whiteAbilityBtn: 'לבן: המר והשמד',
    whiteChoosePrompt: 'בחר צבע — יושמדו ממנו 3 קלפים יחד עם 4 הלבנים שלך',
    cancel: 'בטל',

    otherPlayers: 'שחקנים אחרים',
    removedInfo: (n) => `${n} שיקויים הוצאו בסתר מהמשחק`,

    gameOverTitle: 'סוף המשחק',
    finalStandings: 'תוצאות סופיות',
    winnerLabel: (name) => `🏆 ${name} ניצח!`,
    tiedLabel: 'תיקו!',
    playAgain: 'שחק שוב',

    credits: '© 2026 אלמוג שמש · עיצוב ורעיון המשחק · כל הזכויות שמורות',
  },
}

export function useLang() {
  function t(key, ...args) {
    const val = strings[lang.value]?.[key] ?? strings.en[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
  const dir = computed(() => (lang.value === 'he' ? 'rtl' : 'ltr'))
  function toggleLang() {
    lang.value = lang.value === 'en' ? 'he' : 'en'
  }
  return { lang, t, dir, toggleLang }
}
