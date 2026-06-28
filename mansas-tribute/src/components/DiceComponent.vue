<template>
    <div
        class="die"
        :class="{ selectable, selected, dimmed }"
        @click="selectable && $emit('select')"
    >
        {{ die.value }}
    </div>
</template>

<script setup>
defineProps({
    die: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    dimmed: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.die {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: $text;
    color: $bg-dark;
    font-size: 1.15rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    user-select: none;
    flex-shrink: 0;
    transition:
        transform 0.1s,
        box-shadow 0.1s,
        opacity 0.1s,
        background 0.1s;

    &.selectable {
        cursor: pointer;
        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4);
        }
    }

    &.selected {
        background: $gold;
        border-color: $gold-light;
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba($gold, 0.5);
    }

    &.dimmed {
        opacity: 0.35;
    }
}
</style>
