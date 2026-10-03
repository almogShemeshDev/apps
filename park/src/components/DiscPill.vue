<template>
    <button
        class="disc-pill"
        :class="{ selectable, selected }"
        :style="{ background: DISC_TYPES[type].color }"
        :title="t('discName', type)"
        :disabled="!selectable"
        type="button"
        @click="$emit('toggle')"
    >
        {{ DISC_TYPES[type].icon }}
    </button>
</template>

<script setup>
import { DISC_TYPES } from '../constants.js'
import { useLang } from '../composables/useLang.js'

defineProps({
    type: { type: String, required: true },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
})
defineEmits(['toggle'])
const { t } = useLang()
</script>

<style lang="scss" scoped>
@keyframes disc-pop {
    0% {
        transform: scale(0) translateY(6px);
        opacity: 0;
    }
    55% {
        transform: scale(1.3) translateY(-3px);
        opacity: 1;
    }
    75% {
        transform: scale(0.9) translateY(0);
    }
    100% {
        transform: scale(1) translateY(0);
    }
}

.disc-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    font-size: 0.7rem;
    border: none;
    padding: 0;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.25);
    cursor: default;
    animation: disc-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition:
        transform 0.1s,
        box-shadow 0.1s;

    &.selectable {
        cursor: pointer;
    }

    &.selected {
        transform: scale(1.15);
        box-shadow:
            inset 0 0 0 2px rgba(0, 0, 0, 0.25),
            0 0 0 2px #ffffff;
    }

    &:disabled {
        cursor: default;
    }
}
</style>
