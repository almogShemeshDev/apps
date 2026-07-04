<template>
    <div class="tile">
        <div class="face photo-face" :style="{ '--c': categoryColor }">
            <div class="face-icon">{{ categoryIcon }}</div>
            <div class="face-subject">{{ tile.subject }}</div>
            <div class="face-category">{{ t('categoryName', tile.category) }}</div>
            <div class="face-stats">
                <span>{{ t('costLabel', tile.cost) }}</span>
                <span>{{ t('reqLabel', tile.reqCreativity, tile.reqEquipment) }}</span>
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

        <div class="upgrade-row">
            <div class="upgrade-label">{{ t('buyUpgrade') }}</div>
            <div class="track-buttons">
                <button
                    v-for="key in trackKeys"
                    :key="key"
                    class="track-btn"
                    :style="{ '--c': TRACKS[key].color }"
                    :disabled="!interactive || !canUpgrade"
                    :title="t('trackName', key)"
                    @click="$emit('buy-upgrade', tile.id, key)"
                >
                    {{ TRACKS[key].icon }}
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
})
defineEmits(['take-photo', 'buy-upgrade'])

const { t } = useLang()

const trackKeys = ['creativity', 'equipment', 'knowledge', 'darkroom']
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

.upgrade-row {
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.upgrade-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-dim;
    font-weight: 700;
}

.track-buttons {
    display: flex;
    gap: 6px;
}

.track-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid var(--c);
    background: rgba(255, 255, 255, 0.04);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        background 0.15s,
        opacity 0.15s;

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        background: var(--c);
    }
}
</style>
