<template>
    <div class="train-pool">
        <span class="pool-label">{{ t('trainPoolLabel') }}</span>
        <div class="pool-rows">
            <div
                v-for="id in COMPANY_IDS"
                :key="id"
                class="pool-row"
                :class="{ lowest: lowestIds.includes(id) }"
                :title="t('companyName', id)"
            >
                <span class="company-icon">{{ COMPANIES[id].icon }}</span>
                <IconRow :icon="TRAIN_ICON" :count="pool[id]" />
                <span v-if="lowestIds.includes(id)" class="lowest-tag">{{ t('lowestLabel') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconRow from './IconRow.vue'
import { COMPANIES, COMPANY_IDS, TRAIN_ICON, computeLowestCompanies } from '../constants.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    pool: { type: Object, required: true },
})

const { t } = useLang()
const lowestIds = computed(() => computeLowestCompanies(props.pool))
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.train-pool {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pool-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.pool-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.pool-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 8px 12px;
    min-height: 34px;
    transition:
        opacity 0.15s,
        border-color 0.15s;

    &.lowest {
        opacity: 0.6;
        border-style: dashed;
        border-color: $danger;
    }
}

.company-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
}

.lowest-tag {
    margin-inline-start: auto;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: $danger;
    flex-shrink: 0;
}
</style>
