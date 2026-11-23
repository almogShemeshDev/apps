export const TXT = {
    title: 'השעון שלי',
    learn: 'לומדים',
    practice: 'מתרגלים',
    home: '🏠',
    back: '→',
    next: '←',
    tryIt: 'עליך!',
    correct: ['כל הכבוד! 🎉', 'מעולה! ⭐', 'נכון! 👏', 'יפה מאוד! 🌟'],
    wrong: 'כמעט... ⟲',
    score: 'ניקוד',
    hourHandLabel: 'קצר = שעות',
    minuteHandLabel: 'ארוך = דקות',
}

export function formatTime(hour, minute) {
    const h = ((hour - 1) % 12) + 1
    return `${h}:${String(minute).padStart(2, '0')}`
}
