<template>
    <div id="app" :dir="dir">
        <GameSetup v-if="state.phase === 'setup'" @start="startGame" />
        <GameBoard
            v-else-if="
                state.phase === 'playing' ||
                state.phase === 'trick-result' ||
                state.phase === 'dice-picking'
            "
        />
        <ScoreBoard
            v-else-if="state.phase === 'game-over'"
            :players="state.players"
            @playAgain="resetGame"
        />

        <!-- Fixed controls — always visible -->
        <div class="fixed-controls">
            <button class="btn-ctrl" @click="showRules = true">{{ t('rules') }}</button>
            <button class="btn-ctrl btn-lang" @click="toggleLang">{{
                lang === 'en' ? 'עב' : 'EN'
            }}</button>
        </div>
        <RulesModal v-if="showRules" @close="showRules = false" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import GameSetup from './components/GameSetup.vue'
import GameBoard from './components/GameBoard.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import RulesModal from './components/RulesModal.vue'
import { useGameState } from './composables/useGameState.js'
import { useBotAI } from './composables/useBotAI.js'
import { useLang } from './composables/useLang.js'

const { state, startGame, resetGame } = useGameState()
useBotAI()

const { lang, t, dir, toggleLang } = useLang()
watch(
    lang,
    (v) => {
        document.documentElement.setAttribute('dir', v === 'he' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', v)
    },
    { immediate: true }
)

const showRules = ref(false)
</script>

<style lang="scss" scoped>
@use './styles/colors' as *;

#app {
    min-height: 100vh;
}

.fixed-controls {
    position: fixed;
    top: 12px;
    inset-inline-start: 12px;
    display: flex;
    gap: 6px;
    z-index: 50;
    direction: ltr;
}

.btn-ctrl {
    background: rgba(0, 0, 0, 0.5);
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 5px 13px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        color 0.15s,
        background 0.15s;

    &:hover {
        color: $text;
        background: rgba(255, 255, 255, 0.07);
    }
}
</style>
