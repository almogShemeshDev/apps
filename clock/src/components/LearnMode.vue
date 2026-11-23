<script setup>
import { computed, ref, watch } from 'vue'
import ClockScene from './ClockScene.vue'
import { formatTime, TXT } from '../constants/content.js'
import { generateFixedMinuteQuestion } from '../composables/useQuestions.js'

const STEP_COUNT = 4
const step = ref(0)
const clockRef = ref(null)

// step 0: hands
const foundHour = ref(false)
const foundMinute = ref(false)

// step 1: numbers in order
const nextNumber = ref(1)
const numbersDone = computed(() => nextNumber.value > 12)

// step 2 & 3: mini quiz (full hour / half hour)
const quiz = ref(null)
const answered = ref(null)
const isCorrect = ref(false)

function newQuiz(minute) {
    quiz.value = generateFixedMinuteQuestion(minute)
    answered.value = null
    isCorrect.value = false
}

const canAdvance = computed(() => {
    if (step.value === 0) return foundHour.value && foundMinute.value
    if (step.value === 1) return numbersDone.value
    if (step.value === 2 || step.value === 3) return isCorrect.value
    return true
})

const clockTime = computed(() => {
    if (step.value === 0) return { hour: 3, minute: 0 }
    if (step.value === 1) return { hour: 12, minute: 0 }
    if (step.value === 2) return quiz.value ? { hour: quiz.value.hour, minute: quiz.value.minute } : { hour: 5, minute: 0 }
    if (step.value === 3) return quiz.value ? { hour: quiz.value.hour, minute: quiz.value.minute } : { hour: 5, minute: 30 }
    return { hour: 3, minute: 0 }
})

watch(
    step,
    (s) => {
        if (s === 2) newQuiz(0)
        if (s === 3) newQuiz(30)
        foundHour.value = false
        foundMinute.value = false
        nextNumber.value = 1
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
    }
}

function choose(i) {
    if (answered.value !== null) return
    answered.value = i
    isCorrect.value = i === quiz.value.correctIndex
    if (isCorrect.value) clockRef.value?.celebrate()
    else clockRef.value?.shake()
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
                <ClockScene ref="clockRef" :hour="clockTime.hour" :minute="clockTime.minute" @pick="handlePick" />
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

                <template v-else-if="step === 2 || step === 3">
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
    padding: 0.6rem 1rem 1rem;
}

.top-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.dots {
    display: flex;
    gap: 0.5rem;
    margin: 0 auto;
}
.dot {
    width: 0.7rem;
    height: 0.7rem;
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
}

.clock-wrap {
    width: min(50vw, 55vh, 300px);
    height: min(50vw, 55vh, 300px);
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
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

.big-num {
    font-size: 3.4rem;
    font-weight: 900;
    color: var(--orange);
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
