<script setup>
import { computed, ref, watch } from 'vue'
import ClockScene from './ClockScene.vue'
import { TXT, formatTime, timePhrase } from '../constants/content.js'
import {
    generateAnyMinuteQuestion,
    generateFixedMinuteQuestion,
} from '../composables/useQuestions.js'

const STEP_COUNT = 9
const step = ref(0)
const clockRef = ref(null)

// step 0: hands
const foundHour = ref(false)
const foundMinute = ref(false)

// step 1: numbers in order
const nextNumber = ref(1)
const numbersDone = computed(() => nextNumber.value > 12)

// step 2: each number = 5 minutes
const nextFive = ref(1)
const tappedFive = ref(null)
const fiveDone = computed(() => nextFive.value > 12)

// step 3: drag-to-explore hours & minutes
const exploreHour = ref(4)
const exploreMinute = ref(0)
const exploredAny = ref(false)
const explorePhrase = computed(() => timePhrase(exploreHour.value, exploreMinute.value))
const exploreDigital = computed(() => formatTime(exploreHour.value, exploreMinute.value))

// steps 4-8: mini quiz
const quiz = ref(null)
const answered = ref(null)
const isCorrect = ref(false)

const STEP_CHIP = {
    5: 'halfPastLabel',
    6: 'quarterPastLabel',
    7: 'quarterToLabel',
}
const stepChip = computed(() => {
    const key = STEP_CHIP[step.value]
    return key ? TXT[key] : null
})

function newQuiz(generator) {
    quiz.value = generator()
    answered.value = null
    isCorrect.value = false
}

const canAdvance = computed(() => {
    if (step.value === 0) return foundHour.value && foundMinute.value
    if (step.value === 1) return numbersDone.value
    if (step.value === 2) return fiveDone.value
    if (step.value === 3) return exploredAny.value
    if (step.value >= 4) return isCorrect.value
    return true
})

const clockTime = computed(() => {
    const fallback = {
        4: { hour: 5, minute: 0 },
        5: { hour: 5, minute: 30 },
        6: { hour: 2, minute: 15 },
        7: { hour: 2, minute: 45 },
        8: { hour: 6, minute: 23 },
    }
    if (step.value === 0) return { hour: 3, minute: 0 }
    if (step.value === 1) return { hour: 12, minute: 0 }
    if (step.value === 2) return { hour: 6, minute: tappedFive.value ? (tappedFive.value * 5) % 60 : 0 }
    if (step.value === 3) return { hour: exploreHour.value, minute: exploreMinute.value }
    if (fallback[step.value]) {
        return quiz.value ? { hour: quiz.value.hour, minute: quiz.value.minute } : fallback[step.value]
    }
    return { hour: 3, minute: 0 }
})

watch(
    step,
    (s, prev) => {
        if (prev === 3) clockRef.value?.disableClockScrub()
        if (s === 4) newQuiz(() => generateFixedMinuteQuestion(0))
        if (s === 5) newQuiz(() => generateFixedMinuteQuestion(30))
        if (s === 6) newQuiz(() => generateFixedMinuteQuestion(15))
        if (s === 7) newQuiz(() => generateFixedMinuteQuestion(45))
        if (s === 3) {
            exploreHour.value = 4
            exploreMinute.value = 0
            exploredAny.value = false
            clockRef.value?.enableClockScrub((type, value) => {
                if (type === 'hour') exploreHour.value = value
                else exploreMinute.value = value
                exploredAny.value = true
            })
        }
        if (s === 8) newQuiz(generateAnyMinuteQuestion)
        foundHour.value = false
        foundMinute.value = false
        nextNumber.value = 1
        nextFive.value = 1
        tappedFive.value = null
    },
    { immediate: true }
)

function handlePick({ type, value }) {
    if (step.value === 0) {
        if (type === 'hour') {
            foundHour.value = true
            clockRef.value?.setGlow('hour', true)
        }
        if (type === 'minute') {
            foundMinute.value = true
            clockRef.value?.setGlow('minute', true)
        }
    } else if (step.value === 1) {
        if (type === 'number' && value === nextNumber.value) {
            clockRef.value?.setNumberGlow(value, true)
            nextNumber.value += 1
            if (nextNumber.value > 12) clockRef.value?.celebrate()
        }
    } else if (step.value === 2) {
        if (type === 'number' && value === nextFive.value) {
            clockRef.value?.setNumberGlow(value, true)
            tappedFive.value = value
            nextFive.value += 1
            if (nextFive.value > 12) clockRef.value?.celebrate()
        }
    }
}

function choose(i) {
    if (isCorrect.value) return
    answered.value = i
    isCorrect.value = i === quiz.value.correctIndex
    if (isCorrect.value) {
        clockRef.value?.celebrate()
    } else {
        clockRef.value?.shake()
        setTimeout(() => {
            if (!isCorrect.value) answered.value = null
        }, 900)
    }
}

function next() {
    if (!canAdvance.value) return
    if (step.value < STEP_COUNT - 1) step.value += 1
}
function prev() {
    if (step.value > 0) step.value -= 1
}

defineEmits(['home'])
</script>

