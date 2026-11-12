import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A tile-laying, push-your-luck game about analog photography',
    numPlayers: 'Number of players',
    playerLabel: i => `Player ${i}`,
    human: 'Human',
    bot: 'Bot',
    botThinking: name => `🤖 ${name} is thinking...`,
    startGame: 'Start Game',
    rules: 'Rules',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    trackName: track => ({ creativity: 'Creativity', equipment: 'Equipment', development: 'Development', darkroom: 'Darkroom' }[track] ?? track),
    categoryName: cat => ({ animals: 'Animals', food: 'Food', people: 'People', landscapes: 'Landscapes', macro: 'Macro', urban: 'Urban' }[cat] ?? cat),

    tilesLeft: n => `${n} tile${n !== 1 ? 's' : ''} left`,
    yourTurn: name => `${name}'s turn`,
    timeTokens: n => `${n} time`,
    marketLabel: 'Market',
    filmStripLabel: 'Film strip',
    bagLabel: 'Bag',
    whiteCubes: n => `${n} white`,
    blackCubes: n => `${n} black`,

    takePhoto: 'Take Photo',
    buyUpgradeCost: n => `Upgrade (${n} time)`,
    positionLabel: n => `Position ${n}`,
    emptySlot: 'Empty',
    collectTimeBtn: n => `Collect Time (${n})`,
    costLabel: n => `Cost: ${n}`,
    reqLabel: (cre, eq) => `Req: 💡${cre} 📷${eq}`,

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
    blackCubeDrawn: 'Black cube drawn!',
    useDarkroomBtn: n => `Use Darkroom (${n} left)`,
    skipDarkroomBtn: 'Skip (burn photo)',
    developmentDone: 'Development complete',
    continueButton: 'Continue',

    gameOver: 'Game Over',
    colPlayer: 'Player',
    colPhotos: 'Photos',
    colSequenceBonus: 'Sequence Bonus',
    colVarietyBonus: 'Variety Bonus',
    colTotal: 'Total',
    winsMsg: name => `🏆 ${name} wins!`,
    playAgain: 'Play Again',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק הנחת אריחים על צילום אנלוגי, עם מתח של "עד כמה להסתכן"',
    numPlayers: 'מספר שחקנים',
    playerLabel: i => `שחקן ${i}`,
    human: 'אנושי',
    bot: 'בוט',
    botThinking: name => `🤖 ${name} חושב...`,
    startGame: 'התחל משחק',
    rules: 'חוקים',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    trackName: track => ({ creativity: 'יצירתיות', equipment: 'ציוד', development: 'פיתוח', darkroom: 'חדר חושך' }[track] ?? track),
    categoryName: cat => ({ animals: 'בעלי חיים', food: 'אוכל', people: 'אנשים', landscapes: 'נופים', macro: 'מאקרו', urban: 'עירוני' }[cat] ?? cat),

    tilesLeft: n => `נותרו ${n} אריחים`,
    yourTurn: name => `תור ${name}`,
    timeTokens: n => `${n} זמן`,
    marketLabel: 'שוק',
    filmStripLabel: 'סרט הצילום',
    bagLabel: 'שק',
    whiteCubes: n => `${n} לבנים`,
    blackCubes: n => `${n} שחורים`,

    takePhoto: 'צלם תמונה',
    buyUpgradeCost: n => `שדרג (${n} זמן)`,
    positionLabel: n => `מיקום ${n}`,
    emptySlot: 'ריק',
    collectTimeBtn: n => `אסוף זמן (${n})`,
    costLabel: n => `עלות: ${n}`,
    reqLabel: (cre, eq) => `דרישה: 💡${cre} 📷${eq}`,

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
    blackCubeDrawn: 'הוגרלה קובייה שחורה!',
    useDarkroomBtn: n => `השתמש בחדר חושך (נותרו ${n})`,
    skipDarkroomBtn: 'דלג (שרוף את התמונה)',
    developmentDone: 'הפיתוח הושלם',
    continueButton: 'המשך',

    gameOver: 'סוף המשחק',
    colPlayer: 'שחקן',
    colPhotos: 'תמונות',
    colSequenceBonus: 'בונוס רצף',
    colVarietyBonus: 'בונוס גיוון',
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
