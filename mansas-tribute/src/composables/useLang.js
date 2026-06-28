import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A trick-taking dice game · 2–5 players',
    numPlayers: 'Number of players',
    playerLabel: i => `Player ${i}`,
    human: 'Human',
    bot: 'Bot',
    startGame: 'Start Game',
    rules: 'Rules',
    roundInfo: r => `Round ${r} / 8`,
    kingsLead: "King's Lead:",
    cardsLeft: n => `${n} card${n !== 1 ? 's' : ''} left`,
    currentTrick: 'Current Trick',
    follow: 'follow:',
    playsFirst: name => `${name} plays first`,
    yourTurn: name => `${name}'s turn`,
    diceCount: n => `(${n} ${n !== 1 ? 'dice' : 'die'})`,
    handLabel: 'Hand - select a card to play',
    diceLabel: 'Your dice - attach 0 or more',
    diceTotal: n => `total: ${n}`,
    playCard: suit => `Play ${suit} card`,
    playCardWithDice: (suit, n, total) => `Play ${suit} card + ${n} ${n !== 1 ? 'dice' : 'die'} (${total})`,
    selectCard: 'Select a card to play',
    botThinking: name => `🤖 ${name} is thinking...`,
    noDice: 'No dice',
    zeroDice: '0 dice',
    gameOver: 'Game Over',
    trickCount: n => `${n} trick${n !== 1 ? 's' : ''}`,
    bonus: 'bonus',
    playAgain: 'Play Again',
    formulaNote: 'Bonus = sum of remaining dice ÷ tricks won (rounded down)',
    pickADie: name => `${name}, pick a die`,
    pickingOrder: (curr, total) => `${curr} of ${total}`,
    pass: 'Pass',
    winsTrick: name => `🏆 ${name} wins the trick!`,
    leadsNext: 'Leads the next round',
    dicePickingOrder: 'Dice picking order:',
    pickDice: 'Pick Dice →',
    nextRound: 'Next Round →',
  },
  he: {
    subtitle: 'משחק קלפים עם קוביות · 2–5 שחקנים',
    numPlayers: 'מספר שחקנים',
    playerLabel: i => `שחקן ${i}`,
    human: 'אנושי',
    bot: 'בוט',
    startGame: 'התחל משחק',
    rules: 'חוקים',
    roundInfo: r => `סיבוב ${r} / 8`,
    kingsLead: 'ליד המלך:',
    cardsLeft: n => `נותרו ${n} ${n !== 1 ? 'קלפים' : 'קלף'}`,
    currentTrick: 'טריק נוכחי',
    follow: 'עקוב:',
    playsFirst: name => `${name} מתחיל`,
    yourTurn: name => `תור ${name}`,
    diceCount: n => `(${n} ${n !== 1 ? 'קוביות' : 'קובייה'})`,
    handLabel: 'יד - בחר קלף לשחק',
    diceLabel: 'הקוביות שלך - חבר 0 או יותר',
    diceTotal: n => `סה"כ: ${n}`,
    playCard: suit => `שחק קלף ${suit}`,
    playCardWithDice: (suit, n, total) => `שחק קלף ${suit} + ${n} ${n !== 1 ? 'קוביות' : 'קובייה'} (${total})`,
    selectCard: 'בחר קלף לשחק',
    botThinking: name => `🤖 ${name} חושב...`,
    noDice: 'אין קוביות',
    zeroDice: '0 קוביות',
    gameOver: 'סוף המשחק',
    trickCount: n => `${n} ${n !== 1 ? 'טריקים' : 'טריק'}`,
    bonus: 'בונוס',
    playAgain: 'שחק שוב',
    formulaNote: 'בונוס = סכום קוביות שנותרו ÷ טריקים שניצחו (מעוגל למטה)',
    pickADie: name => `${name}, בחר קובייה`,
    pickingOrder: (curr, total) => `${curr} מתוך ${total}`,
    pass: 'דלג',
    winsTrick: name => `🏆 ${name} ניצח בטריק!`,
    leadsNext: 'מוביל את הסיבוב הבא',
    dicePickingOrder: 'סדר בחירת קוביות:',
    pickDice: '← בחר קוביות',
    nextRound: '← סיבוב הבא',
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
