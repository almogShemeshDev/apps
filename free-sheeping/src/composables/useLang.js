import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
  en: {
    subtitle: 'A push-your-luck shopping cart game for an online-addicted flock of sheep',
    playersLabel: 'Players',
    playerLabel: (i) => `Player ${i}`,
    human: 'Human',
    bot: 'Bot',
    startGame: 'Start Game',
    newGame: 'New Game',
    confirmNewGame: 'Start a new game? Current progress will be lost.',

    turnLabel: (n) => `Turn ${n}`,
    deckLabel: (n) => `Deck: ${n}`,
    windowFixedLabel: (min, max) => `Free shipping: ${min}-${max}`,
    turnBadge: 'Turn',
    botBadge: 'Bot',

    cartLabel: 'Shopping Cart',
    totalLabel: 'Total',
    emptyCart: 'Cart is empty — draw a card to start your order',
    statusBelow: 'Below free shipping — a shipping fee will apply',
    statusWithin: 'Free shipping range!',
    statusAbove: 'Over the free shipping range — cards here get taxed -1 VP each',
    feeLabel: (n) => `Fee: -${n} VP`,
    problemPointsLabel: (n) => `Problem points: ${n}/3`,
    problemPointsWarning: 'One more problem point cancels the order!',
    keepPreviewLabel: (count, keep) => `${count} product${count === 1 ? '' : 's'} in cart — you'll keep ${keep}`,
    keepTiersLabel: 'Keep:',
    keepTierRange: (min, max) => (max === null ? `${min}+` : min === max ? `${min}` : `${min}–${max}`),
    nextTierNudge: (nextKeep) => `Almost there! One more product and you can keep ${nextKeep}!`,

    drawBtn: 'Draw Card',
    stopBtn: 'Stop & Keep Order',
    passBtn: 'Pass (no cards to draw)',

    vpLabel: 'VP',
    inventoryLabel: 'Bonus Cards',
    noSpecials: 'None yet',
    productsWonLabel: (n) => `${n} kept`,

    couponBtn: 'Discount Coupon (-5)',
    freeReturnBtn: 'Free Return',
    shippingInsuranceBtn: 'Shipping Insurance (-2 problems)',
    extraPickBtn: 'Extra Pick (+1 keep)',
    sneakPeekBtn: 'Sneak Peek',
    cancel: 'Cancel',

    keepSelectionPrompt: (n) => `Choose ${n} product${n === 1 ? '' : 's'} to keep`,
    keepSelectionConfirmBtn: 'Confirm Selection',
    freeReturnChoosePrompt: 'Choose a product to return',
    sneakPeekPrompt: 'The next 2 cards are revealed — keep this order or swap them?',
    keepOrderBtn: 'Keep order',
    swapOrderBtn: 'Swap order',

    priceLabel: 'Price',
    vpShortLabel: 'VP',
    pointsLabel: 'pts',

    categoriesLabel: 'Categories',

    collectionLabel: 'Collection',
    estScoreLabel: (n) => `Est. score: ${n}`,
    shippingPenaltyLabel: (n) => `Shipping fees: -${n}`,
    diversityBonusLabel: 'Diversity bonus',
    diversityBonusHint: 'All 5 categories collected',
    scoreBreakdownTitle: 'Score Breakdown',
    totalScoreLabel: 'Total Score',

    probPanelTitle: 'Probability Panel',
    probToggle: 'Show odds',
    probNextProduct: 'Next card is a product',
    probNextSpecial: 'Next card is a bonus card',
    probNextProblem: 'Next card is a problem card',
    probBust: 'Next draw cancels the order',
    probOverflow: 'Next draw gets taxed -1 VP',
    probWithin: 'Next draw stays in free shipping',
    probBelowMin: 'Next draw stays below minimum',

    logTitle: 'Game Log',
    logEmpty: 'No actions yet',
    logTurnStart: (name) => `${name}'s turn begins`,
    logDraw: (name, cardName, price) => `${name} drew ${cardName} (price ${price})`,
    logStop: (name, productCount, total, penalty) =>
      `${name} kept ${productCount} ${productCount === 1 ? 'product' : 'products'} (order total ${total}${penalty ? `, fee -${penalty}` : ''})`,
    logBust: (name, points) => `${name}'s order was canceled at ${points} problem points — everything discarded`,
    logCoupon: (name) => `${name} used a Discount Coupon`,
    logFreeReturn: (name, cardName) => `${name} used Free Return on ${cardName}`,
    logSneakPeek: (name) => `${name} used Sneak Peek`,
    logShippingInsurance: (name) => `${name} used Shipping Insurance`,
    logExtraPick: (name) => `${name} used Extra Pick`,
    logSneakPeekSwap: (name) => `${name} peeked and swapped the top two cards`,
    logSneakPeekKeep: (name) => `${name} peeked and left the order unchanged`,
    logTurnSkip: (name) => `${name} had no cards to draw and passed`,
    logGameOver: 'Game over',

    gameOverTitle: 'Game Over',
    finalStandings: 'Final Standings',
    winnerLabel: (name) => `🏆 ${name} wins!`,
    tiedLabel: 'Tied!',
    playAgain: 'Play Again',

    rulesTitle: 'How to Play',
    rulesBtn: 'Rules',

    credits: '© 2026 Almog Shemesh · Game Design & Concept · All rights reserved',
  },
  he: {
    subtitle: 'משחק עדר כבשים ממכר לקניות — הזמינו, הגיעו לטווח המשלוח החינמי, הימנעו מתקלות',
    playersLabel: 'שחקנים',
    playerLabel: (i) => `שחקן ${i}`,
    human: 'אנושי',
    bot: 'בוט',
    startGame: 'התחל משחק',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    turnLabel: (n) => `תור ${n}`,
    deckLabel: (n) => `חבילה: ${n}`,
    windowFixedLabel: (min, max) => `משלוח חינם: ${min}-${max}`,
    turnBadge: 'תור',
    botBadge: 'בוט',

    cartLabel: 'עגלת קניות',
    totalLabel: 'סכום',
    emptyCart: 'העגלה ריקה — שלפו קלף כדי להתחיל הזמנה',
    statusBelow: 'מתחת למשלוח חינם — תחול עמלת משלוח',
    statusWithin: 'טווח משלוח חינם!',
    statusAbove: 'מעל טווח המשלוח החינמי — קלפים כאן ממוסים ב-1- נק"ז כל אחד',
    feeLabel: (n) => `עמלה: -${n} נק"ז`,
    problemPointsLabel: (n) => `נקודות תקלה: ${n}/3`,
    problemPointsWarning: 'עוד נקודת תקלה אחת מבטלת את ההזמנה!',
    keepPreviewLabel: (count, keep) => `${count} מוצרים בעגלה — תשמרו ${keep}`,
    keepTiersLabel: 'שמירה:',
    keepTierRange: (min, max) => (max === null ? `${min}+` : min === max ? `${min}` : `${min}–${max}`),
    nextTierNudge: (nextKeep) => `קדימה! עוד מוצר אחד ותוכלו לבחור ${nextKeep} מוצרים`,

    drawBtn: 'שלוף קלף',
    stopBtn: 'עצור ושמור הזמנה',
    passBtn: 'העבר תור (אין קלפים לשלוף)',

    vpLabel: 'נק"ז',
    inventoryLabel: 'קלפי בונוס',
    noSpecials: 'אין עדיין',
    productsWonLabel: (n) => `${n} נשמרו`,

    couponBtn: 'קופון הנחה (-5)',
    freeReturnBtn: 'החזרה חינם',
    shippingInsuranceBtn: 'ביטוח משלוח (-2 תקלות)',
    extraPickBtn: 'בחירה נוספת (+1 לשמירה)',
    sneakPeekBtn: 'הצצה חטופה',
    cancel: 'בטל',

    keepSelectionPrompt: (n) => `בחרו ${n} מוצרים לשמירה`,
    keepSelectionConfirmBtn: 'אשרו בחירה',
    freeReturnChoosePrompt: 'בחרו מוצר להחזרה',
    sneakPeekPrompt: 'שני הקלפים הבאים נחשפים — להשאיר את הסדר או להחליף?',
    keepOrderBtn: 'השאר סדר',
    swapOrderBtn: 'החלף סדר',

    priceLabel: 'מחיר',
    vpShortLabel: 'נק"ז',
    pointsLabel: 'נק',

    categoriesLabel: 'קטגוריות',

    collectionLabel: 'אוסף',
    estScoreLabel: (n) => `ניקוד משוער: ${n}`,
    shippingPenaltyLabel: (n) => `עמלות משלוח: -${n}`,
    diversityBonusLabel: 'בונוס גיוון',
    diversityBonusHint: 'כל 5 הקטגוריות נאספו',
    scoreBreakdownTitle: 'פירוט ניקוד',
    totalScoreLabel: 'ניקוד כולל',

    probPanelTitle: 'פאנל סיכויים',
    probToggle: 'הצג סיכויים',
    probNextProduct: 'הקלף הבא הוא מוצר',
    probNextSpecial: 'הקלף הבא הוא קלף בונוס',
    probNextProblem: 'הקלף הבא הוא קלף תקלה',
    probBust: 'השליפה הבאה מבטלת את ההזמנה',
    probOverflow: 'השליפה הבאה תמוסה ב-1- נק"ז',
    probWithin: 'השליפה הבאה נשארת במשלוח חינם',
    probBelowMin: 'השליפה הבאה נשארת מתחת למינימום',

    logTitle: 'יומן משחק',
    logEmpty: 'אין פעולות עדיין',
    logTurnStart: (name) => `התור של ${name} מתחיל`,
    logDraw: (name, cardName, price) => `${name} שלף/ה ${cardName} (מחיר ${price})`,
    logStop: (name, productCount, total, penalty) =>
      `${name} שמר/ה ${productCount} מוצרים (סכום הזמנה ${total}${penalty ? `, עמלה -${penalty}` : ''})`,
    logBust: (name, points) => `ההזמנה של ${name} בוטלה עם ${points} נקודות תקלה — הכל נגרס`,
    logCoupon: (name) => `${name} השתמש/ה בקופון הנחה`,
    logFreeReturn: (name, cardName) => `${name} השתמש/ה בהחזרה חינם על ${cardName}`,
    logSneakPeek: (name) => `${name} השתמש/ה בהצצה חטופה`,
    logShippingInsurance: (name) => `${name} השתמש/ה בביטוח משלוח`,
    logExtraPick: (name) => `${name} השתמש/ה בבחירה נוספת`,
    logSneakPeekSwap: (name) => `${name} הציץ/ה והחליף/ה בין שני הקלפים`,
    logSneakPeekKeep: (name) => `${name} הציץ/ה והשאיר/ה את הסדר כפי שהיה`,
    logTurnSkip: (name) => `ל${name} לא היו קלפים לשלוף והתור הועבר`,
    logGameOver: 'המשחק הסתיים',

    gameOverTitle: 'סוף המשחק',
    finalStandings: 'תוצאות סופיות',
    winnerLabel: (name) => `🏆 ${name} ניצח/ה!`,
    tiedLabel: 'תיקו!',
    playAgain: 'שחק שוב',

    rulesTitle: 'איך משחקים',
    rulesBtn: 'חוקים',

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
  // Card data carries its own en/he text (nameHe/descriptionHe); this just
  // picks the field matching the current UI language.
  function cardName(def) {
    return lang.value === 'he' ? def.nameHe ?? def.name : def.name
  }
  function cardDesc(def) {
    return lang.value === 'he' ? def.descriptionHe ?? def.description : def.description
  }
  function categoryName(category) {
    return lang.value === 'he' ? category.nameHe ?? category.name : category.name
  }
  return { lang, t, dir, toggleLang, cardName, cardDesc, categoryName }
}
