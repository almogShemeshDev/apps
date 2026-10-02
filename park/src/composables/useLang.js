import { ref, computed } from 'vue'

const CARD_NAMES = {
  en: {
    carousel: 'Carousel',
    cashier: 'Cashier',
    familyDay: 'Family Day',
    popcorn: 'Popcorn',
    poster: 'Poster',
    hotdogs: 'Hotdogs',
    ferrisWheel: 'Ferris Wheel',
    flowersGarden: 'Flowers Garden',
    bushesSculptures: 'Bushes Sculptures',
    electricCars: 'Electric Cars',
    bullsEye: "Bull's Eye",
    recruit: 'Recruit',
    rollercoaster: 'Rollercoaster',
    juggling: 'Juggling',
    pirateBoat: 'Pirate Boat',
    ghostsRiders: 'Ghosts Riders',
    spinningCups: 'Spinning Cups',
    cleaningStaff: 'Cleaning Staff',
  },
  he: {
    carousel: 'קרוסלה',
    cashier: 'קופאי',
    familyDay: 'יום משפחה',
    popcorn: 'פופקורן',
    poster: 'דוכן פוסטרים',
    hotdogs: 'נקניקיות',
    ferrisWheel: 'גלגל ענק',
    flowersGarden: 'גינת פרחים',
    bushesSculptures: 'פסלי שיחים',
    electricCars: 'מכוניות חשמליות',
    bullsEye: 'מטרה',
    recruit: 'גיוס',
    rollercoaster: 'רכבת הרים',
    juggling: 'ג׳אגלינג',
    pirateBoat: 'ספינת פיראטים',
    ghostsRiders: 'רוכבי רוחות',
    spinningCups: 'כוסות מסתובבות',
    cleaningStaff: 'צוות ניקיון',
  },
}

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A bag-building theme-park tycoon game',
    playerLabel: i => `Player ${i}`,
    startGame: 'Start Game',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    roundLabel: n => `Round ${n}`,
    yourTurn: name => `${name}'s turn`,
    activeBadge: 'Active',
    endTurn: 'End Turn',

    goldLabel: 'Gold',
    vpLabel: 'VP',
    negativeVpLabel: 'Negative VP',
    bagLabel: 'Bag',
    discardLabel: 'Discard',
    trashedLabel: 'Trashed',
    drawnLabel: 'Drawn discs',

    tableauLabel: 'Tableau',
    cardName: id => CARD_NAMES.en[id] ?? id,
    discName: id => ({ visitor: 'Visitor', worker: 'Worker', gardener: 'Gardener', money: 'Money' }[id] ?? id),
    activate: 'Activate',
    usesLabel: (used, max) => `${used}/${max} used this turn`,

    negativeVpEffect: n => `-${n} VP token`,
    pullDiscsEffect: n => `Pull ${n} disc${n !== 1 ? 's' : ''} from bag`,
    discardDiscsEffect: n => `Discard ${n} disc${n !== 1 ? 's' : ''}`,
    trashDiscsEffect: n => `Trash ${n} disc${n !== 1 ? 's' : ''}`,
    gainDiscEffect: (n, discType) => `Gain ${n} ${strings.en.discName(discType)} disc${n !== 1 ? 's' : ''}`,

    pendingChoiceDiscard: n => `Choose ${n} disc${n !== 1 ? 's' : ''} to discard`,
    pendingChoiceTrash: n => `Choose ${n} disc${n !== 1 ? 's' : ''} to trash`,

    marketLabel: 'Market',
    costLabel: n => `Cost: ${n} Gold`,
    remainingLabel: n => `${n} left`,
    soldOut: 'Sold out',
    buy: 'Buy',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק טייקון פארק שעשועים מבוסס בניית שק',
    playerLabel: i => `שחקן ${i}`,
    startGame: 'התחל משחק',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    roundLabel: n => `סיבוב ${n}`,
    yourTurn: name => `תור ${name}`,
    activeBadge: 'פעיל',
    endTurn: 'סיים תור',

    goldLabel: 'זהב',
    vpLabel: 'נק׳ ניצחון',
    negativeVpLabel: 'נק׳ ניצחון שליליות',
    bagLabel: 'שק',
    discardLabel: 'ערימת פסולת',
    trashedLabel: 'הושמדו',
    drawnLabel: 'דיסקיות שנשלפו',

    tableauLabel: 'קלפים',
    cardName: id => CARD_NAMES.he[id] ?? id,
    discName: id => ({ visitor: 'מבקר', worker: 'עובד', gardener: 'גנן', money: 'כסף' }[id] ?? id),
    activate: 'הפעל',
    usesLabel: (used, max) => `${used}/${max} שימושים בתור זה`,

    negativeVpEffect: n => `-${n} אסימון נק׳ ניצחון`,
    pullDiscsEffect: n => `שלוף ${n} דיסקיות משק`,
    discardDiscsEffect: n => `השלך ${n} דיסקיות`,
    trashDiscsEffect: n => `השמד ${n} דיסקיות`,
    gainDiscEffect: (n, discType) => `קבל ${n} דיסקיות ${strings.he.discName(discType)}`,

    pendingChoiceDiscard: n => `בחר ${n} דיסקיות להשלכה`,
    pendingChoiceTrash: n => `בחר ${n} דיסקיות להשמדה`,

    marketLabel: 'שוק',
    costLabel: n => `עלות: ${n} זהב`,
    remainingLabel: n => `נותרו ${n}`,
    soldOut: 'אזל המלאי',
    buy: 'קנה',

    credits: '© 2026 אלמוג שמש · עיצוב ורעיון המשחק · כל הזכויות שמורות',
  },
}

export function useLang() {
  function t(key, ...args) {
    const val = strings[lang.value]?.[key] ?? strings.en[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
  const dir = computed(() => lang.value === 'he' ? 'rtl' : 'ltr')
  function toggleLang() { lang.value = lang.value === 'en' ? 'he' : 'en' }
  return { lang, t, dir, toggleLang }
}
