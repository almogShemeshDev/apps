<template>
  <div class="enemy-card">
    <div class="enemy-name">{{ enemy.name }}</div>
    <div class="stats">
      <span class="stat"><span class="label">Armor</span> {{ enemy.armor }}</span>
      <span class="stat"><span class="label">Attack</span> {{ enemy.attack }} <em class="element" :class="enemy.attackElement.toLowerCase()">{{ enemy.attackElement }}</em></span>
    </div>
    <div class="tags" v-if="enemy.traits.length || enemy.resistances.length">
      <span class="tag trait" v-for="t in enemy.traits" :key="t">{{ t }}</span>
      <span class="tag resist" v-for="r in enemy.resistances" :key="r">{{ r }} Resist</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ enemy: Object })
</script>

<style scoped>
.enemy-card {
  background: #1a1a2e;
  border: 1px solid #3a3a5c;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.enemy-name { font-size: 1.1rem; font-weight: 700; color: #e8c87a; }
.stats { display: flex; gap: 1.5rem; font-size: 0.95rem; }
.label { color: #888; margin-right: 0.3rem; font-size: 0.8rem; text-transform: uppercase; }
.element { font-style: normal; font-size: 0.8rem; padding: 0.1rem 0.4rem; border-radius: 4px; margin-left: 0.3rem; }
.element.physical { background: #3a3a3a; color: #ccc; }
.element.fire      { background: #5c2200; color: #ff8c42; }
.element.ice       { background: #003d5c; color: #7ecfff; }
.element.coldfire  { background: #3a1a5c; color: #c87aff; }
.element.arcane    { background: #1a3a1a; color: #7aff9e; }
.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tag { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; }
.trait  { background: #3a2200; color: #ffb347; border: 1px solid #7a4400; }
.resist { background: #1a2a3a; color: #7ecfff; border: 1px solid #2a5a7a; }
</style>
