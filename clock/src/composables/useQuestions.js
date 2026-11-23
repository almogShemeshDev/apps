import { formatTime } from '../constants/content.js'

const LEVEL_MINUTES = {
    1: [0, 30],
    2: [0, 15, 30, 45],
    3: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
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

export function generateFixedMinuteQuestion(minute) {
    const hour = randomHour()
    const correctKey = `${hour}:${minute}`
    const used = new Set([correctKey])
    const options = [{ hour, minute, key: correctKey }]

    let guard = 0
    while (options.length < 3 && guard < 100) {
        guard++
        const h = ((hour - 1 + randomInt(11) + 1) % 12) + 1
        const key = `${h}:${minute}`
        if (used.has(key)) continue
        used.add(key)
        options.push({ hour: h, minute, key })
    }

    for (let i = options.length - 1; i > 0; i--) {
        const j = randomInt(i + 1)
        ;[options[i], options[j]] = [options[j], options[i]]
    }

    const correctIndex = options.findIndex((o) => o.key === correctKey)
    return {
        hour,
        minute,
        correctIndex,
        options: options.map((o) => ({ ...o, label: formatTime(o.hour, o.minute) })),
    }
}

export function generateQuestion(level) {
    const minutes = LEVEL_MINUTES[level] || LEVEL_MINUTES[1]
    const hour = randomHour()
    const minute = pick(minutes)
    const correctKey = `${hour}:${minute}`

    const used = new Set([correctKey])
    const options = [{ hour, minute, key: correctKey }]

    let guard = 0
    while (options.length < 4 && guard < 100) {
        guard++
        const variesHour = Math.random() < 0.5
        let h = hour
        let m = minute
        if (variesHour) {
            h = ((hour - 1 + randomInt(11) + 1) % 12) + 1
        } else {
            m = pick(minutes)
            if (m === minute) h = ((hour - 1 + randomInt(11) + 1) % 12) + 1
        }
        const key = `${h}:${m}`
        if (used.has(key)) continue
        used.add(key)
        options.push({ hour: h, minute: m, key })
    }

    for (let i = options.length - 1; i > 0; i--) {
        const j = randomInt(i + 1)
        ;[options[i], options[j]] = [options[j], options[i]]
    }

    const correctIndex = options.findIndex((o) => o.key === correctKey)
    return {
        hour,
        minute,
        correctIndex,
        options: options.map((o) => ({ ...o, label: formatTime(o.hour, o.minute) })),
    }
}
