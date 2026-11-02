<template>
    <div class="action-bar">
        <div v-if="peekedCardObjs.length" class="flow-box">
            <p class="flow-prompt">{{ t('sneakPeekPrompt') }}</p>
            <div class="peek-row">
                <template v-for="c in peekedCardObjs" :key="c.instanceId">
                    <ProductCard v-if="c.type === 'product'" :def-id="c.defId" />
                    <ProblemCard v-else-if="c.type === 'problem'" :def-id="c.defId" />
                    <SpecialCard v-else :def-id="c.defId" />
                </template>
            </div>
            <div class="flow-choices">
                <button class="btn primary" @click="resolveSneakPeek(playerIndex, false)">
                    {{ t('keepOrderBtn') }}
                </button>
                <button class="btn" @click="resolveSneakPeek(playerIndex, true)">{{ t('swapOrderBtn') }}</button>
            </div>
        </div>

        <template v-else-if="keeping">
            <div class="flow-box">
                <p class="flow-prompt">{{ t('keepSelectionPrompt', stopKeepCount) }}</p>
                <div class="cards-pick-row">
                    <ProductCard
                        v-for="c in productCardsInOrder"
                        :key="c.instanceId"
                        :def-id="c.defId"
                        clickable
                        :class="{ selected: keepSelection.includes(c.instanceId) }"
                        @click="toggleKeep(c.instanceId)"
                    />
                </div>
                <div class="flow-choices">
                    <button
                        class="btn primary"
                        :disabled="keepSelection.length !== stopKeepCount"
                        @click="confirmStop"
                    >
                        {{ t('keepSelectionConfirmBtn') }}
                    </button>
                    <button class="btn" @click="cancelKeeping">{{ t('cancel') }}</button>
                </div>
            </div>
        </template>

        <template v-else-if="returning">
            <div class="flow-box">
                <p class="flow-prompt">{{ t('freeReturnChoosePrompt') }}</p>
                <div class="cards-pick-row">
                    <ProductCard
                        v-for="c in productCardsInOrder"
                        :key="c.instanceId"
                        :def-id="c.defId"
                        clickable
                        @click="confirmFreeReturn(c.instanceId)"
                    />
                </div>
                <div class="flow-choices">
                    <button class="btn" @click="cancelReturning">{{ t('cancel') }}</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div v-if="canPassEmptyTurn()" class="main-actions">
                <button class="btn primary" @click="passEmptyTurn()">{{ t('passBtn') }}</button>
            </div>

            <div v-else class="main-actions">
                <button class="btn draw" :disabled="!canDraw()" @click="doDraw()">{{ t('drawBtn') }}</button>
                <button class="btn stop" :disabled="!canStop()" @click="onStopClick">{{ t('stopBtn') }}</button>
            </div>

            <div v-if="groupedSpecials.length" class="specials-row">
                <span class="specials-label">{{ t('inventoryLabel') }}</span>
                <div class="special-buttons">
                    <button
                        v-for="g in groupedSpecials"
                        :key="g.defId"
                        class="btn special-btn"
                        :disabled="!g.usable"
                        @click="activate(g)"
                    >
                        {{ specialLabel(g.defId) }}<span v-if="g.count > 1" class="count">×{{ g.count }}</span>
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'
import SpecialCard from './SpecialCard.vue'
import ProblemCard from './ProblemCard.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    playerIndex: { type: Number, required: true },
})

const {
    state,
    peekedCards,
    productCardsInOrder,
    stopKeepCount,
    needsKeepSelection,
    canDraw,
    doDraw,
    canStop,
    doStop,
    canPassEmptyTurn,
    passEmptyTurn,
    canUseCoupon,
    useCoupon,
    canUseFreeReturn,
    useFreeReturn,
    canUseShippingInsurance,
    useShippingInsurance,
    canUseExtraPick,
    useExtraPick,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
} = useGameState()
const { t } = useLang()

const player = computed(() => state.players[props.playerIndex])

const peekedCardObjs = computed(() =>
    (peekedCards.value ?? []).map((id) => state.deck.find((c) => c.instanceId === id)).filter(Boolean)
)

