<template>
    <div class="development">
        <h1 class="title">{{ t('developmentPhaseTitle') }}</h1>
        <p class="sub">{{ t('developingFor', player.name) }}</p>

        <PlayerBoard :player="player" :is-active="true" />

        <div class="darkroom-status">
            {{ t('darkroomUsesLeft', dev.darkroomUsesRemaining) }}
        </div>

        <div v-if="dev.lastResult" class="result" :class="{ developed: dev.lastResult.developed, burned: !dev.lastResult.developed }">
            <span class="result-icon">{{ CATEGORIES[dev.lastResult.category].icon }}</span>
            <span class="result-subject">{{ dev.lastResult.subject }}</span>
            <span class="result-status">
                {{ dev.lastResult.developed ? t('developed') : t('burned') }}
                <template v-if="dev.lastResult.savedByDarkroom"> — {{ t('darkroomSaved') }}</template>
            </span>
        </div>

        <button v-if="!dev.playerFinished" class="btn-draw" @click="developNextPhoto">
            {{ t('drawNext') }}
        </button>
        <button v-else class="btn-draw" @click="continueDevelopment">
            {{ t('continueButton') }}
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerBoard from './PlayerBoard.vue'
import { CATEGORIES } from '../constants.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, developNextPhoto, continueDevelopment } = useGameState()
const { t } = useLang()

const dev = computed(() => state.development)
const player = computed(() => state.players[dev.value.playerIndex])
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.development {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
}

.title {
    font-size: 1.8rem;
    color: $amber;
}

.sub {
    color: $text-dim;
    font-size: 0.9rem;
}

.darkroom-status {
    font-size: 0.8rem;
    color: $text-dim;
}

.result {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 10px;
    background: $bg-panel;
    border: 2px solid $border;
    font-size: 0.9rem;
    min-width: 280px;
    justify-content: center;

    &.developed {
        border-color: $white-cube;
    }

    &.burned {
        border-color: $danger;
        opacity: 0.8;
    }
}

.result-icon {
    font-size: 1.2rem;
}

.result-subject {
    font-weight: 700;
}

.btn-draw {
    background: $amber;
    color: $bg-dark;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: $amber-light;
    }
}
</style>
