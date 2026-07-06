<template>
    <div class="scoreboard">
        <h1>{{ t('gameOver') }}</h1>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>{{ t('colPlayer') }}</th>
                        <th>{{ t('colPhotos') }}</th>
                        <th>{{ t('colSequenceBonus') }}</th>
                        <th>{{ t('colVarietyBonus') }}</th>
                        <th>{{ t('colTotal') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in sortedScores" :key="row.name" :class="{ winner: row.total === maxScore }">
                        <td>{{ row.name }}</td>
                        <td>{{ row.photoScore }}</td>
                        <td>{{ row.sequenceBonus > 0 ? `+${row.sequenceBonus}` : '—' }}</td>
                        <td>{{ row.varietyBonus > 0 ? `+${row.varietyBonus}` : '—' }}</td>
                        <td class="total">{{ row.total }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="winner-msg">{{ t('winsMsg', winner?.name) }}</p>
        <button class="btn-play-again" @click="$emit('playAgain')">{{ t('playAgain') }}</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    scores: { type: Array, required: true },
})
defineEmits(['playAgain'])

const { t } = useLang()

const maxScore = computed(() => Math.max(...props.scores.map((s) => s.total)))
const winner = computed(() => props.scores.find((s) => s.total === maxScore.value))
const sortedScores = computed(() =>
    [...props.scores].sort((a, b) => b.total - a.total || b.photoScore - a.photoScore)
)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.scoreboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 40px 20px;
    color: $text;
}
h1 {
    font-size: 2rem;
    margin: 0;
}
.table-wrapper {
    width: 100%;
    overflow-x: auto;
}
table {
    border-collapse: collapse;
    min-width: 400px;
    width: 100%;
}
th,
td {
    padding: 10px 20px;
    text-align: center;
    border-bottom: 1px solid $border;
}
th {
    color: $text-dim;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
tr.winner td {
    color: $amber;
    font-weight: 700;
}
.total {
    font-size: 1.1rem;
    font-weight: 700;
}
.winner-msg {
    font-size: 1.4rem;
    font-weight: 700;
    color: $amber;
    margin: 0;
}
.btn-play-again {
    background: $amber;
    color: $bg-dark;
    border: none;
    padding: 10px 32px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    &:hover {
        background: $amber-light;
    }
}
</style>
