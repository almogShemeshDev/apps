import { ref, computed } from 'vue'

const lang = ref('en')

const strings = {
    en: {
        subtitle: 'A trick-taking card game',
        numPlayers: 'Number of players',
        human: 'Human',
        bot: 'Bot',
        startGame: 'Start Game',
        playerNameLabel: (i) => `Player ${i} name`,
        rules: 'Rules',
        newGame: 'New Game',
        confirmNewGame: 'Start a new game? Current progress will be lost.',
        pickBidSuffix: ', pick your bid card',
        bidHint: '1 = bet exactly 1 trick | 2 = bet exactly 2 tricks | 🌳 = bet exactly 0 or 3 tricks',
        playerOf: (a, b) => `Player ${a} of ${b}`,
        botThinking: '🤖 Thinking...',
        confirmBid: 'Confirm Bid',
        wonTrick: (name) => `${name} won the trick!`,
        nextTrick: 'Next Trick',
        gameOver: 'Game Over',
        colPlayer: 'Player',
        colTricks: 'Tricks',
        colBid: 'Bid',
        colBonus: 'Bonus',
        colTotal: 'Total',
        winsMsg: (name) => `🏆 ${name} wins!`,
        playAgain: 'Play Again',
        bidNone: 'None',
        bidTree: '🌳 (0 or 3)',
        noBid: 'No bid',
        trickCount: (n) => `${n} trick${n !== 1 ? 's' : ''}`,
        currentTrick: 'Current Trick',
        winnerLabel: 'Winner!',
        waitingForLead: 'Waiting for lead...',
        playedBidCard: 'You played your bid card!',
        pickNewBidSuffix: (name) => `Pick a new bid from your hand, ${name}`,
        bidHintShort: '1 = bet 1 trick | 2 = bet 2 tricks | 🌳 = bet exactly 0 or 3 tricks',
        confirmNewBid: 'Confirm New Bid',
        noCards: 'No cards',
        bidBoxLabel: 'BID',
        yourTurn: 'Your turn',
        thinking: 'Thinking...',
    },
    he: {
        subtitle: 'משחק קלפים של לקיחת טריקים',
        numPlayers: 'מספר שחקנים',
        human: 'אנושי',
        bot: 'בוט',
        startGame: 'התחל משחק',
        playerNameLabel: (i) => `שם שחקן ${i}`,
        rules: 'חוקים',
        newGame: 'משחק חדש',
        confirmNewGame: 'להתחיל משחק חדש? ההתקדמות הנוכחית תאבד.',
        pickBidSuffix: ', בחר קלף הימור',
        bidHint: '1 = הימור על טריק אחד | 2 = הימור על 2 טריקים | 🌳 = הימור על 0 או 3 טריקים',
        playerOf: (a, b) => `שחקן ${a} מתוך ${b}`,
        botThinking: '🤖 חושב...',
        confirmBid: 'אשר הימור',
        wonTrick: (name) => `${name} ניצח בטריק!`,
        nextTrick: 'טריק הבא',
        gameOver: 'סוף המשחק',
        colPlayer: 'שחקן',
        colTricks: 'טריקים',
        colBid: 'הימור',
        colBonus: 'בונוס',
        colTotal: 'סה"כ',
        winsMsg: (name) => `🏆 ${name} ניצח!`,
        playAgain: 'שחק שוב',
        bidNone: 'אין',
        bidTree: '🌳 (0 או 3)',
        noBid: 'אין הימור',
        trickCount: (n) => `${n} ${n !== 1 ? 'טריקים' : 'טריק'}`,
        currentTrick: 'טריק נוכחי',
        winnerLabel: 'ניצחון!',
        waitingForLead: 'ממתין לפתיחה...',
        playedBidCard: 'שיחקת את קלף ההימור שלך!',
        pickNewBidSuffix: (name) => `${name}, בחר הימור חדש מהיד שלך`,
        bidHintShort: '1 = הימור על טריק אחד | 2 = הימור על 2 טריקים | 🌳 = הימור על 0 או 3 טריקים',
        confirmNewBid: 'אשר הימור חדש',
        noCards: 'אין קלפים',
        bidBoxLabel: 'הימור',
        yourTurn: 'התור שלך',
        thinking: 'חושב...',
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
