<template>
    <div class="prob-panel">
        <button class="toggle" @click="open = !open">{{ t('probToggle') }} {{ open ? '▲' : '▼' }}</button>
        <div v-if="open" class="body">
            <div class="row"><span>{{ t('probNextProduct') }}</span><strong>{{ pct(probNextIsProduct(state.deck)) }}</strong></div>
            <div class="row"><span>{{ t('probNextSpecial') }}</span><strong>{{ pct(probNextIsSpecial(state.deck)) }}</strong></div>
            <div class="row"><span>{{ t('probOverflow') }}</span><strong>{{ pct(overflow) }}</strong></div>
            <div class="row"><span>{{ t('probWithin') }}</span><strong>{{ pct(within) }}</strong></div>
            <div class="row"><span>{{ t('probBelowMin') }}</span><strong>{{ pct(belowMin) }}</strong></div>
            <div class="row"><span>{{ t('probExpectedVp') }}</span><strong>{{ expectedNextVp(state.deck).toFixed(2) }}</strong></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import {
    probNextIsProduct,
    probNextIsSpecial,
    probOverflow,
    probWithinWindow,
    probBelowMin,
    expectedNextVp,
} from '../game/probability.js'

const { state, effectiveTotal, minLimit, maxLimit } = useGameState()
const { t } = useLang()

const open = ref(false)

const overflow = computed(() => probOverflow(state.deck, effectiveTotal.value, maxLimit.value))
const within = computed(() => probWithinWindow(state.deck, effectiveTotal.value, minLimit.value, maxLimit.value))
const belowMin = computed(() => probBelowMin(state.deck, effectiveTotal.value, minLimit.value))

function pct(v) {
    return `${Math.round(v * 100)}%`
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.prob-panel {
    width: 100%;
}

.toggle {
    width: 100%;
    background: $surface;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.75rem;
    font-weight: 700;
    color: $text-dim;
    cursor: pointer;
}

.body {
    margin-top: 6px;
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.row {
    display: flex;
    justify-content: space-between;
    font-size: 0.76rem;
    color: $text;

    strong {
        color: $gold;
    }
}
</style>
