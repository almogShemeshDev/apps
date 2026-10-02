export function formatUse(use, t) {
  const parts = []
  if (use.gold) parts.push(`${use.gold} ${t('goldLabel')}`)
  for (const d of use.discs) parts.push(`${d.amount} ${t('discName', d.type)}`)
  return parts.join(' + ')
}

function formatEffect(effect, t) {
  switch (effect.type) {
    case 'vp':
      return `+${effect.amount} ${t('vpLabel')}`
    case 'gold':
      return `+${effect.amount} ${t('goldLabel')}`
    case 'negativeVp':
      return t('negativeVpEffect', effect.amount)
    case 'drawDiscs':
      return t('pullDiscsEffect', effect.amount)
    case 'discardDiscs':
      return t('discardDiscsEffect', effect.amount)
    case 'trashDiscs':
      return t('trashDiscsEffect', effect.amount)
    case 'gainDisc':
      return t('gainDiscEffect', effect.amount, effect.disc)
    default:
      return ''
  }
}

export function formatBenefits(benefits, t) {
  return benefits.map((e) => formatEffect(e, t)).join(', ')
}
