import { describe, it, expect, beforeEach } from 'vitest'
import { useGameState } from './useGameState.js'
import { buildDeck } from '../game/deck.js'
import { endgameScore } from '../game/scoring.js'

function product(id) {
  return { instanceId: id, defId: id, type: 'product' }
}
function special(id, i = 1) {
  return { instanceId: `${id}-${i}`, defId: id, type: 'special' }
}
function problem(id) {
  return { instanceId: id, defId: id, type: 'problem' }
}

// useGameState() is a module-singleton: every call returns the same reactive
// state, so each test resets it via startGame() rather than re-importing.
const gs = useGameState()

beforeEach(() => {
  gs.startGame([
    { name: 'Alice', isBot: false },
    { name: 'Bob', isBot: false },
  ])
})

describe('deck composition', () => {
  it('has 70 cards: 45 products + 15 bonus (3x5) + 10 problems', () => {
    const deck = buildDeck()
    expect(deck.length).toBe(70)
    expect(deck.filter((c) => c.type === 'product').length).toBe(45)
    expect(deck.filter((c) => c.type === 'special').length).toBe(15)
    expect(deck.filter((c) => c.type === 'problem').length).toBe(10)
  })
})

describe('stopping and keeping products', () => {
  it('keeps all products when at or under the keep allowance (1-3 -> keep 1)', () => {
    gs.state.order.cards.push(product('P08')) // price 2
    gs.doStop()
    expect(gs.state.players[0].productsWon).toEqual(['P08'])
  })

  it('requires a selection once product count exceeds the keep allowance', () => {
    // 4 products -> keep 2 (tier 4-5).
    gs.state.order.cards.push(product('P08'), product('P16'), product('P25'), product('P41'))
    expect(gs.needsKeepSelection.value).toBe(true)
    expect(gs.stopKeepCount.value).toBe(2)
    gs.doStop(['P08', 'P16'])
    expect(gs.state.players[0].productsWon.sort()).toEqual(['P08', 'P16'])
    // Unchosen products are discarded.
    expect(gs.state.discard.some((c) => c.defId === 'P25')).toBe(true)
    expect(gs.state.discard.some((c) => c.defId === 'P41')).toBe(true)
  })

  it('a shipped bonus card goes to inventory, not the product collection, and is kept regardless of selection', () => {
    gs.state.order.cards.push(product('P05'), special('S05', 1)) // 7 + 2 = 9, below min -> fee applies but still kept
    gs.doStop()
    expect(gs.state.players[0].productsWon).toEqual(['P05'])
    expect(gs.state.players[0].specialInventory).toEqual([{ instanceId: 'S05-1', defId: 'S05' }])
  })

  it('an empty cart cannot stop', () => {
    expect(gs.canStop()).toBe(false)
  })
})

describe('shipping fees (fixed 15-25 window)', () => {
  it('charges a flat -2 fee below 15', () => {
    gs.state.order.cards.push(product('P08')) // price 2
    gs.doStop()
    expect(gs.state.players[0].shippingPenalty).toBe(2)
  })

  it('charges no fee within 15-25', () => {
    gs.state.order.cards.push(product('P05'), product('P11')) // 7 + 8 = 15
    gs.doStop()
    expect(gs.state.players[0].shippingPenalty).toBe(0)
  })

  it('charges -1 per 5 over 25, rounded up', () => {
    gs.state.order.cards.push(product('P15'), product('P33'), product('P21')) // 10+10+10 = 30 -> 5 over -> -1
    gs.doStop()
    expect(gs.state.players[0].shippingPenalty).toBe(1)
  })

  it('fees accumulate across turns', () => {
    gs.state.order.cards.push(product('P08')) // below min, -2
    gs.doStop()
    gs.state.order.cards.push(product('P25')) // Bob's turn, price 1, below min, -2
    gs.doStop()
    expect(gs.state.players[0].shippingPenalty).toBe(2)
    expect(gs.state.players[1].shippingPenalty).toBe(2)
  })
})

