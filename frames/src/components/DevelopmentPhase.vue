<template>
    <div class="development">
        <h1 class="title">{{ t('developmentPhaseTitle') }}</h1>
        <p class="sub">{{ t('developingFor', player.name) }}</p>

        <PlayerBoard
            :player="player"
            :is-active="true"
            :current-photo-index="dev.photoIndex"
            :awaiting-decision="dev.awaitingDarkroomChoice"
        />

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

        <!-- Bots draw and decide automatically via useBotAI -->
        <div v-if="isBot" class="bot-thinking">{{ t('botThinking', player.name) }}</div>
        <template v-else-if="dev.awaitingDarkroomChoice">
            <p class="choice-prompt">{{ t('blackCubeDrawn') }}</p>
            <div class="choice-buttons">
                <button class="btn-draw" @click="useDarkroom">
                    {{ t('useDarkroomBtn', dev.darkroomUsesRemaining) }}
                </button>
                <button class="btn-skip" @click="skipDarkroom">
                    {{ t('skipDarkroomBtn') }}
                </button>
            </div>
        </template>
        <button v-else-if="!dev.playerFinished" class="btn-draw" @click="developNextPhoto">
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

const { state, developNextPhoto, useDarkroom, skipDarkroom, continueDevelopment } = useGameState()
const { t } = useLang()

const dev = computed(() => state.development)
const player = computed(() => state.players[dev.value.playerIndex])
const isBot = computed(() => player.value?.isBot === true)
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

.bot-thinking {
    font-size: 0.95rem;
    color: $text-dim;
    padding: 12px 0;
    letter-spacing: 0.03em;
}

.choice-prompt {
    font-size: 0.9rem;
    color: $text;
    font-weight: 700;
}

.choice-buttons {
    display: flex;
    gap: 10px;
}

.btn-draw,
.btn-skip {
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-draw {
    background: $amber;
    color: $bg-dark;

    &:hover {
        background: $amber-light;
    }
}

.btn-skip {
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
