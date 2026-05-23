<template>
  <div class="app">
    <header class="app-header">
      <h1>⚔️ Mage Knight Combat Aid</h1>
      <div class="lang-toggle">
        <button :class="{ active: lang === 'en' }" @click="lang = 'en'">English</button>
        <button :class="{ active: lang === 'he' }" @click="lang = 'he'">עברית</button>
      </div>
    </header>

    <div class="layout">
        <!-- Enemy setup -->
        <section class="section">
          <div class="section-header">
            <h2>{{ t('enemy') }}</h2>
            <button class="reset-btn" @click="resetEnemy">{{ t('reset') }}</button>
          </div>

          <div class="field-row">
            <label>{{ t('armor') }}</label>
            <input v-model.number="enemy.armor" type="number" min="1" max="20" placeholder="0" />
            <label>{{ t('attack') }}</label>
            <input v-model.number="enemy.attack" type="number" min="1" max="20" placeholder="0" />
          </div>

          <div class="chip-group">
            <span class="chip-label">{{ t('element') }}</span>
            <button
              v-for="el in ATTACK_ELEMENTS" :key="el"
              class="chip element-chip"
              :class="[el.toLowerCase(), { active: enemy.attackElement === el }]"
              @click="enemy.attackElement = el"
            >{{ t(el.toLowerCase()) }}</button>
          </div>

          <div class="chip-group">
            <span class="chip-label">{{ t('traits') }}</span>
            <button
              v-for="tr in ALL_TRAITS" :key="tr"
              class="chip trait-chip"
              :class="[tr.toLowerCase(), { active: enemy.traits.includes(tr) }]"
              @click="toggleList(enemy.traits, tr)"
            >{{ t(tr.toLowerCase()) }}</button>
          </div>

          <div class="chip-group">
            <span class="chip-label">{{ t('resistances') }}</span>
            <button
              v-for="r in ALL_RESISTANCES" :key="r"
              class="chip resist-chip"
              :class="[r.toLowerCase(), { active: enemy.resistances.includes(r) }]"
              @click="toggleList(enemy.resistances, r)"
            >{{ t(r.toLowerCase()) }}</button>
          </div>
        </section>

        <!-- Player actions -->
        <section class="section">
          <div class="section-header">
            <h2>{{ t('yourActions') }}</h2>
            <button class="reset-btn" @click="resetActions">{{ t('reset') }}</button>
          </div>

          <div class="chip-group">
            <span class="chip-label">{{ t('type') }}</span>
            <button
              v-for="at in ACTION_TYPES" :key="at.value"
              class="chip action-type-chip"
              :class="{ active: newAction.type === at.value }"
              @click="newAction.type = at.value"
            >{{ t(at.value === 'attack' ? 'melee' : at.value) }}</button>
          </div>

          <div class="chip-group">
            <span class="chip-label">{{ t('element') }}</span>
            <button
              v-for="el in ELEMENTS" :key="el"
              class="chip element-chip"
              :class="[el.toLowerCase(), { active: newAction.element === el }]"
              @click="newAction.element = el"
            >{{ t(el.toLowerCase()) }}</button>
          </div>

          <div class="add-row">
            <span class="chip-label">{{ t('value') }}</span>
            <div class="add-row-inputs">
              <input v-model.number="newAction.value" type="number" min="1" max="20" placeholder="e.g. 4" @keydown.enter="addAction" />
              <button @click="addAction" :disabled="!newAction.value || newAction.value < 1">{{ t('add') }}</button>
            </div>
          </div>

          <div class="action-list" v-if="actions.length">
            <div class="action-item" v-for="(a, i) in actions" :key="i">
              <span class="action-type">{{ t(a.type === 'attack' ? 'melee' : a.type) }}</span>
              <span class="action-val">{{ a.value }}</span>
              <span class="element-tag" :class="a.element.toLowerCase()">{{ t(a.element.toLowerCase()) }}</span>
              <button class="remove-btn" @click="actions.splice(i, 1)">✕</button>
            </div>
          </div>
          <p v-else class="empty-hint">{{ t('addHint') }}</p>
        </section>

        <!-- Combat result -->
        <section class="section result-section">
          <div class="section-header">
            <h2>{{ t('combatResolution') }}</h2>
          </div>
          <CombatResult
            :enemy="enemy"
            :ranged="rangedResult"
            :block="blockResult"
            :melee="meleeResult"
            :hasRanged="hasRanged"
          />
        </section>
    </div>

    <footer class="app-footer">
      Tool created by Almog Shemesh &mdash; All game rights reserved to
      <a href="https://boardgamegeek.com/boardgame/96848/mage-knight-board-game" target="_blank" rel="noopener">Mage Knight Board Game</a>,
      Vlaada Chvátil &amp; J. Lonnee, Chris Raimo, Milan Vavroň
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ELEMENTS, resolveRanged, resolveBlock, resolveMelee } from './logic/combat.js'
import { lang, useI18n } from './i18n.js'
import CombatResult from './components/CombatResult.vue'

