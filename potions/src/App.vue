<template>
    <div id="app" :dir="dir">
        <header class="top-bar">
            <button class="btn-ctrl btn-rules" @click="showRules = true">{{ t('rules') }}</button>
            <button class="btn-ctrl btn-lang" @click="toggleLang">
                {{ lang === 'en' ? 'עב' : 'EN' }}
            </button>
            <button
                v-if="state.phase !== 'setup' && state.phase !== 'game-over'"
                class="btn-ctrl btn-new-game"
                @click="confirmNewGame"
            >
                {{ t('newGame') }}
            </button>
            <button v-else-if="state.phase === 'game-over'" class="btn-ctrl btn-new-game" @click="resetGame">
                {{ t('newGame') }}
            </button>
        </header>

        <GameSetup v-if="state.phase === 'setup'" @start="startGame" />

        <GameBoard v-else-if="state.phase !== 'game-over'" />

        <GameOver v-else :players="state.players" @play-again="resetGame" />

        <CreditsFooter />

        <RulesModal v-if="showRules" @close="showRules = false" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import GameSetup from './components/GameSetup.vue'
import GameBoard from './components/GameBoard.vue'
import GameOver from './components/GameOver.vue'
import CreditsFooter from './components/CreditsFooter.vue'
import RulesModal from './components/RulesModal.vue'
import { useGameState } from './composables/useGameState.js'
import { useBotAI } from './composables/useBotAI.js'
import { useLang } from './composables/useLang.js'

const { state, startGame, resetGame } = useGameState()
useBotAI()
const { lang, t, dir, toggleLang } = useLang()

const showRules = ref(false)

watch(
    lang,
    (v) => {
        document.documentElement.setAttribute('dir', v === 'he' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', v)
    },
    { immediate: true }
)

function confirmNewGame() {
    if (window.confirm(t('confirmNewGame'))) {
        resetGame()
    }
}
</script>

<style lang="scss" scoped>
@use './styles/colors' as *;

#app {
    min-height: 100vh;
    background: $bg-dark;
}

.top-bar {
    display: flex;
    gap: 6px;
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid $border;
    direction: ltr;
}

.btn-ctrl {
    background: rgba(0, 0, 0, 0.35);
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
    }
}

.btn-new-game {
    margin-inline-start: auto;

    &:hover {
        background: rgba(220, 53, 69, 0.6);
        border-color: transparent;
    }
}
</style>
