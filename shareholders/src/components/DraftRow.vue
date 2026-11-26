<template>
    <div class="draft-row">
        <span class="draft-label">{{ t('draftRowLabel') }}</span>
        <div class="draft-cards">
            <button
                v-for="(card, i) in row"
                :key="card.uid"
                class="draft-card"
                :class="card.kind"
                :disabled="!clickable"
                :title="t('companyName', card.company)"
                @click="$emit('pick', i)"
            >
                <span class="company-icon">{{ COMPANIES[card.company].icon }}</span>
                <span class="kind-icon">{{ card.kind === 'share' ? SHARE_ICON : TRAIN_ICON }}</span>
                <span class="kind-label">{{ t(card.kind === 'share' ? 'shareLabel' : 'trainLabel') }}</span>
            </button>
            <span v-if="!row.length" class="none">—</span>
        </div>
    </div>
</template>

<script setup>
import { COMPANIES, SHARE_ICON, TRAIN_ICON } from '../constants.js'
import { useLang } from '../composables/useLang.js'

defineProps({
    row: { type: Array, required: true },
    clickable: { type: Boolean, default: false },
})
defineEmits(['pick'])

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.draft-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.draft-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.draft-cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.draft-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 84px;
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s,
        transform 0.1s;

    &:hover:not(:disabled) {
        border-color: $gold;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }

    &.share {
        box-shadow: inset 0 0 0 1px rgba($gold, 0.25);
    }
}

.company-icon {
    font-size: 1.6rem;
}

.kind-icon {
    font-size: 1.1rem;
}

.kind-label {
    font-size: 0.68rem;
    color: $text-dim;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.none {
    color: $text-dim;
    font-size: 0.85rem;
}
</style>
