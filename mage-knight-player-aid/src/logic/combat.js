// Elements
export const ELEMENTS = ['Physical', 'Fire', 'Ice', 'Coldfire']

// Compute effective attack damage against an enemy accounting for resistances
export function effectiveAttack(actions, enemy) {
  return actions.reduce((total, a) => {
    let val = a.value
    if (isResisted(a.element, enemy.resistances)) val = Math.floor(val / 2)
    return total + val
  }, 0)
}

function isResisted(element, resistances = []) {
  if (element === 'Coldfire') {
    // Coldfire is resisted only if the enemy resists BOTH fire and ice
    return resistances.includes('Fire') && resistances.includes('Ice')
  }
  return resistances.includes(element)
}

// Block phase — can the player block the enemy attack?
export function resolveBlock(blockActions, enemy) {
  const required = enemy.attack
  const element = enemy.attackElement

  // Fire / Ice attacks can only be blocked by matching element (or Coldfire covers both)
  const validBlocks = blockActions.filter(b => canBlockElement(b.element, element))
  const total = validBlocks.reduce((s, b) => s + b.value, 0)

  // Swift: cannot combine cards — best single block card must meet full value
  if (enemy.traits.includes('Swift')) {
    const best = validBlocks.reduce((m, b) => Math.max(m, b.value), 0)
    const blocked = best >= required ? required : best
    return buildBlockResult(blocked, required, enemy)
  }

  const blocked = Math.min(total, required)
  return buildBlockResult(blocked, required, enemy)
}

function canBlockElement(blockElement, attackElement) {
  if (attackElement === 'Physical') return true  // any block works
  if (attackElement === 'Coldfire') return blockElement === 'Fire' || blockElement === 'Ice' || blockElement === 'Coldfire'
  if (blockElement === 'Coldfire') return true   // coldfire block covers everything
  return blockElement === attackElement
}

function buildBlockResult(blocked, required, enemy) {
  const unblocked = Math.max(0, required - blocked)
  let wounds = unblocked

  if (unblocked > 0 && enemy.traits.includes('Brutal')) wounds = unblocked * 2
  const poisoned = unblocked > 0 && enemy.traits.includes('Poison')
  const paralyzed = unblocked > 0 && enemy.traits.includes('Paralyze')

  return {
    fullyBlocked: unblocked === 0,
    blocked,
    unblocked,
    wounds,
    poisoned,
    paralyzed,
  }
}

// Ranged phase — does ranged/siege damage kill the enemy before melee?
export function resolveRanged(actions, enemy) {
  const ranged = actions.filter(a => a.type === 'ranged' || a.type === 'siege')

  const effective = ranged.reduce((total, a) => {
    let val = a.value
    // Fortified halves non-siege ranged attacks
    if (enemy.traits.includes('Fortified') && a.type === 'ranged') val = Math.floor(val / 2)
    if (isResisted(a.element, enemy.resistances)) val = Math.floor(val / 2)
    return total + val
  }, 0)

  return {
    damage: effective,
    kills: effective >= enemy.armor,
    needed: enemy.armor,
  }
}

// Melee attack phase — does melee damage kill the enemy?
export function resolveMelee(actions, enemy) {
  const melee = actions.filter(a => a.type === 'attack')
  const damage = effectiveAttack(melee, enemy)
  return { damage, kills: damage >= enemy.armor, needed: enemy.armor }
}
