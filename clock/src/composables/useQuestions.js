import { formatTime } from '../constants/content.js'

const LEVEL_MINUTES = {
    1: [0, 30],
    2: [0, 15, 30, 45],
    3: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    4: Array.from({ length: 60 }, (_, i) => i),
}

function randomInt(max) {
    return Math.floor(Math.random() * max)
}

function randomHour() {
    return randomInt(12) + 1
}

function pick(arr) {
    return arr[randomInt(arr.length)]
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(i + 1)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

function buildQuestion(hour, minute, minutePool, optionCount) {
    const correctKey = `${hour}:${minute}`
    const used = new Set([correctKey])
    const options = [{ hour, minute, key: correctKey }]

    let guard = 0
    while (options.length < optionCount && guard < 200) {
        guard++
        const variesHour = Math.random() < 0.5
        let h = hour
        let m = minute
        if (variesHour) {
            h = ((hour - 1 + randomInt(11) + 1) % 12) + 1
        } else {
            m = pick(minutePool)
            if (m === minute) h = ((hour - 1 + randomInt(11) + 1) % 12) + 1
        }
        const key = `${h}:${m}`
        if (used.has(key)) continue
        used.add(key)
        options.push({ hour: h, minute: m, key })
    }

    shuffle(options)
    const correctIndex = options.findIndex((o) => o.key === correctKey)
    return {
        hour,
        minute,
        correctIndex,
        options: options.map((o) => ({ ...o, label: formatTime(o.hour, o.minute) })),
    }
}

export function generateFixedMinuteQuestion(minute) {
    return buildQuestion(randomHour(), minute, [minute], 3)
}

export function generateQuestion(level) {
    const minutes = LEVEL_MINUTES[level] || LEVEL_MINUTES[1]
    const hour = randomHour()
    const minute = pick(minutes)
    return buildQuestion(hour, minute, minutes, 4)
}

export function generateAnyMinuteQuestion() {
    const hour = randomHour()
    const minute = randomInt(60)
    const correctKey = `${hour}:${minute}`
    const used = new Set([correctKey])
    const options = [{ hour, minute, key: correctKey }]

    const offsets = shuffle([1, -1, 2, -2, 3, -3, 4, -4])
    for (const offset of offsets) {
        if (options.length >= 4) break
        const m = ((minute + offset) % 60 + 60) % 60
        const key = `${hour}:${m}`
        if (used.has(key)) continue
        used.add(key)
        options.push({ hour, minute: m, key })
    }

    shuffle(options)
    const correctIndex = options.findIndex((o) => o.key === correctKey)
    return {
        hour,
        minute,
        correctIndex,
        options: options.map((o) => ({ ...o, label: formatTime(o.hour, o.minute) })),
    }
}
