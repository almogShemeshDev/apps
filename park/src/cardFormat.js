import { DISC_TYPES } from './constants.js'

export function useChips(use, t) {
  const chips = []
  if (use.gold) chips.push({ icon: '💰', count: use.gold, title: t('goldLabel') })
  for (const d of use.discs) {
    chips.push({ icon: DISC_TYPES[d.type].icon, count: d.amount, title: t('discName', d.type) })
  }
  return chips
}

export function benefitChips(benefits, t) {
  return benefits.map((effect) => benefitChip(effect, t))
}

function benefitChip(effect, t) {
  switch (effect.type) {
    case 'vp':
      return { icon: '🏆', count: effect.amount, title: t('vpLabel') }
    case 'gold':
      return { icon: '💰', count: effect.amount, title: t('goldLabel') }
    case 'drawDiscs':
      return { icon: '📥', count: effect.amount, title: t('pullDiscsEffect', effect.amount) }
    case 'discardDiscs':
      return { icon: '🗑️', count: effect.amount, title: t('discardDiscsEffect', effect.amount) }
    case 'trashDiscs':
      if (effect.filter) {
        return {
          icon: `❌${DISC_TYPES[effect.filter].icon}`,
          count: effect.amount,
          title: t('trashDiscsFilteredEffect', effect.amount, effect.filter),
          caption: t('trashDiscsFilteredEffect', effect.amount, effect.filter),
        }
      }
      return { icon: '❌', count: effect.amount, title: t('trashDiscsEffect', effect.amount) }
    case 'gainDisc':
      return {
        icon: `➕${DISC_TYPES[effect.disc].icon}`,
        count: effect.amount,
        title: t('gainDiscEffect', effect.amount, effect.disc),
      }
    default:
      return { icon: '', count: effect.amount, title: '' }
  }
}

export function captionsFor(benefits, t) {
  return benefitChips(benefits, t)
    .map((c) => c.caption)
    .filter(Boolean)
}
