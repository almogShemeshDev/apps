<template>
    <div class="problem-card">
        <div class="icon">{{ def.icon }}</div>
        <div class="name">{{ cardName(def) }}</div>
        <div class="points">⚠️ +{{ def.points }} {{ t('pointsLabel') }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { PROBLEMS_BY_ID } from '../game/problems.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    defId: { type: String, required: true },
})

const { t, cardName } = useLang()
const def = computed(() => PROBLEMS_BY_ID[props.defId])
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

.problem-card {
    width: 118px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: linear-gradient(160deg, rgba(217, 83, 79, 0.12), $bg-panel);
    border: 2px solid $danger;
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    animation: card-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 3px 8px rgba(74, 63, 47, 0.1);
}

.icon {
    font-size: 1.8rem;
    line-height: 1;
}

.name {
    font-size: 0.68rem;
    font-weight: 700;
    color: $text;
    min-height: 2.2em;
    line-height: 1.1;
}

.points {
    font-size: 0.72rem;
    font-weight: 700;
    color: $danger;
}
</style>
