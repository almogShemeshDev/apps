<template>
    <div class="ability-panel">
        <div class="hand-row">
            <span class="hand-label">{{ t('handLabel') }} · {{ t('cardsLeftLabel', player.hand.length) }}</span>
            <div class="hand-chips">
                <span
                    v-for="c in handCounts(player.hand)"
                    :key="c.color"
                    class="chip"
                    :style="{ background: COLOR_META[c.color].hex }"
                >
                    {{ COLOR_META[c.color].icon }} {{ c.count }}
                </span>
                <span v-if="!player.hand.length" class="none">—</span>
            </div>
        </div>

        <div v-if="pendingBlue" class="flow-box">
            <p class="flow-prompt">{{ t('blueReturnPrompt') }}</p>
            <div class="flow-choices">
                <button
                    v-for="c in blueReturnCandidates(playerIndex)"
                    :key="c"
                    class="choice-chip"
                    :style="{ background: COLOR_META[c].hex }"
                    @click="resolveBlueReturn(playerIndex, c)"
                >
                    {{ COLOR_META[c].icon }}
                </button>
            </div>
        </div>

        <template v-else>
            <div v-if="hasAnyAbility" class="abilities-label">{{ t('abilitiesLabel') }}</div>
            <div class="ability-buttons">
                <button
                    v-for="color in trashableColors"
                    :key="'t3-' + color"
                    class="ability-btn"
                    @click="trashThree(playerIndex, color)"
                >
                    {{ t('trashThreeBtn', color) }}
                </button>

                <button
                    v-for="color in trashFourColors"
                    :key="'t4-' + color"
                    class="ability-btn"
                    @click="trashFour(playerIndex, color)"
                >
                    {{ t('trashFourBtn', color) }}
                </button>

                <button v-if="canUseBlueAbility(playerIndex)" class="ability-btn" @click="useBlueAbilityDraw(playerIndex)">
                    {{ t('blueAbilityBtn') }}
                </button>
                <button
                    v-if="canUseBlueAbility(playerIndex, true)"
                    class="ability-btn ability-btn-flip"
                    @click="useBlueAbilityDraw(playerIndex, true)"
                >
                    {{ t('blueAbilityFlipBtn') }}
                </button>

                <button
                    v-if="canUseRedAbility(playerIndex) && !redMode"
                    class="ability-btn"
                    @click="redMode = 'normal'"
                >
                    {{ t('redAbilityBtn') }}
                </button>
                <button
                    v-if="canUseRedAbility(playerIndex, true) && !redMode"
                    class="ability-btn ability-btn-flip"
                    @click="redMode = 'flip'"
                >
                    {{ t('redAbilityFlipBtn') }}
                </button>

                <button
                    v-if="canUseYellowAbility(playerIndex) && !yellowMode"
                    class="ability-btn"
                    @click="onYellowClick(false)"
                >
                    {{ t('yellowAbilityBtn') }}
                </button>
                <button
                    v-if="canUseYellowAbility(playerIndex, true) && !yellowMode"
                    class="ability-btn ability-btn-flip"
                    @click="onYellowClick(true)"
                >
                    {{ t('yellowAbilityFlipBtn') }}
                </button>

                <button v-if="canUseGreenAbility(playerIndex)" class="ability-btn" @click="$emit('green-start', 'normal')">
                    {{ t('greenAbilityBtn') }}
                </button>
                <button
                    v-if="canUseGreenAbility(playerIndex, true)"
                    class="ability-btn ability-btn-flip"
                    @click="$emit('green-start', 'flip')"
                >
                    {{ t('greenAbilityFlipBtn') }}
                </button>

                <button
                    v-if="canUseWhiteConversion(playerIndex) && !whiteStage"
                    class="ability-btn ability-btn-flip"
                    @click="whiteStage = 'pick-color'"
                >
                    {{ t('whiteConvertBtn') }}
                </button>
            </div>

            <div v-if="redMode" class="flow-box">
                <p class="flow-prompt">{{ t('redChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in redAbilityTargets(playerIndex, redMode === 'flip')"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onRedChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="redMode = null">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="yellowMode" class="flow-box">
                <p class="flow-prompt">{{ t('yellowChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in yellowTargetCandidates(playerIndex, yellowMode === 'flip')"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onYellowChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="yellowMode = null">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="whiteStage === 'pick-color'" class="flow-box">
                <p class="flow-prompt">{{ t('whiteConvertChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in whiteConversionOptions(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onWhiteConvertColor(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="whiteStage = null">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="whiteStage === 'yellow-sub'" class="flow-box">
                <p class="flow-prompt">{{ t('yellowChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in whiteConversionYellowTargets(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onWhiteYellowChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="whiteStage = null">{{ t('cancel') }}</button>
                </div>
            </div>

            <div v-if="whiteStage === 'red-sub'" class="flow-box">
                <p class="flow-prompt">{{ t('redChoosePrompt') }}</p>
                <div class="flow-choices">
                    <button
                        v-for="c in whiteConversionRedTargets(playerIndex)"
                        :key="c"
                        class="choice-chip"
                        :style="{ background: COLOR_META[c].hex }"
                        @click="onWhiteRedChoose(c)"
                    >
                        {{ COLOR_META[c].icon }}
                    </button>
                    <button class="choice-cancel" @click="whiteStage = null">{{ t('cancel') }}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { COLORS, COLOR_META, handCounts } from '../constants.js'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const props = defineProps({
    playerIndex: { type: Number, required: true },
})
const emit = defineEmits(['green-start'])

const {
    state,
    canTrashThree,
    trashThree,
    canTrashFour,
    trashFour,
    canUseBlueAbility,
    useBlueAbilityDraw,
    blueReturnCandidates,
    resolveBlueReturn,
    canUseRedAbility,
    redAbilityTargets,
    useRedAbility,
    canUseYellowAbility,
    yellowTargetCandidates,
    useYellowAbility,
    canUseGreenAbility,
    whiteConversionOutcome,
    whiteConversionOptions,
    canUseWhiteConversion,
    useWhiteConversionTrash,
    useWhiteConversionBlue,
    whiteConversionYellowTargets,
    useWhiteConversionYellow,
    whiteConversionRedTargets,
    useWhiteConversionRed,
} = useGameState()
const { t } = useLang()

const player = computed(() => state.players[props.playerIndex])
const pendingBlue = computed(
    () => state.pendingBlueReturn && state.pendingBlueReturn.playerIndex === props.playerIndex
)
const trashableColors = computed(() => COLORS.filter((c) => canTrashThree(props.playerIndex, c)))
const trashFourColors = computed(() => COLORS.filter((c) => canTrashFour(props.playerIndex, c)))
const hasAnyAbility = computed(
    () =>
        trashableColors.value.length > 0 ||
        trashFourColors.value.length > 0 ||
        canUseBlueAbility(props.playerIndex) ||
        canUseBlueAbility(props.playerIndex, true) ||
        canUseRedAbility(props.playerIndex) ||
        canUseRedAbility(props.playerIndex, true) ||
        canUseYellowAbility(props.playerIndex) ||
        canUseYellowAbility(props.playerIndex, true) ||
        canUseGreenAbility(props.playerIndex) ||
        canUseGreenAbility(props.playerIndex, true) ||
        canUseWhiteConversion(props.playerIndex)
)

// null | 'normal' | 'flip'
const redMode = ref(null)
const yellowMode = ref(null)
// null | 'pick-color' | 'yellow-sub' | 'red-sub'
const whiteStage = ref(null)

function onRedChoose(color) {
    useRedAbility(props.playerIndex, color, redMode.value === 'flip')
    redMode.value = null
}

function onYellowClick(flip) {
    const candidates = yellowTargetCandidates(props.playerIndex, flip)
    if (candidates.length === 1) {
        useYellowAbility(props.playerIndex, candidates[0], flip)
    } else {
        yellowMode.value = flip ? 'flip' : 'normal'
    }
}

function onYellowChoose(color) {
    useYellowAbility(props.playerIndex, color, yellowMode.value === 'flip')
    yellowMode.value = null
}

function onWhiteConvertColor(color) {
    const outcome = whiteConversionOutcome(props.playerIndex, color)
    if (outcome === 'trash') {
        useWhiteConversionTrash(props.playerIndex, color)
        whiteStage.value = null
        return
    }
    if (color === 'blue') {
        useWhiteConversionBlue(props.playerIndex)
        whiteStage.value = null
        return
    }
    if (color === 'yellow') {
        const targets = whiteConversionYellowTargets(props.playerIndex)
        if (targets.length === 1) {
            useWhiteConversionYellow(props.playerIndex, targets[0])
            whiteStage.value = null
        } else {
            whiteStage.value = 'yellow-sub'
        }
        return
    }
    if (color === 'red') {
        const targets = whiteConversionRedTargets(props.playerIndex)
        if (targets.length === 1) {
            useWhiteConversionRed(props.playerIndex, targets[0])
            whiteStage.value = null
        } else {
            whiteStage.value = 'red-sub'
        }
        return
    }
    if (color === 'green') {
        whiteStage.value = null
        emit('green-start', 'white')
    }
}

function onWhiteYellowChoose(color) {
    useWhiteConversionYellow(props.playerIndex, color)
    whiteStage.value = null
}

function onWhiteRedChoose(color) {
    useWhiteConversionRed(props.playerIndex, color)
    whiteStage.value = null
}
</script>

<style lang="scss" scoped>
@use '../styles/colors' as *;

.ability-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border;
    border-radius: 12px;
    padding: 12px;
}

.hand-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
    display: block;
    margin-bottom: 6px;
}

.hand-chips,
.flow-choices,
.ability-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 0.78rem;
    font-weight: 700;
    color: $bg-dark;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

.none {
    color: $text-dim;
    font-size: 0.8rem;
}

.abilities-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $text-dim;
}

.ability-btn {
    background: $bg-dark;
    color: $text;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}

.ability-btn-flip {
    border-color: $gold;
    color: $gold;

    &:hover {
        background: rgba(178, 101, 255, 0.12);
    }
}

.flow-box {
    background: rgba(178, 101, 255, 0.1);
    border: 1px solid $gold;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.flow-prompt {
    font-size: 0.8rem;
    color: $gold;
    font-weight: 700;
}

.choice-chip {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s;

    &:hover {
        transform: scale(1.1);
    }
}

.choice-cancel {
    background: transparent;
    color: $text-dim;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 0.78rem;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}
</style>
