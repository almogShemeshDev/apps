<script setup>
import { ref } from 'vue'
import ClockScene from './ClockScene.vue'
import { TXT } from '../constants/content.js'
import { generateQuestion } from '../composables/useQuestions.js'

const emit = defineEmits(['home'])

const level = ref(1)
const score = ref(0)
const streak = ref(0)
const question = ref(generateQuestion(level.value))
const answered = ref(null)
const isCorrect = ref(false)
const levelUpFlash = ref(false)
const clockRef = ref(null)
const feedbackLine = ref('')

function choose(i) {
    if (answered.value !== null) return
    answered.value = i
    isCorrect.value = i === question.value.correctIndex

    if (isCorrect.value) {
        score.value += 1
        streak.value += 1
        feedbackLine.value = TXT.correct[Math.floor(Math.random() * TXT.correct.length)]
        clockRef.value?.celebrate()
        if (streak.value >= 5 && level.value < 4) {
            level.value += 1
            streak.value = 0
            levelUpFlash.value = true
            setTimeout(() => (levelUpFlash.value = false), 1600)
        }
    } else {
        streak.value = 0
        feedbackLine.value = TXT.wrong
        clockRef.value?.shake()
    }
}

function next() {
    question.value = generateQuestion(level.value)
    answered.value = null
    isCorrect.value = false
    feedbackLine.value = ''
}
</script>

<template>
    <div class="practice">
        <div class="top-bar">
            <button class="icon-btn" @click="emit('home')">{{ TXT.home }}</button>
            <div class="score">⭐ {{ score }}</div>
            <div class="level-dots">
                <span v-for="i in 4" :key="i" class="dot" :class="{ active: i <= level }"></span>
            </div>
        </div>

        <transition name="pop">
            <div v-if="levelUpFlash" class="levelup">🚀 שלב חדש!</div>
        </transition>

        <div class="stage">
            <div class="clock-wrap">
                <ClockScene ref="clockRef" :hour="question.hour" :minute="question.minute" />
            </div>

            <div class="panel">
                <div class="options">
                    <button
                        v-for="(opt, i) in question.options"
                        :key="i"
                        class="btn opt"
                        :class="{
                            correct: answered !== null && i === question.correctIndex,
                            wrong: answered === i && i !== question.correctIndex,
                        }"
                        @click="choose(i)"
                    >
                        {{ opt.label }}
                    </button>
                </div>

                <p v-if="feedbackLine" class="feedback">{{ feedbackLine }}</p>

                <button v-if="answered !== null" class="btn next-btn" @click="next">{{ TXT.next }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.practice {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.6rem 1rem calc(1rem + env(safe-area-inset-bottom, 0px));
}

.top-bar {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.score {
    font-size: 1.2rem;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.7);
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
}

.level-dots {
    display: flex;
    gap: 0.4rem;
    margin-right: auto;
}
.dot {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: rgba(43, 43, 82, 0.2);
}
.dot.active {
    background: var(--green);
}

.levelup {
    position: absolute;
    top: 4.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--purple);
    color: white;
    font-weight: 900;
    padding: 0.5rem 1.2rem;
    border-radius: 999px;
    z-index: 5;
}

.pop-enter-active,
.pop-leave-active {
    transition: all 0.3s ease;
}
.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(0.6);
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
    gap: 0.8rem;
    min-width: 220px;
}

.options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    width: 260px;
}
.opt {
    background: var(--card);
    color: var(--ink);
    font-size: 1.25rem;
    padding: 0.8rem 0.4rem;
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
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}

.next-btn {
    background: var(--orange);
    color: white;
    font-size: 1.4rem;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
}
</style>
