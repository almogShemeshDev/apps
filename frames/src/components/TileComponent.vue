<template>
    <div class="tile">
        <div class="face photo-face" :style="{ '--c': categoryColor }">
            <div class="face-icon">{{ categoryIcon }}</div>
            <div class="face-subject">{{ tile.photo.subject }}</div>
            <div class="face-category">{{ t('categoryName', tile.photo.category) }}</div>
            <div class="face-stats">
                <span>{{ t('costLabel', tile.photo.cost) }}</span>
                <span>{{ t('reqLabel', tile.photo.reqCreativity, tile.photo.reqEquipment) }}</span>
            </div>
            <button
                v-if="interactive"
                class="btn-action"
                :disabled="!canPhoto"
                @click="$emit('take-photo', tile.id)"
            >
                {{ t('takePhoto') }}
            </button>
        </div>

        <div class="face upgrade-face" :style="{ '--c': trackColor }">
            <div class="face-icon">{{ trackIcon }}</div>
            <div class="face-subject">{{ tile.upgrade.name }}</div>
            <div class="face-category">{{ t('trackName', tile.upgrade.track) }}</div>
            <div class="face-stats">
                <span>{{ t('upgradeCostLabel', tile.upgrade.cost) }}</span>
            </div>
            <button
                v-if="interactive"
                class="btn-action"
                :disabled="!canUpgrade"
                @click="$emit('buy-upgrade', tile.id)"
            >
                {{ t('buyUpgrade') }}
            </button>
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
})
defineEmits(['take-photo', 'buy-upgrade'])

const { t } = useLang()

const categoryIcon = computed(() => CATEGORIES[props.tile.photo.category]?.icon ?? '')
const categoryColor = computed(() => CATEGORIES[props.tile.photo.category]?.color ?? '#888')
const trackIcon = computed(() => TRACKS[props.tile.upgrade.track]?.icon ?? '')
const trackColor = computed(() => TRACKS[props.tile.upgrade.track]?.color ?? '#888')
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
    flex-direction: column;
    gap: 2px;
    font-size: 0.72rem;
    color: $text-dim;
}

.btn-action {
    margin-top: 4px;
    width: 100%;
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
</style>
