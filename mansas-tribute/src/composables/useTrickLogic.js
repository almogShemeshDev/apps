export function diceTotal(dice) {
  return dice.reduce((s, d) => s + d.value, 0)
}

export function isLegalPlay(card, hand, leadSuit, trumpSuit) {
  if (!leadSuit) {
    // Lead player: trump is only legal if no other color in hand
    if (card.suit === trumpSuit) return !hand.some(c => c.suit !== trumpSuit)
    return true
  }
  if (card.suit === leadSuit) return true
  return !hand.some(c => c.suit === leadSuit)
}

export function determineTrickWinner(trick, leadSuit, trumpSuit) {
  const total = e => diceTotal(e.dice)
  const ord = e => trick.indexOf(e)

  // Trump = played trump suit when it differs from lead suit
  const trumps = trick.filter(e => e.card.suit === trumpSuit && e.card.suit !== leadSuit)
  const candidates = trumps.length > 0
    ? trumps
    : trick.filter(e => e.card.suit === leadSuit)

  const winner = candidates.reduce((best, e) => {
    const bt = total(best), et = total(e)
    if (et > bt) return e
    if (et === bt && ord(e) < ord(best)) return e  // earlier play wins tie
    return best
  })

  // Losers ranked by dice total desc; earlier play wins ties (picks first)
  const losers = trick
    .filter(e => e !== winner)
    .sort((a, b) => {
      const diff = total(b) - total(a)
      return diff !== 0 ? diff : ord(a) - ord(b)
    })

  return { winner, losers }
}
