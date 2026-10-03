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
    case 'negativeVp':
      return { icon: '📉', count: effect.amount, title: t('negativeVpLabel') }
    case 'drawDiscs':
      return { icon: '📥', count: effect.amount, title: t('pullDiscsEffect', effect.amount) }
    case 'discardDiscs':
      return { icon: '🗑️', count: effect.amount, title: t('discardDiscsEffect', effect.amount) }
    case 'trashDiscs':
      return { icon: '❌', count: effect.amount, title: t('trashDiscsEffect', effect.amount) }
    case 'gainDisc':
      return {
        icon: `➕${DISC_TYPES[effect.disc].icon}`,
        count: effect.amount,
        title: t('gainDiscEffect', effect.amount, effect.disc),
      }
    case 'convertNegativeVp':
      return {
        icon: '📉➡️🏆',
        count: effect.amount,
        title: t('convertNegativeVpEffect', effect.amount),
        caption: t('convertNegativeVpEffect', effect.amount),
      }
    case 'removeNegativeVp':
      return {
        icon: '📉❌',
        count: effect.amount,
        title: t('removeNegativeVpEffect', effect.amount),
        caption: t('removeNegativeVpEffect', effect.amount),
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