const { t } = useI18n()

const ATTACK_ELEMENTS = ['Physical', 'Fire', 'Ice', 'Coldfire']
const ALL_TRAITS      = ['Fortified', 'Swift', 'Brutal', 'Poison', 'Paralyze']
const ALL_RESISTANCES = ['Physical', 'Fire', 'Ice']
const ACTION_TYPES    = [
  { value: 'attack' },
  { value: 'ranged' },
  { value: 'siege'  },
  { value: 'block'  },
]

const enemy = reactive({
  armor: 5,
  attack: 3,
  attackElement: 'Physical',
  traits: [],
  resistances: [],
})

function toggleList(arr, val) {
  const i = arr.indexOf(val)
  i === -1 ? arr.push(val) : arr.splice(i, 1)
}

function resetEnemy() {
  enemy.armor = 5
  enemy.attack = 3
  enemy.attackElement = 'Physical'
  enemy.traits.splice(0)
  enemy.resistances.splice(0)
}

function resetActions() {
  actions.value = []
  newAction.type = 'attack'
  newAction.value = null
  newAction.element = 'Physical'
}

const actions = ref([])
const newAction = reactive({ type: 'attack', value: null, element: 'Physical' })

function addAction() {
  if (!newAction.value || newAction.value < 1) return
  actions.value.push({ type: newAction.type, value: newAction.value, element: newAction.element })
  newAction.value = null
}

const hasRanged    = computed(() => actions.value.some(a => a.type === 'ranged' || a.type === 'siege'))
const rangedResult = computed(() => resolveRanged(actions.value, enemy))
const blockResult  = computed(() => resolveBlock(actions.value.filter(a => a.type === 'block'), enemy))
const meleeResult  = computed(() => resolveMelee(actions.value, enemy))
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d0d1a; color: #e8e8f0; font-family: system-ui, sans-serif; min-height: 100vh; }
</style>

