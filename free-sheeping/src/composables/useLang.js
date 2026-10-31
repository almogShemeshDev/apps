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
    windowLabel: (lvl, min, max) => `Window ${lvl}: ${min}-${max}`,
    turnBadge: 'Turn',
    botBadge: 'Bot',

    cartLabel: 'Shopping Cart',
    totalLabel: 'Total',
    emptyCart: 'Cart is empty — draw a card to start your order',
    statusBelow: 'Below minimum',
    statusWithin: 'Free shipping range!',
    statusAbove: 'Over the import limit',

    drawBtn: 'Draw Card',
    shipBtn: 'Ship Order',
    stopFailBtn: 'Stop / Accept Failure',

    vpLabel: 'VP',
    inventoryLabel: 'Special Cards',
    noSpecials: 'None yet',
    productsWonLabel: (n) => `${n} shipped`,

    couponBtn: 'Discount Coupon (-3)',
    freeReturnBtn: 'Free Return',
    taxInsuranceBtn: 'Tax Insurance (+5 max)',
    flashSaleBtn: 'Flash Sale (-2 each, pick up to 2)',
    sneakPeekBtn: 'Sneak Peek',
    cancel: 'Cancel',
    flashSaleChoosePrompt: 'Choose up to 2 products to discount, then confirm',
    flashSaleConfirmBtn: 'Apply Flash Sale',
    sneakPeekPrompt: 'The next card is revealed — draw it or leave it on top?',
    drawRevealedBtn: 'Draw it',
    leaveOnTopBtn: 'Leave it',
    noFreeReturnTarget: 'No product in the cart to return',

    priceLabel: 'Price',
    vpShortLabel: 'VP',

    categoriesLabel: 'Categories',

    collectionLabel: 'Collection',
    estScoreLabel: (n) => `Est. score: ${n}`,
    diversityBonusLabel: 'Diversity bonus',
    diversityBonusHint: 'All 5 categories collected',
    scoreBreakdownTitle: 'Score Breakdown',
    totalScoreLabel: 'Total Score',

    probPanelTitle: 'Probability Panel',
    probToggle: 'Show odds',
    probNextProduct: 'Next card is a product',
    probNextSpecial: 'Next card is a special',
    probOverflow: 'Next draw overflows the max',
    probWithin: 'Next draw stays in window',
    probBelowMin: 'Next draw stays below minimum',

    logTitle: 'Game Log',
    logEmpty: 'No actions yet',
    logTurnStart: (name) => `${name}'s turn begins`,
    logDraw: (name, cardName, price) => `${name} drew ${cardName} (price ${price})`,
    logShip: (name, productCount, total) =>
      `${name} shipped ${productCount} ${productCount === 1 ? 'product' : 'products'} to their collection (total ${total})`,
    logFail: (name, total) => `${name}'s shipment failed (total ${total})`,
    logCoupon: (name) => `${name} used a Discount Coupon`,
    logFreeReturn: (name, cardName) => `${name} used Free Return on ${cardName}`,
    logTaxInsurance: (name) => `${name} used Tax Insurance`,
    logFlashSale: (name) => `${name} used a Flash Sale`,
    logSneakPeekDraw: (name) => `${name} peeked and drew the revealed card`,
    logSneakPeekDecline: (name) => `${name} peeked and left the card on top`,
    logTurnSkip: (name) => `${name} had no cards to draw and passed`,
    logWindowMove: (lvl) => `Shipping window moved to Level ${lvl}`,
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
    subtitle: 'משחק עדר כבשים ממכר לקניות — הזמינו, הגיעו לטווח המשלוח החינמי, אל תעברו את מכסת המכס',
    playersLabel: 'שחקנים',
    playerLabel: (i) => `שחקן ${i}`,
    human: 'אנושי',
    bot: 'בוט',
    startGame: 'התחל משחק',
    newGame: 'משחק חדש',
    confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',

    turnLabel: (n) => `תור ${n}`,
    deckLabel: (n) => `חבילה: ${n}`,
    windowLabel: (lvl, min, max) => `חלון ${lvl}: ${min}-${max}`,
    turnBadge: 'תור',
    botBadge: 'בוט',

    cartLabel: 'עגלת קניות',
    totalLabel: 'סכום',
    emptyCart: 'העגלה ריקה — שלפו קלף כדי להתחיל הזמנה',
    statusBelow: 'מתחת למינימום',
    statusWithin: 'טווח משלוח חינם!',
    statusAbove: 'חריגה ממכסת המכס',

    drawBtn: 'שלוף קלף',
    shipBtn: 'שלח הזמנה',
    stopFailBtn: 'עצור / קבל כישלון',

    vpLabel: 'נק"ז',
    inventoryLabel: 'קלפים מיוחדים',
    noSpecials: 'אין עדיין',
    productsWonLabel: (n) => `${n} נשלחו`,

    couponBtn: 'קופון הנחה (-3)',
    freeReturnBtn: 'החזרה חינם',
    taxInsuranceBtn: 'ביטוח מכס (+5 למקסימום)',
    flashSaleBtn: 'מכירת פלאש (-2 כל אחד, עד 2 מוצרים)',
    sneakPeekBtn: 'הצצה חטופה',
    cancel: 'בטל',
    flashSaleChoosePrompt: 'בחרו עד 2 מוצרים להנחה, ואז אשרו',
    flashSaleConfirmBtn: 'הפעל מכירת פלאש',
    sneakPeekPrompt: 'הקלף הבא נחשף — לשלוף אותו או להשאיר אותו עליון?',
    drawRevealedBtn: 'שלוף אותו',
    leaveOnTopBtn: 'השאר אותו',
    noFreeReturnTarget: 'אין מוצר בעגלה להחזרה',

    priceLabel: 'מחיר',
    vpShortLabel: 'נק"ז',

    categoriesLabel: 'קטגוריות',

    collectionLabel: 'אוסף',
    estScoreLabel: (n) => `ניקוד משוער: ${n}`,
    diversityBonusLabel: 'בונוס גיוון',
    diversityBonusHint: 'כל 5 הקטגוריות נאספו',
    scoreBreakdownTitle: 'פירוט ניקוד',
    totalScoreLabel: 'ניקוד כולל',

    probPanelTitle: 'פאנל סיכויים',
    probToggle: 'הצג סיכויים',
    probNextProduct: 'הקלף הבא הוא מוצר',
    probNextSpecial: 'הקלף הבא הוא קלף מיוחד',
    probOverflow: 'השליפה הבאה חורגת מהמקסימום',
    probWithin: 'השליפה הבאה נשארת בטווח',
    probBelowMin: 'השליפה הבאה נשארת מתחת למינימום',

    logTitle: 'יומן משחק',
    logEmpty: 'אין פעולות עדיין',
    logTurnStart: (name) => `התור של ${name} מתחיל`,
    logDraw: (name, cardName, price) => `${name} שלף/ה ${cardName} (מחיר ${price})`,
    logShip: (name, productCount, total) => `${name} שלח/ה ${productCount} מוצרים לאוסף (סכום ${total})`,
    logFail: (name, total) => `ההזמנה של ${name} נכשלה (סכום ${total})`,
    logCoupon: (name) => `${name} השתמש/ה בקופון הנחה`,
    logFreeReturn: (name, cardName) => `${name} השתמש/ה בהחזרה חינם על ${cardName}`,
    logTaxInsurance: (name) => `${name} השתמש/ה בביטוח מכס`,
    logFlashSale: (name) => `${name} השתמש/ה במכירת פלאש`,
    logSneakPeekDraw: (name) => `${name} הציץ/ה ושלף/ה את הקלף שנחשף`,
    logSneakPeekDecline: (name) => `${name} הציץ/ה והשאיר/ה את הקלף עליון`,
    logTurnSkip: (name) => `ל${name} לא היו קלפים לשלוף והתור הועבר`,
    logWindowMove: (lvl) => `חלון המשלוח עבר לרמה ${lvl}`,
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
