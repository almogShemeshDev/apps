<script setup>
import { ref } from 'vue'
import StartScreen from './components/StartScreen.vue'
import LearnMode from './components/LearnMode.vue'
import PracticeMode from './components/PracticeMode.vue'

const view = ref('menu')
</script>

<template>
    <StartScreen v-if="view === 'menu'" @select="(v) => (view = v)" />
    <LearnMode v-else-if="view === 'learn'" @home="view = 'menu'" />
    <PracticeMode v-else-if="view === 'practice'" @home="view = 'menu'" />
</template>
