<template>
    <div class="tile">
        <div class="face photo-face" :style="{ '--c': categoryColor }">
            <div class="face-icon">{{ categoryIcon }}</div>
            <div class="face-subject">{{ tile.subject }}</div>
            <div class="face-category">{{ t('categoryName', tile.category) }}</div>
            <div class="face-stats">
                <span class="stat-pill cost-pill" :title="t('costLabel', tile.cost)">
                    <span v-for="n in tile.cost" :key="n">⏱</span>
                </span>
                <span class="stat-pill" :title="t('trackName', 'creativity')">{{ TRACKS.creativity.icon }}{{ tile.reqCreativity }}</span>
                <span class="stat-pill" :title="t('trackName', 'equipment')">{{ TRACKS.equipment.icon }}{{ tile.reqEquipment }}</span>
            </div>
            <div v-if="interactive" class="action-row">
                <button class="btn-action" :disabled="!canPhoto" @click="$emit('take-photo')">
                    {{ t('takePhoto') }}
                </button>
                <button
                    v-if="bonusBelow > 0"
                    class="gain-chip"
                    :disabled="!canGainBelow"
                    :title="t('bonusBelowTitle', bonusBelow)"
                    @click="$emit('gain-below')"
                >
                    +⏱{{ bonusBelow }}
                </button>
            </div>
        </div>

        <div class="face upgrade-face" :style="{ '--c': TRACKS[upgradeTrack].color }">
            <div class="face-icon">{{ TRACKS[upgradeTrack].icon }}</div>
            <div class="face-subject">{{ t('trackName', upgradeTrack) }}</div>
            <div class="face-stats">
                <span class="stat-pill cost-pill" :title="t('costLabel', upgradeCost)">
                    <span v-for="n in upgradeCost" :key="n">⏱</span>
                </span>
            </div>
            <div v-if="interactive" class="action-row">
                <button class="btn-action" :disabled="!canUpgrade" @click="$emit('buy-upgrade')">
                    {{ t('upgradeBtn') }}
                </button>
                <button
                    v-if="bonusAbove > 0"
                    class="gain-chip"
                    :disabled="!canGainAbove"
                    :title="t('bonusAboveTitle', bonusAbove)"
                    @click="$emit('gain-above')"
                >
                    +⏱{{ bonusAbove }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORIES, TRACKS } from '../constants.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    tile: { type: Object, required: true },
    interactive: { type: Boolean, default: false },
    canPhoto: { type: Boolean, default: false },
    canUpgrade: { type: Boolean, default: false },
    upgradeCost: { type: Number, required: true },
    upgradeTrack: { type: String, required: true },
    bonusBelow: { type: Number, default: 0 },
    bonusAbove: { type: Number, default: 0 },
    canGainBelow: { type: Boolean, default: false },
    canGainAbove: { type: Boolean, default: false },
})
defineEmits(['take-photo', 'buy-upgrade', 'gain-below', 'gain-above'])

const { t } = useLang()

const categoryIcon = computed(() => CATEGORIES[props.tile.category]?.icon ?? '')
const categoryColor = computed(() => CATEGORIES[props.tile.category]?.color ?? '#888')
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.tile {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 150px;
    flex-shrink: 0;
}

.face {
    background: $bg-panel;
    border: 2px solid var(--c);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
}

.face-icon {
    font-size: 1.4rem;
}

.face-subject {
    font-size: 0.8rem;
    font-weight: 700;
    color: $text;
    min-height: 2.2em;
}

.face-category {
    font-size: 0.68rem;
    color: var(--c);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
}

.face-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
}

.stat-pill {
    font-size: 0.78rem;
    font-weight: 700;
    color: $text;
}

.cost-pill {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1px;
}

.action-row {
    margin-top: 4px;
    width: 100%;
    display: flex;
    gap: 4px;
}

.btn-action {
    flex: 1;
    min-width: 0;
    background: var(--c);
    color: $bg-dark;
    border: none;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;

    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        opacity: 0.85;
    }
}

.gain-chip {
    flex-shrink: 0;
    background: rgba(217, 122, 74, 0.15);
    border: 1px solid $amber;
    color: $amber-light;
    border-radius: 6px;
    padding: 6px 7px;
    font-size: 0.65rem;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background 0.15s,
        opacity 0.15s;

    &:hover:not(:disabled) {
        background: rgba(217, 122, 74, 0.3);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}
</style>
