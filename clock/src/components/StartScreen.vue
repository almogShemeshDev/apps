<script setup>
import ClockScene from './ClockScene.vue'
import { TXT } from '../constants/content.js'

defineEmits(['select'])
</script>

<template>
    <div class="start">
        <h1 class="title">{{ TXT.title }}</h1>
        <div class="clock-wrap">
            <ClockScene :hour="10" :minute="10" />
        </div>
        <div class="menu">
            <button class="btn mode-btn learn" @click="$emit('select', 'learn')">
                <span class="emoji">💡</span>
                <span>{{ TXT.learn }}</span>
            </button>
            <button class="btn mode-btn practice" @click="$emit('select', 'practice')">
                <span class="emoji">🎯</span>
                <span>{{ TXT.practice }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.start {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
    padding: 1rem;
}

.title {
    font-size: clamp(1.8rem, 6vw, 3rem);
    margin: 0;
    color: var(--ink);
    text-shadow: 0 3px 0 rgba(255, 255, 255, 0.6);
}

.clock-wrap {
    width: min(55vw, 60vh, 320px);
    height: min(55vw, 60vh, 320px);
}

.menu {
    display: flex;
    gap: 1.2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.mode-btn {
    flex-direction: column;
    padding: 1.2rem 2.2rem;
    font-size: 1.3rem;
    color: white;
}

.mode-btn .emoji {
    font-size: 2.6rem;
}

.learn {
    background: linear-gradient(180deg, #8f6bff, var(--purple));
}

.practice {
    background: linear-gradient(180deg, #ff8aa8, var(--pink));
}
</style>
