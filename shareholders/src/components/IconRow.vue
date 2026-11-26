<template>
    <span class="icon-row">
        <span v-for="i in count" :key="i" class="unit">{{ icon }}</span>
        <span v-if="count === 0" class="zero">–</span>
    </span>
</template>

<script setup>
defineProps({
    icon: { type: String, required: true },
    count: { type: Number, required: true },
})
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.icon-row {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    flex-wrap: wrap;
    line-height: 1;
}

.unit {
    font-size: 1rem;
}

.zero {
    color: $text-dim;
    font-size: 0.85rem;
}
</style>
