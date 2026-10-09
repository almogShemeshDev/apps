<template>
    <div
        class="potion-card"
        :class="{ clickable, selected }"
        :style="{ '--potion-color': COLOR_META[color].hex }"
        :title="t('colorName', color)"
        :draggable="draggable"
        @click="clickable && $emit('click')"
        @dragstart="(e) => $emit('dragstart', e)"
    >
        <span class="potion-icon">{{ COLOR_META[color].icon }}</span>
        <span class="potion-name">{{ t('colorName', color) }}</span>
        <span class="potion-ability">{{ t('cardAbilityText', color) }}</span>
    </div>
</template>

<script setup>
import { COLOR_META } from '../constants.js'
import { useLang } from '../composables/useLang.js'

defineProps({
    color: { type: String, required: true },
    draggable: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
})
defineEmits(['click', 'dragstart'])

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

@keyframes potion-pop {
    0% {
        transform: scale(0) translateY(6px);
        opacity: 0;
    }
    55% {
        transform: scale(1.1) translateY(-3px);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(0);
    }
}

.potion-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    width: 86px;
    height: 122px;
    padding: 9px 6px 10px;
    border-radius: 12px;
    background: $bg-dark;
    border: 2px solid var(--potion-color);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    cursor: default;
    text-align: center;
    user-select: none;
    animation: potion-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition:
        transform 0.1s,
        box-shadow 0.1s;

    &.clickable {
        cursor: pointer;
    }

    &.selected {
        transform: scale(1.08) translateY(-3px);
        box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.06),
            0 0 0 2px #ffffff;
    }
}

.potion-icon {
    flex: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    background: var(--potion-color);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);
}

.potion-name {
    flex: none;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--potion-color);
}

.potion-ability {
    font-size: 0.62rem;
    line-height: 1.25;
    color: $text-dim;
}
</style>