const CAN_USE = {
    coupon: canUseCoupon,
    freeReturn: canUseFreeReturn,
    shippingInsurance: canUseShippingInsurance,
    extraPick: canUseExtraPick,
    sneakPeek: canUseSneakPeek,
}
const DO_USE = {
    coupon: useCoupon,
    shippingInsurance: useShippingInsurance,
    extraPick: useExtraPick,
}
const KIND_BY_DEF = {
    S01: 'coupon',
    S02: 'freeReturn',
    S03: 'shippingInsurance',
    S04: 'extraPick',
    S05: 'sneakPeek',
}
const LABEL_KEY = {
    S01: 'couponBtn',
    S02: 'freeReturnBtn',
    S03: 'shippingInsuranceBtn',
    S04: 'extraPickBtn',
    S05: 'sneakPeekBtn',
}

function specialLabel(defId) {
    return t(LABEL_KEY[defId])
}

const groupedSpecials = computed(() => {
    const counts = {}
    for (const entry of player.value.specialInventory) {
        counts[entry.defId] = counts[entry.defId] ?? { defId: entry.defId, count: 0, instanceId: entry.instanceId }
        counts[entry.defId].count++
    }
    return Object.values(counts).map((g) => {
        const kind = KIND_BY_DEF[g.defId]
        const usable = CAN_USE[kind](props.playerIndex, g.instanceId)
        return { ...g, usable }
    })
})

function activate(group) {
    const kind = KIND_BY_DEF[group.defId]
    if (kind === 'freeReturn') {
        freeReturnInstanceId.value = group.instanceId
        returning.value = true
        return
    }
    if (kind === 'sneakPeek') {
        useSneakPeek(props.playerIndex, group.instanceId)
        return
    }
    DO_USE[kind](props.playerIndex, group.instanceId)
}

// --- Stop / keep-selection flow ---

const keeping = ref(false)
const keepSelection = ref([])

function onStopClick() {
    if (needsKeepSelection.value) {
        keepSelection.value = []
        keeping.value = true
    } else {
        doStop()
    }
}

function toggleKeep(instanceId) {
    const idx = keepSelection.value.indexOf(instanceId)
    if (idx !== -1) {
        keepSelection.value.splice(idx, 1)
    } else if (keepSelection.value.length < stopKeepCount.value) {
        keepSelection.value.push(instanceId)
    }
}

function confirmStop() {
    doStop(keepSelection.value)
    keeping.value = false
}

function cancelKeeping() {
    keeping.value = false
}

// --- Free Return flow ---

const returning = ref(false)
const freeReturnInstanceId = ref(null)

function confirmFreeReturn(targetInstanceId) {
    useFreeReturn(props.playerIndex, freeReturnInstanceId.value, targetInstanceId)
    returning.value = false
}

function cancelReturning() {
    returning.value = false
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.action-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: $surface;
    border: 1px solid $border;
    border-radius: 14px;
    padding: 14px;
}

.main-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn {
    background: $bg-panel;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: $surface;
    }

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
}

.btn.draw {
    background: $teal;
    color: $ink;
    border-color: transparent;
}

.btn.stop {
    background: $success;
    color: #fff;
    border-color: transparent;
}

.btn.primary {
    background: $gold;
    color: $ink;
    border-color: transparent;
}

.specials-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.specials-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $text-dim;
}

.special-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.special-btn {
    font-size: 0.74rem;
    display: inline-flex;
    gap: 4px;
    align-items: center;
}

.count {
    color: $gold;
}

.flow-box {
    background: rgba(232, 162, 61, 0.1);
    border: 1px solid $gold;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.flow-prompt {
    font-size: 0.82rem;
    font-weight: 700;
    color: $ink;
}

.flow-choices {
    display: flex;
    gap: 8px;
}

.peek-row,
.cards-pick-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

:deep(.product-card.selected) {
    border-color: $gold;
    box-shadow: 0 0 0 2px rgba(232, 162, 61, 0.4);
}
</style>
