import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A tile-laying, push-your-luck game about analog photography',
    numPlayers: 'Number of players',
    playerLabel: i => `Player ${i}`,
    startGame: 'Start Game',
    rules: 'Rules',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    trackName: track => ({ creativity: 'Creativity', equipment: 'Equipment', knowledge: 'Knowledge', darkroom: 'Darkroom' }[track] ?? track),
    categoryName: cat => ({ portrait: 'Portrait', landscape: 'Landscape', street: 'Street', stillLife: 'Still Life', abstract: 'Abstract' }[cat] ?? cat),

    tilesLeft: n => `${n} tile${n !== 1 ? 's' : ''} left`,
    yourTurn: name => `${name}'s turn`,
    timeTokens: n => `${n} time`,
    marketLabel: 'Market',
    filmStripLabel: 'Film strip',
    bagLabel: 'Bag',
    whiteCubes: n => `${n} white`,
    blackCubes: n => `${n} black`,

    takePhoto: 'Take Photo',
    buyUpgrade: 'Buy Upgrade',
    pass: 'Pass (+1 time)',
    costLabel: n => `Cost: ${n}`,
    reqLabel: (cre, eq) => `Req: 💡${cre} 📷${eq}`,
    upgradeCostLabel: n => `Upgrade cost: ${n}`,

    cantAffordTime: "Can't afford (not enough time)",
    reqNotMet: "Requirements not met",

    proceedToDevelopment: 'Tile supply exhausted — develop your film →',
    developmentPhaseTitle: 'Development Phase',
    developingFor: name => `Developing ${name}'s film...`,
    drawNext: 'Draw Next',
    developed: 'Developed!',
    burned: 'Burned',
    darkroomSaved: 'Saved by the darkroom!',
    darkroomUsesLeft: n => `${n} darkroom use${n !== 1 ? 's' : ''} left`,
    developmentDone: 'Development complete',
    continueButton: 'Continue',

    gameOver: 'Game Over',
    colPlayer: 'Player',
    colPhotos: 'Photos',
    colBonus: 'Sequence Bonus',
    colTotal: 'Total',
    winsMsg: name => `🏆 ${name} wins!`,
    playAgain: 'Play Again',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק הנחת אריחים על צילום אנלוגי, עם מתח של "עד כמה להסתכן"',
    numPlayers: 'מספר שחקנים',
    playerLabel: i => `שחקן ${i}`,
    startGame: 'התחל משחק',
    rules: 'חוקים',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    trackName: track => ({ creativity: 'יצירתיות', equipment: 'ציוד', knowledge: 'ידע', darkroom: 'חדר חושך' }[track] ?? track),
    categoryName: cat => ({ portrait: 'דיוקן', landscape: 'נוף', street: 'רחוב', stillLife: 'טבע דומם', abstract: 'מופשט' }[cat] ?? cat),

    tilesLeft: n => `נותרו ${n} אריחים`,
    yourTurn: name => `תור ${name}`,
    timeTokens: n => `${n} זמן`,
    marketLabel: 'שוק',
    filmStripLabel: 'סרט הצילום',
    bagLabel: 'שקית',
    whiteCubes: n => `${n} לבנים`,
    blackCubes: n => `${n} שחורים`,

    takePhoto: 'צלם תמונה',
    buyUpgrade: 'קנה שדרוג',
    pass: 'ותר (+1 זמן)',
    costLabel: n => `עלות: ${n}`,
    reqLabel: (cre, eq) => `דרישה: 💡${cre} 📷${eq}`,
    upgradeCostLabel: n => `עלות שדרוג: ${n}`,

    cantAffordTime: 'אין מספיק זמן',
    reqNotMet: 'הדרישות לא מתקיימות',

    proceedToDevelopment: 'מלאי האריחים אזל — פתח את הסרט שלך ←',
    developmentPhaseTitle: 'שלב הפיתוח',
    developingFor: name => `מפתח את הסרט של ${name}...`,
    drawNext: 'הגרל הבא',
    developed: 'פותח בהצלחה!',
    burned: 'נשרף',
    darkroomSaved: 'ניצל בזכות חדר החושך!',
    darkroomUsesLeft: n => `נותרו ${n} שימושים בחדר החושך`,
    developmentDone: 'הפיתוח הושלם',
    continueButton: 'המשך',

    gameOver: 'סוף המשחק',
    colPlayer: 'שחקן',
    colPhotos: 'תמונות',
    colBonus: 'בונוס רצף',
    colTotal: 'סה"כ',
    winsMsg: name => `🏆 ${name} ניצח!`,
    playAgain: 'שחק שוב',

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
