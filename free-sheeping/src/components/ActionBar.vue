<template>
    <div class="action-bar">
        <div v-if="peekedCard" class="flow-box">
            <p class="flow-prompt">{{ t('sneakPeekPrompt') }}</p>
            <div class="peek-row">
                <ProductCard v-if="peekedCard.type === 'product'" :def-id="peekedCard.defId" />
                <SpecialCard v-else :def-id="peekedCard.defId" />
            </div>
            <div class="flow-choices">
                <button class="btn primary" @click="resolveSneakPeek(playerIndex, true)">
                    {{ t('drawRevealedBtn') }}
                </button>
                <button class="btn" @click="resolveSneakPeek(playerIndex, false)">{{ t('leaveOnTopBtn') }}</button>
            </div>
        </div>

        <template v-else-if="flashSaleChoosing">
            <div class="flow-box">
                <p class="flow-prompt">{{ t('flashSaleChoosePrompt') }}</p>
                <div class="pick-row">
                    <button
                        v-for="c in flashSaleEligibleTargets()"
                        :key="c.instanceId"
                        class="pick-chip"
                        :class="{ selected: flashSaleSelection.includes(c.instanceId) }"
                        @click="toggleFlashTarget(c.instanceId)"
                    >
                        {{ productIcon(c.defId) }} {{ cardName(productDef(c.defId)) }}
                    </button>
                </div>
                <div class="flow-choices">
                    <button class="btn primary" @click="confirmFlashSale">{{ t('flashSaleConfirmBtn') }}</button>
                    <button class="btn" @click="cancelFlashSale">{{ t('cancel') }}</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div v-if="canPassEmptyTurn()" class="main-actions">
                <button class="btn primary" @click="passEmptyTurn()">{{ t('stopFailBtn') }}</button>
            </div>

            <div v-else class="main-actions">
                <button class="btn draw" :disabled="!canDraw()" @click="doDraw()">{{ t('drawBtn') }}</button>
                <button class="btn ship" :disabled="!canShip()" @click="doShip()">{{ t('shipBtn') }}</button>
                <button class="btn stop" :disabled="!canStopOrFail()" @click="doFail()">
                    {{ t('stopFailBtn') }}
                </button>
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
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'
import { PRODUCTS_BY_ID } from '../game/products.js'

const props = defineProps({
    playerIndex: { type: Number, required: true },
})

const {
    state,
    peekedCard,
    canDraw,
    doDraw,
    canShip,
    doShip,
    canStopOrFail,
    doFail,
    canPassEmptyTurn,
    passEmptyTurn,
    canUseCoupon,
    useCoupon,
    canUseFreeReturn,
    useFreeReturn,
    canUseTaxInsurance,
    useTaxInsurance,
    canUseFlashSale,
    useFlashSale,
    flashSaleEligibleTargets,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
} = useGameState()
const { t, cardName } = useLang()

const player = computed(() => state.players[props.playerIndex])

const CAN_USE = {
    coupon: canUseCoupon,
    freeReturn: canUseFreeReturn,
    taxInsurance: canUseTaxInsurance,
    flashSale: canUseFlashSale,
    sneakPeek: canUseSneakPeek,
}
const DO_USE = {
    coupon: useCoupon,
    freeReturn: useFreeReturn,
    taxInsurance: useTaxInsurance,
    sneakPeek: useSneakPeek,
}
const KIND_BY_DEF = {
    S01: 'coupon',
    S02: 'freeReturn',
    S03: 'taxInsurance',
    S04: 'flashSale',
    S05: 'sneakPeek',
}
const LABEL_KEY = {
    S01: 'couponBtn',
    S02: 'freeReturnBtn',
    S03: 'taxInsuranceBtn',
    S04: 'flashSaleBtn',
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

function productIcon(defId) {
    return PRODUCTS_BY_ID[defId]?.icon ?? ''
}
function productDef(defId) {
    return PRODUCTS_BY_ID[defId]
}

const flashSaleChoosing = ref(false)
const flashSaleInstanceId = ref(null)
const flashSaleSelection = ref([])

function activate(group) {
    const kind = KIND_BY_DEF[group.defId]
    if (kind === 'flashSale') {
        flashSaleInstanceId.value = group.instanceId
        flashSaleSelection.value = []
        flashSaleChoosing.value = true
        return
    }
    DO_USE[kind](props.playerIndex, group.instanceId)
}

function toggleFlashTarget(instanceId) {
    const idx = flashSaleSelection.value.indexOf(instanceId)
    if (idx !== -1) {
        flashSaleSelection.value.splice(idx, 1)
    } else if (flashSaleSelection.value.length < 2) {
        flashSaleSelection.value.push(instanceId)
    }
}

function confirmFlashSale() {
    useFlashSale(props.playerIndex, flashSaleInstanceId.value, flashSaleSelection.value)
    flashSaleChoosing.value = false
}

function cancelFlashSale() {
    flashSaleChoosing.value = false
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

.btn.ship {
    background: $success;
    color: #fff;
    border-color: transparent;
}

.btn.stop {
    background: $danger;
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

.peek-row {
    display: flex;
    justify-content: center;
}

.pick-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.pick-chip {
    background: $bg-panel;
    border: 1px solid $border;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.78rem;
    cursor: pointer;

    &.selected {
        background: $teal;
        color: $ink;
        border-color: transparent;
    }
}
</style>
