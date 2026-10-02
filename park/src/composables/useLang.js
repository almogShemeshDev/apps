import { ref, computed } from 'vue'

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
    bagLabel: 'Bag',
    discardLabel: 'Discard',
    drawnLabel: 'Drawn discs',

    tableauLabel: 'Tableau',
    cardName: id => ({ carousel: 'Carousel', cashier: 'Cashier' }[id] ?? id),
    discName: id => ({ visitor: 'Visitor', worker: 'Worker', gardener: 'Gardener', money: 'Money' }[id] ?? id),
    useLabel: (amount, disc) => `Use: ${amount} ${strings.en.discName(disc)}`,
    benefitLabel: (type, amount) => `Benefit: +${amount} ${type === 'gold' ? 'Gold' : 'VP'}`,
    activate: 'Activate',
    usesLabel: (used, max) => `${used}/${max} used this turn`,

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
    bagLabel: 'שק',
    discardLabel: 'ערימת פסולת',
    drawnLabel: 'דיסקיות שנשלפו',

    tableauLabel: 'קלפים',
    cardName: id => ({ carousel: 'קרוסלה', cashier: 'קופאי' }[id] ?? id),
    discName: id => ({ visitor: 'מבקר', worker: 'עובד', gardener: 'גנן', money: 'כסף' }[id] ?? id),
    useLabel: (amount, disc) => `עלות: ${amount} ${strings.he.discName(disc)}`,
    benefitLabel: (type, amount) => `תועלת: +${amount} ${type === 'gold' ? 'זהב' : 'נק׳'}`,
    activate: 'הפעל',
    usesLabel: (used, max) => `${used}/${max} שימושים בתור זה`,

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
