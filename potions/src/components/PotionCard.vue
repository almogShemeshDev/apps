<template>
    <div
        class="potion-card"
        :class="{ clickable, selected }"
        :style="{ background: COLOR_META[color].hex }"
        :title="t('colorName', color)"
        :draggable="draggable"
        @click="clickable && $emit('click')"
        @dragstart="(e) => $emit('dragstart', e)"
    >
        {{ COLOR_META[color].icon }}
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
@keyframes potion-pop {
    0% {
        transform: scale(0) translateY(6px);
        opacity: 0;
    }
    55% {
        transform: scale(1.25) translateY(-3px);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(0);
    }
}

.potion-card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    font-size: 0.85rem;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
    cursor: default;
    animation: potion-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition:
        transform 0.1s,
        box-shadow 0.1s;

    &.clickable {
        cursor: pointer;
    }

    &.selected {
        transform: scale(1.15) translateY(-2px);
        box-shadow:
            inset 0 0 0 2px rgba(0, 0, 0, 0.3),
            0 0 0 2px #ffffff;
    }
}
</style>