describe('problem cards and busting', () => {
  it('accumulating 3+ problem points cancels the order and discards everything', () => {
    // The bust check lives inside doDraw(), so drive state through real draws.
    gs.resetGame()
    gs.startGame([{ name: 'Alice', isBot: false }])
    gs.state.deck = [product('P05'), problem('PR09'), problem('PR01'), product('P11')]
    gs.doDraw() // P05
    gs.doDraw() // PR09, 2 points, no bust yet
    expect(gs.state.order.cards.length).toBe(2)
    gs.doDraw() // PR01, 2+1=3 points -> bust
    expect(gs.state.players[0].productsWon).toEqual([])
    expect(gs.state.order.cards.length).toBe(0)
    expect(gs.state.discard.some((c) => c.defId === 'P05')).toBe(true)
  })

  it('Shipping Insurance cancels up to 2 accumulated points, preventing a bust', () => {
    gs.resetGame()
    gs.startGame([{ name: 'Alice', isBot: false }])
    gs.state.players[0].specialInventory.push({ instanceId: 'TEST-S03', defId: 'S03' })
    gs.state.deck = [problem('PR09'), problem('PR01')] // 2 points, then +1 = 3

    gs.doDraw() // PR09: 2 points
    gs.useShippingInsurance(0, 'TEST-S03')
    expect(gs.effectiveProblemPoints.value).toBe(0)
    gs.doDraw() // PR01: raw 3, but insurance canceled 2 -> effective 1, no bust
    expect(gs.state.order.cards.length).toBe(2)
  })
})

describe('bonus cards', () => {
  it('Discount Coupon reduces the order total by 5', () => {
    gs.state.players[0].specialInventory.push({ instanceId: 'TEST-S01', defId: 'S01' })
    gs.state.order.cards.push(product('P21')) // price 10
    expect(gs.effectiveTotal.value).toBe(10)
    gs.useCoupon(0, 'TEST-S01')
    expect(gs.effectiveTotal.value).toBe(5)
  })

  it('Free Return removes a chosen product, including its price and product count', () => {
    gs.state.players[0].specialInventory.push({ instanceId: 'TEST-S02', defId: 'S02' })
    gs.state.order.cards.push(product('P05'), product('P11')) // 7 + 8 = 15
    gs.useFreeReturn(0, 'TEST-S02', 'P05')
    expect(gs.effectiveTotal.value).toBe(8)
    expect(gs.productCardsInOrder.value.map((c) => c.defId)).toEqual(['P11'])
    expect(gs.state.discard.some((c) => c.defId === 'P05')).toBe(true)
  })

  it('Extra Pick increases the keep allowance by 1', () => {
    gs.state.players[0].specialInventory.push({ instanceId: 'TEST-S04', defId: 'S04' })
    gs.state.order.cards.push(product('P08'), product('P16'), product('P25'), product('P41')) // 4 -> base tier 2
    expect(gs.stopKeepCount.value).toBe(2)
    gs.useExtraPick(0, 'TEST-S04')
    expect(gs.stopKeepCount.value).toBe(3)
  })

  it('Sneak Peek reveals the next 2 deck cards and can swap their order', () => {
    gs.state.players[0].specialInventory.push({ instanceId: 'TEST-S05', defId: 'S05' })
    gs.state.deck = [product('P05'), product('P11'), product('P21')]
    gs.useSneakPeek(0, 'TEST-S05')
    expect(gs.peekedCards.value).toEqual(['P05', 'P11'])
    gs.resolveSneakPeek(0, true) // swap
    expect(gs.state.deck[0].instanceId).toBe('P11')
    expect(gs.state.deck[1].instanceId).toBe('P05')
    expect(gs.peekedCards.value).toBe(null)
  })
})

describe('endgame score', () => {
  it('is the collection score minus accumulated shipping fees', () => {
    gs.state.order.cards.push(product('P08')) // price 2, below min -> -2 fee
    gs.doStop()
    const alice = gs.state.players[0]
    expect(endgameScore(alice.productsWon) - alice.shippingPenalty).toBe(0 - 2)
  })
})