<style scoped>
.app { display: flex; flex-direction: column; min-height: 100vh; }

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #1e1e3a;
  background: #0a0a14;
}
h1 { font-size: 1.4rem; font-weight: 700; color: #e8c87a; }

.lang-toggle { display: flex; gap: 0.25rem; }
.lang-toggle button {
  background: transparent;
  color: #555;
  border: 1px solid #2e2e4a;
  border-radius: 6px;
  padding: 0.25rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.lang-toggle button:hover { color: #aaa; border-color: #5a5a8a; background: transparent; }
.lang-toggle button.active { background: #2a1a5c; color: #c8b4ff; border-color: #7a5adf; }

.layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr 1fr; padding: 1rem; gap: 1rem; }
  .result-section { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .layout { grid-template-columns: 1fr; }
}

.section {
  background: #12121e;
  border: 1px solid #2e2e4a;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.section-header { display: flex; align-items: center; justify-content: space-between; }
h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #666; font-weight: 600; }

.reset-btn {
  background: transparent;
  color: #555;
  border: 1px solid #2e2e4a;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}
.reset-btn:hover { color: #ff7a7a; border-color: #5a2a2a; background: #2e1a1a; }

select, input[type="number"] {
  background: #1a1a2e;
  border: 1px solid #3a3a5c;
  border-radius: 6px;
  color: #e8e8f0;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  outline: none;
  min-width: 0;
}
select:focus, input:focus { border-color: #7a6aff; }

.field-row {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  gap: 0.5rem;
  align-items: center;
}
.field-row label { font-size: 0.82rem; color: #888; white-space: nowrap; }
@media (max-width: 400px) {
  .field-row { grid-template-columns: auto 1fr; grid-template-rows: auto auto; }
}

.chip-group { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
.chip-label { font-size: 0.78rem; color: #666; width: 100%; margin-bottom: 0.1rem; }

.chip {
  border: 1px solid #757575;
  border-radius: 20px;
  padding: 0.25rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #757575;
  transition: all 0.12s;
}
.chip:hover { background: #08080a; }

/* ── Element chips (shared by enemy attack element + hero element) ── */
.element-chip.physical.active{ background: #2a2a2a;  color: #e0e0e0; border-color: #9e9e9e; }

.element-chip.fire.active    { background: #5c1a00;  color: #ff8c42; border-color: #ff5522; }

.element-chip.ice.active     { background: #003d5c;  color: #7ecfff; border-color: #3a9fdf; }

.element-chip.coldfire.active{
  background: linear-gradient(135deg, #5c1a00 50%, #003d5c 50%);
  color: #fff; border-color: transparent;
}


/* ── Resistance chips (same palette as elements) ── */
.resist-chip.physical.active { background: #2a2a2a;  color: #e0e0e0; border-color: #9e9e9e; }

.resist-chip.fire.active     { background: #5c1a00;  color: #ff8c42; border-color: #ff5522; }

.resist-chip.ice.active      { background: #003d5c;  color: #7ecfff; border-color: #3a9fdf; }


/* ── Trait chips ── */
.trait-chip.fortified.active { background: #3a2200;  color: #ffb347; border-color: #ff9800; }

.trait-chip.swift.active     { background: #2a2a2a;  color: #e0e0e0; border-color: #bdbdbd; }

.trait-chip.brutal.active    { background: #5c1500;  color: #ff7043; border-color: #ff5722; }

.trait-chip.poison.active    { background: #1a3a1a;  color: #81c784; border-color: #66bb6a; }

.trait-chip.paralyze.active  { background: #003a5c;  color: #81d4fa; border-color: #4fc3f7; }

/* ── Action type chips ── */
.action-type-chip.active     { background: #2a1a5c;  color: #c8b4ff; border-color: #7a5adf; }

.add-row { display: flex; flex-direction: column; gap: 0.4rem; }
.add-row-inputs { display: flex; gap: 0.5rem; align-items: center; }
.add-row input { width: 90px; flex-shrink: 0; }

button {
  background: #4a3aff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
button:hover:not(:disabled) { background: #080808; }
button:disabled { opacity: 0.4; cursor: not-allowed; }

.action-list { display: flex; flex-direction: column; gap: 0.35rem; }
.action-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a2e;
  border: 1px solid #2e2e4a;
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  font-size: 0.88rem;
}
.action-type { color: #888; text-transform: capitalize; width: 60px; flex-shrink: 0; }
.action-val  { font-weight: 700; width: 20px; }

.element-tag { font-size: 0.72rem; padding: 0.1rem 0.4rem; border-radius: 4px; flex: 1; }
.element-tag.physical { background: #2a2a2a;  color: #e0e0e0; }
.element-tag.fire     { background: #5c1a00;  color: #ff8c42; }
.element-tag.ice      { background: #003d5c;  color: #7ecfff; }
.element-tag.coldfire { background: linear-gradient(135deg, #5c1a00 50%, #003d5c 50%); color: #fff; }

.remove-btn {
  background: transparent;
  color: #555;
  padding: 0.1rem 0.3rem;
  font-size: 0.72rem;
  margin-inline-start: auto;
}
.remove-btn:hover { color: #ff7a7a; background: transparent; }

.empty-hint { font-size: 0.84rem; color: #555; font-style: italic; }

.app-footer {
  margin-top: auto;
  padding: 1rem 1.5rem;
  border-top: 1px solid #1e1e3a;
  font-size: 0.75rem;
  color: #444;
  text-align: center;
}
.app-footer a { color: #555; text-decoration: underline; }
.app-footer a:hover { color: #888; }
</style>
