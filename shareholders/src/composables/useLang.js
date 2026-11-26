import { ref, computed } from 'vue'

const COMPANY_NAMES = {
  en: { red: 'Red Line', blue: 'Blue Line', green: 'Green Line', yellow: 'Yellow Line', purple: 'Purple Line' },
  he: { red: 'הקו האדום', blue: 'הקו הכחול', green: 'הקו הירוק', yellow: 'הקו הצהוב', purple: 'הקו הסגול' },
}

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A train-stock drafting game — collect shares, then cash in on the busiest rail lines',
    playerLabel: (i) => `Player ${i}`,
    playersLabel: 'Players',
    human: 'Human',
    bot: 'Bot',
    startGame: 'Start Game',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    roundLabel: (n) => `Round ${n}`,
    deckLabel: (n) => `Deck: ${n} card${n !== 1 ? 's' : ''} left`,
    yourTurn: (name) => `${name}'s turn`,
    activeBadge: 'Active',
    startBadge: '🚩 Starts Round',
    botThinking: (name) => `🤖 ${name} is thinking...`,

    trainPoolLabel: 'Train Pool',
    lowestLabel: 'Lowest — scores negative',
    draftRowLabel: 'Draft Row',
    shareLabel: 'Share',
    trainLabel: 'Train',
    companyName: (id) => COMPANY_NAMES.en[id] ?? id,

    sharesLabel: 'Shares',
    scoreLabel: 'Score',
    showScore: 'Show Score',
    hideScore: 'Hide Score',

    logRoundStart: (round, name) => `Round ${round} — ${name}'s turn`,
    logPick: (name, icon, kindLabel) => `${name} drafted a ${icon} ${kindLabel}`,
    logDiscard: (n) => `${n} leftover card${n !== 1 ? 's' : ''} discarded`,
    logGameOver: 'Game over',
    logTitle: 'Game Log',
    logEmpty: 'No actions yet',

    gameOverTitle: 'Game Over',
    finalStandings: 'Final Standings',
    winnerLabel: (name) => `🏆 ${name} wins!`,
    tiedLabel: 'Tied!',
    playAgain: 'Play Again',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק דראפט מניות רכבות — אספו מניות, ואז פדו אותן על חשבון הקווים העמוסים ביותר',
    playerLabel: (i) => `שחקן ${i}`,
    playersLabel: 'שחקנים',
    human: 'אנושי',
    bot: 'בוט',
    startGame: 'התחל משחק',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    roundLabel: (n) => `סיבוב ${n}`,
    deckLabel: (n) => `נותרו ${n} קלפים בחפיסה`,
    yourTurn: (name) => `תור ${name}`,
    activeBadge: 'פעיל',
    startBadge: '🚩 פותח את הסיבוב',
    botThinking: (name) => `🤖 ${name} חושב...`,

    trainPoolLabel: 'מאגר הרכבות',
    lowestLabel: 'הנמוך ביותר — ניקוד שלילי',
    draftRowLabel: 'שורת הקלפים',
    shareLabel: 'מניה',
    trainLabel: 'רכבת',
    companyName: (id) => COMPANY_NAMES.he[id] ?? id,

    sharesLabel: 'מניות',
    scoreLabel: 'ניקוד',
    showScore: 'הצג ניקוד',
    hideScore: 'הסתר ניקוד',

    logRoundStart: (round, name) => `סיבוב ${round} — תור ${name}`,
    logPick: (name, icon, kindLabel) => `${name} לקח ${icon} ${kindLabel}`,
    logDiscard: (n) => `${n} קלפים נותרים הושלכו`,
    logGameOver: 'המשחק הסתיים',
    logTitle: 'יומן משחק',
    logEmpty: 'אין פעולות עדיין',

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
