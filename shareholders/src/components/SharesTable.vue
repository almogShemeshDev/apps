<template>
    <div class="shares-board">
        <div class="board-header">
            <span class="board-label">{{ t('sharesLabel') }}</span>
            <button class="btn-toggle-score" @click="$emit('toggle-score')">
                {{ showScore ? t('hideScore') : t('showScore') }}
            </button>
        </div>

        <div class="table-wrap">
            <table class="shares-table">
                <colgroup>
                    <col class="corner-col" />
                    <col v-for="p in players" :key="p.name" />
                </colgroup>
                <thead>
                    <tr>
                        <th class="corner"></th>
                        <th v-for="(p, i) in players" :key="p.name" :class="{ active: i === activeIndex }">
                            <span class="player-name">{{ p.name }}</span>
                            <span v-if="p.isBot" class="bot-tag">🤖</span>
                            <span v-if="i === activeIndex" class="badge badge-active">{{ t('activeBadge') }}</span>
                            <span v-if="i === startingIndex" class="badge badge-start">{{ t('startBadge') }}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="id in COMPANY_IDS" :key="id" :class="{ lowest: lowestIds.includes(id) }">
                        <th class="row-label" :title="t('companyName', id)">{{ COMPANIES[id].icon }}</th>
                        <td v-for="(p, i) in players" :key="p.name" :class="{ active: i === activeIndex }">
                            <IconRow :icon="SHARE_ICON" :count="p.shares[id]" />
                        </td>
                    </tr>
                    <tr v-if="showScore" class="score-row">
                        <th class="row-label" :title="t('scoreLabel')">🏆</th>
                        <td v-for="(p, i) in players" :key="p.name" :class="{ active: i === activeIndex }">
                            {{ liveScore(p) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconRow from './IconRow.vue'
import { COMPANIES, COMPANY_IDS, SHARE_ICON, computeLowestCompanies, computeScore } from '../constants.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    players: { type: Array, required: true },
    pool: { type: Object, required: true },
    activeIndex: { type: Number, default: -1 },
    startingIndex: { type: Number, default: -1 },
    showScore: { type: Boolean, default: false },
})
defineEmits(['toggle-score'])

const { t } = useLang()

const lowestIds = computed(() => computeLowestCompanies(props.pool))

function liveScore(player) {
    return computeScore(player.shares, props.pool, lowestIds.value)
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.shares-board {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.board-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.btn-toggle-score {
    background: transparent;
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: $text;
    }
}

.table-wrap {
    width: 100%;
    overflow-x: auto;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
}

.shares-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    th,
    td {
        padding: 8px 8px;
        text-align: center;
        overflow: hidden;
    }

    .corner-col {
        width: 44px;
    }

    thead th {
        border-bottom: 1px solid $border;
        font-weight: 700;
        font-size: 0.85rem;
        color: $text;

        &.active {
            color: $gold;
        }
    }

    .corner {
        width: 44px;
    }

    .row-label {
        font-size: 1.05rem;
        font-weight: 400;
    }

    tbody tr {
        &.lowest {
            opacity: 0.55;
        }

        &:not(:last-child) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
    }

    td.active {
        background: rgba(255, 182, 39, 0.08);
    }

    .score-row {
        border-top: 1px solid $border;
        font-weight: 700;
        color: $gold;
    }
}

.player-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.bot-tag {
    font-size: 0.8rem;
}

.badge {
    display: inline-block;
    margin-top: 2px;
    margin-inline-end: 4px;
    border-radius: 6px;
    padding: 1px 6px;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge-active {
    background: $gold;
    color: $bg-dark;
}

.badge-start {
    background: transparent;
    color: $teal;
    border: 1px solid $teal;
}
</style>
