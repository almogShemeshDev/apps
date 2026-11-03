<template>
    <div v-if="count > 0" class="penalty-cards" role="img" :aria-label="ariaLabel">
        <span v-for="n in count" :key="n" class="penalty-card" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    count: { type: Number, required: true },
})

const ariaLabel = computed(() => `${props.count} penalty card${props.count === 1 ? '' : 's'} (-${props.count} VP)`)
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.penalty-cards {
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
}

.penalty-card {
    width: 13px;
    height: 19px;
    border-radius: 3px;
    background: linear-gradient(135deg, $danger, $ink);
    border: 1px solid $ink;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
}
</style>
