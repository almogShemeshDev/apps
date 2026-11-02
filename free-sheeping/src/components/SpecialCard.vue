<template>
    <div class="special-card" :class="{ clickable }" @click="clickable && $emit('click')">
        <div class="icon">{{ def.icon }}</div>
        <div class="name">{{ cardName(def) }}</div>
        <div class="desc">{{ cardDesc(def) }}</div>
        <div class="price">💰 {{ def.price }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { SPECIALS_BY_ID } from '../game/specials.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    defId: { type: String, required: true },
    clickable: { type: Boolean, default: false },
})
defineEmits(['click'])

const { cardName, cardDesc } = useLang()
const def = computed(() => SPECIALS_BY_ID[props.defId])
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

@keyframes card-pop {
    0% {
        transform: scale(0) translateY(10px) rotate(-4deg);
        opacity: 0;
    }
    60% {
        transform: scale(1.08) translateY(-3px) rotate(1deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) translateY(0) rotate(0);
    }
}

.special-card {
    width: 118px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: linear-gradient(160deg, #fff3da, $bg-panel);
    border: 2px solid $gold;
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    animation: card-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 3px 8px rgba(74, 63, 47, 0.1);

    &.clickable {
        cursor: pointer;
        transition: transform 0.1s;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

.icon {
    font-size: 1.8rem;
    line-height: 1;
}

.name {
    font-size: 0.7rem;
    font-weight: 700;
    color: $text;
}

.desc {
    font-size: 0.62rem;
    color: $text-dim;
    line-height: 1.2;
    min-height: 2.4em;
}

.price {
    font-size: 0.72rem;
    font-weight: 700;
    color: $danger;
}
</style>
