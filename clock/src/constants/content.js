export const TXT = {
    title: 'השעון שלי',
    learn: 'לומדים',
    practice: 'מתרגלים',
    home: '🏠',
    back: '→',
    next: '←',
    tryIt: 'תורך!',
    correct: ['כל הכבוד! 🎉', 'מעולה! ⭐', 'נכון! 👏', 'יפה מאוד! 🌟'],
    wrong: 'כמעט... ⟲',
    score: 'ניקוד',
    hourHandLabel: 'קצר = שעות',
    minuteHandLabel: 'ארוך = דקות',
    halfPastLabel: 'וחצי',
    quarterPastLabel: 'רבע אחרי',
    quarterToLabel: 'רבע לפני',
    minuteTickHint: '👉 גרור את המחוגים',
    minuteTickLabel: 'כל קו = דקה אחת',
    fiveJumpHint: '👉 גע במספרים לפי הסדר',
    fiveJumpLabel: 'כל מספר = 5 דקות',
}

export function formatTime(hour, minute) {
    const h = ((hour - 1) % 12) + 1
    return `${h}:${String(minute).padStart(2, '0')}`
}

const HOUR_WORDS = [
    '',
    'אחת',
    'שתיים',
    'שלוש',
    'ארבע',
    'חמש',
    'שש',
    'שבע',
    'שמונה',
    'תשע',
    'עשר',
    'אחת עשרה',
    'שתים עשרה',
]

// Minute words follow how Israelis actually say clock times, not plain number-to-words:
// a bare count (no "דקות" noun) defaults to the masculine form ("חמישה", "עשרה"), a count
// paired with the noun "דקות" (feminine) agrees with it ("שתים עשרה דקות"), and a compound
// tens+ones value (e.g. 25) drops the connector before the hour since the "ו" already sits
// inside the compound itself ("אחת עשרה עשרים וחמש", not "אחת עשרה ועשרים וחמש").
const FEM_ONES_WORDS = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע']
const FEM_TEENS_WORDS = [
    'עשר',
    'אחת עשרה',
    'שתים עשרה',
    'שלוש עשרה',
    'ארבע עשרה',
    'חמש עשרה',
    'שש עשרה',
    'שבע עשרה',
    'שמונה עשרה',
    'תשע עשרה',
]
const MASC_UNITS_AND_TEN_WORDS = {
    2: 'שניים',
    3: 'שלושה',
    4: 'ארבעה',
    5: 'חמישה',
    6: 'שישה',
    7: 'שבעה',
    8: 'שמונה',
    9: 'תשעה',
    10: 'עשרה',
}
const TENS_WORDS = { 2: 'עשרים', 3: 'שלושים', 4: 'ארבעים', 5: 'חמישים' }

function compoundFeminineWord(n) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    const tensWord = TENS_WORDS[tens]
    return ones === 0 ? tensWord : `${tensWord} ו${FEM_ONES_WORDS[ones]}`
}

export function timePhrase(hour, minute) {
    const hour12 = ((hour - 1) % 12) + 1
    const hourWord = HOUR_WORDS[hour12]
    if (minute === 0) return hourWord
    if (minute === 1) return `${hourWord} ודקה`
    if (minute === 15) return `${hourWord} ורבע`
    if (minute === 30) return `${hourWord} וחצי`
    if (minute === 45) {
        const nextHour = (hour12 % 12) + 1
        return `רבע ל${HOUR_WORDS[nextHour]}`
    }
    if (minute <= 10) return `${hourWord} ו${MASC_UNITS_AND_TEN_WORDS[minute]}`
    if (minute < 20) return `${hourWord} ו${FEM_TEENS_WORDS[minute - 10]} דקות`
    const ones = minute % 10
    if (ones === 0) return `${hourWord} ו${TENS_WORDS[Math.floor(minute / 10)]}`
    return `${hourWord} ${compoundFeminineWord(minute)}`
}
