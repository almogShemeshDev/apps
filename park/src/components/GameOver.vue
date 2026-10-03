<template>
    <div class="game-over">
        <h1 class="title">{{ t('gameOverTitle') }}</h1>

        <div v-if="isSolo" class="solo-result">
            <p class="outcome">{{ outcome === 'win' ? t('youWin', players[0].vp) : t('youLose', players[0].vp) }}</p>
        </div>

        <div v-else class="standings">
            <p class="standings-label">{{ t('finalStandings') }}</p>
            <div v-for="p in sortedPlayers" :key="p.name" class="row" :class="{ winner: p.vp === topVp }">
                <span class="name">{{ p.name }}</span>
                <span class="vp">🏆 {{ p.vp }}</span>
            </div>
            <p class="winner-line">
                {{ tiedForFirst ? t('tiedLabel') : t('winnerLabel', sortedPlayers[0].name) }}
            </p>
        </div>

        <button class="btn-again" @click="$emit('play-again')">{{ t('playAgain') }}</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    players: { type: Array, required: true },
    isSolo: { type: Boolean, default: false },
    outcome: { type: String, default: null },
})
defineEmits(['play-again'])

const { t } = useLang()

const sortedPlayers = computed(() => [...props.players].sort((a, b) => b.vp - a.vp))
const topVp = computed(() => sortedPlayers.value[0]?.vp ?? 0)
const tiedForFirst = computed(() => sortedPlayers.value.filter((p) => p.vp === topVp.value).length > 1)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.game-over {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px;
}

.title {
    font-size: 2.2rem;
    font-weight: 700;
    color: $gold;
    letter-spacing: 0.04em;
}

.solo-result,
.standings {
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 24px 32px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.outcome {
    font-size: 1.05rem;
    text-align: center;
    color: $text;
}

.standings-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-dim;
}

.row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.95rem;

    &.winner {
        background: rgba(255, 182, 39, 0.15);
        color: $gold;
        font-weight: 700;
    }
}

.winner-line {
    margin-top: 8px;
    font-size: 1rem;
    font-weight: 700;
    color: $gold;
}

.btn-again {
    background: $gold;
    color: $bg-dark;
    border: none;
    padding: 13px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.15s;

    &:hover {
        background: $gold-light;
    }
}
</style>
