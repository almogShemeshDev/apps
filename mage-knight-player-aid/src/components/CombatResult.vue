<template>
  <div class="result">
    <!-- Ranged phase -->
    <div class="phase">
      <div class="phase-header">
        <span class="phase-num">1</span>
        <span class="phase-title">{{ t('rangedPhase') }}</span>
        <span class="badge" :class="ranged.kills ? 'success' : 'neutral'">
          {{ ranged.kills ? t('kills') : `${ranged.damage} / ${ranged.needed}` }}
        </span>
      </div>
      <p v-if="!hasRanged" class="hint">{{ t('noRangedActions') }}</p>
      <p v-else-if="ranged.kills" class="hint success">{{ t('enemyKilledRanged') }}</p>
      <p v-else class="hint">{{ t('continueToBlock', ranged.needed) }}</p>
      <p v-if="enemy.traits.includes('Fortified') && hasRanged" class="hint warn">{{ t('fortifiedWarn') }}</p>
    </div>

    <!-- Block phase -->
    <div class="phase" v-if="!ranged.kills">
      <div class="phase-header">
        <span class="phase-num">2</span>
        <span class="phase-title">{{ t('blockPhase') }}</span>
        <span class="badge" :class="block.fullyBlocked ? 'success' : block.wounds === 0 ? 'neutral' : 'danger'">
          {{ block.fullyBlocked ? t('fullyBlocked') : t('woundCount', block.wounds) }}
        </span>
      </div>
      <p class="hint">
        {{ t('enemyAttacksFor') }}
        <strong> {{ enemy.attack }}</strong>
        <em class="element-inline" :class="enemy.attackElement.toLowerCase()">{{ t(enemy.attackElement.toLowerCase()) }}</em>.
        <span v-if="needsTypedBlock"> {{ t('mustUseBlock', t(enemy.attackElement.toLowerCase())) }}</span>
        <span v-if="enemy.traits.includes('Swift')"> {{ t('swiftWarn') }}</span>
      </p>
      <p v-if="!block.fullyBlocked" class="hint warn">
        {{ t('unblockedWarn', block.unblocked, enemy.traits.includes('Brutal'), block.wounds, block.poisoned, block.paralyzed) }}
      </p>
    </div>

    <!-- Melee phase -->
    <div class="phase" v-if="!ranged.kills">
      <div class="phase-header">
        <span class="phase-num">3</span>
        <span class="phase-title">{{ t('meleePhase') }}</span>
        <span class="badge" :class="melee.kills ? 'success' : 'danger'">
          {{ melee.kills ? t('kills') : `${melee.damage} / ${melee.needed}` }}
        </span>
      </div>
      <p v-if="melee.kills" class="hint success">{{ t('enoughDamage') }}</p>
      <p v-else class="hint">
        {{ t('dealingOf', melee.damage, melee.needed) }}
        <span v-if="enemy.resistances.length">{{ t('resistancesHalve', enemy.resistances.map(r => t(r.toLowerCase()))) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n.js'

const { t } = useI18n()
const props = defineProps({ ranged: Object, block: Object, melee: Object, enemy: Object, hasRanged: Boolean })

const needsTypedBlock = computed(() =>
  ['Fire', 'Ice', 'Coldfire'].includes(props.enemy.attackElement)
)
</script>

<style scoped>
.result { display: flex; flex-direction: column; gap: 1rem; }
.phase { background: #12121e; border: 1px solid #2e2e4a; border-radius: 10px; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.phase-header { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.phase-num { width: 1.6rem; height: 1.6rem; border-radius: 50%; background: #2e2e4a; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
.phase-title { font-weight: 600; font-size: 0.95rem; flex: 1; min-width: 120px; }
.badge { font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 20px; white-space: nowrap; }
.badge.success { background: #1a3a1a; color: #7aff9e; border: 1px solid #2a6a2a; }
.badge.neutral { background: #2e2e2e; color: #aaa;    border: 1px solid #444; }
.badge.danger  { background: #3a1a1a; color: #ff7a7a; border: 1px solid #6a2a2a; }
.hint { font-size: 0.88rem; color: #aaa; margin: 0; line-height: 1.5; }
.hint.success { color: #7aff9e; }
.hint.warn    { color: #ffb347; }
.element-inline { font-style: normal; font-size: 0.78rem; padding: 0.1rem 0.35rem; border-radius: 4px; margin: 0 0.2rem; }
.element-inline.physical { background: #3a3a3a; color: #ccc; }
.element-inline.fire     { background: #5c2200; color: #ff8c42; }
.element-inline.ice      { background: #003d5c; color: #7ecfff; }
.element-inline.coldfire { background: #3a1a5c; color: #c87aff; }

@media (max-width: 480px) {
  .phase { padding: 0.85rem 1rem; }
  .phase-title { font-size: 0.88rem; }
  .hint { font-size: 0.82rem; }
}
</style>