<template>
    <div class="learn">
        <div class="top-bar">
            <button class="icon-btn" @click="$emit('home')">{{ TXT.home }}</button>
            <div class="dots">
                <span v-for="i in STEP_COUNT" :key="i" class="dot" :class="{ active: i - 1 === step }"></span>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="stage">
            <div class="clock-wrap">
                <ClockScene
                    ref="clockRef"
                    :hour="clockTime.hour"
                    :minute="clockTime.minute"
                    :animate="step !== 2"
                    @pick="handlePick"
                />
            </div>

            <div class="panel">
                <template v-if="step === 0">
                    <p class="hint">👉 גע במחוגים</p>
                    <div class="chips">
                        <span class="chip hour" :class="{ on: foundHour }">{{ TXT.hourHandLabel }}</span>
                        <span class="chip minute" :class="{ on: foundMinute }">{{ TXT.minuteHandLabel }}</span>
                    </div>
                </template>

                <template v-else-if="step === 1">
                    <p class="hint">👉 גע במספרים לפי הסדר</p>
                    <div class="big-num">{{ numbersDone ? '🌟' : nextNumber }}</div>
                </template>

                <template v-else-if="step === 2">
                    <p class="hint">{{ TXT.fiveJumpHint }}</p>
                    <div v-if="tappedFive" class="digital equation">
                        {{ tappedFive }} &times; 5 = {{ tappedFive * 5 }}
                    </div>
                    <div v-else class="big-num">{{ fiveDone ? '🌟' : '?' }}</div>
                    <span class="chip label-chip">{{ TXT.fiveJumpLabel }}</span>
                </template>

                <template v-else-if="step === 3">
                    <p class="hint">{{ TXT.minuteTickHint }}</p>
                    <div class="digital">{{ exploreDigital }}</div>
                    <div class="phrase">{{ explorePhrase }}</div>
                    <span class="chip label-chip">{{ TXT.minuteTickLabel }}</span>
                </template>

                <template v-else>
                    <span v-if="stepChip" class="chip label-chip">{{ stepChip }}</span>
                    <p class="hint">{{ TXT.tryIt }}</p>
                    <div class="options">
                        <button
                            v-for="(opt, i) in quiz?.options || []"
                            :key="i"
                            class="btn opt"
                            :class="{
                                picked: answered === i,
                                correct: answered !== null && i === quiz.correctIndex,
                                wrong: answered === i && i !== quiz.correctIndex,
                            }"
                            @click="choose(i)"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                    <p v-if="answered !== null" class="feedback">
                        {{ isCorrect ? TXT.correct[0] : TXT.wrong }}
                    </p>
                </template>
            </div>
        </div>

        <div class="nav">
            <button class="icon-btn" :disabled="step === 0" @click="prev">{{ TXT.back }}</button>
            <button class="icon-btn go" :disabled="!canAdvance" @click="next" v-if="step < STEP_COUNT - 1">
                {{ TXT.next }}
            </button>
            <button class="icon-btn go" v-else :disabled="!canAdvance" @click="$emit('home')">🏁</button>
        </div>
    </div>
</template>

<style scoped>
.learn {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.6rem 1rem calc(1rem + env(safe-area-inset-bottom, 0px));
}

.top-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.dots {
    display: flex;
    gap: 0.4rem;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 60%;
}
.dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: rgba(43, 43, 82, 0.2);
}
.dot.active {
    background: var(--purple);
}
.spacer {
    width: 3.2rem;
}

.stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    flex-wrap: wrap;
    min-height: 0;
    overflow-y: auto;
}

.clock-wrap {
    width: min(50vw, 48dvh, 300px);
    height: min(50vw, 48dvh, 300px);
    flex-shrink: 0;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    min-width: 220px;
}

.hint {
    font-size: 1.1rem;
    margin: 0;
}

.chips {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}
.chip {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.6);
    font-weight: 700;
    opacity: 0.45;
    transition: all 0.2s;
    text-align: center;
}
.chip.on {
    opacity: 1;
    transform: scale(1.05);
}
.chip.hour {
    color: var(--purple);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
}
.chip.minute {
    color: var(--pink);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
}
.chip.label-chip {
    opacity: 1;
    color: var(--orange);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
    font-size: 1.1rem;
}

.big-num {
    font-size: 3.4rem;
    font-weight: 900;
    color: var(--orange);
}

.digital {
    font-size: 2.6rem;
    font-weight: 900;
    color: var(--orange);
    direction: ltr;
}

.digital.equation {
    font-size: 2rem;
}

.phrase {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--purple);
    min-height: 1.8em;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    width: 220px;
}
.opt {
    background: var(--card);
    color: var(--ink);
    font-size: 1.3rem;
    padding: 0.7rem 1rem;
    border-radius: 16px;
}
.opt.correct {
    background: var(--green);
    color: white;
}
.opt.wrong {
    background: #ff6b6b;
    color: white;
}

.feedback {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    padding-top: 0.4rem;
    flex-shrink: 0;
}

.go {
    background: var(--green);
    color: white;
}

button:disabled {
    opacity: 0.3;
    cursor: default;
}
</style>
