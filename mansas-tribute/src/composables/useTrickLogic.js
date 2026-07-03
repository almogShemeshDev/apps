export function diceTotal(dice) {
  return dice.reduce((s, d) => s + d.value, 0)
}

export function isLegalPlay(card, hand, leadSuit) {
  if (card.suit === leadSuit) return true
  return !hand.some(c => c.suit === leadSuit)
}

export function determineTrickWinner(trick, leadSuit, trumpSuit) {
  const total = e => diceTotal(e.dice)
  const ord = e => trick.indexOf(e)

  const trumpPlays = trick.filter(e => e.card.suit === trumpSuit)
  const leadPlays = trick.filter(e => e.card.suit === leadSuit)
  const candidates = trumpPlays.length > 0 ? trumpPlays : leadPlays.length > 0 ? leadPlays : trick

  const winner = candidates.reduce((best, e) => {
    const bt = total(best), et = total(e)
    if (et > bt) return e
    if (et === bt && ord(e) < ord(best)) return e
    return best
  })

  const losers = trick
    .filter(e => e !== winner)
    .sort((a, b) => {
      const diff = total(b) - total(a)
      return diff !== 0 ? diff : ord(a) - ord(b)
    })

  return { winner, losers }
}
