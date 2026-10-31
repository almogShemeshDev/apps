import { describe, it, expect, beforeEach } from 'vitest'
import { useGameState } from './useGameState.js'
import { endgameScore } from '../game/scoring.js'

function product(id) {
  return { instanceId: id, defId: id, type: 'product' }
}
function special(id, i = 1) {
  return { instanceId: `${id}-${i}`, defId: id, type: 'special' }
}

// useGameState() is a module-singleton: every call returns the same reactive
// state, so each test resets it via startGame() rather than re-importing.
const gs = useGameState()

beforeEach(() => {
  gs.startGame([
    { name: 'Alice', isBot: false },
    { name: 'Bob', isBot: false },
  ])
  // startGame begins at window level 3 (min 15, max 25).
})

describe('shipping (endgame collection scoring)', () => {
  it('a successful shipment moves products into the collection and awards no immediate VP', () => {
    // P05 Fashion (7), P11 Home (8), P21 Technology (10) -> total 25.
    gs.state.order.cards.push(product('P05'), product('P11'), product('P21'))
    expect(gs.canShip()).toBe(true)
    gs.doShip()
    expect(gs.state.players[0].productsWon).toEqual(['P05', 'P11', 'P21'])
    expect(gs.state.players[0].vp).toBeUndefined() // no stored VP field — score is derived at game end
  })

  it('a shipped special card goes to inventory, not the product collection', () => {
    gs.state.order.cards.push(product('P05'), product('P11'), special('S05', 1)) // 7 + 8 + 2 = 17, within
    gs.doShip()
    expect(gs.state.players[0].productsWon).toEqual(['P05', 'P11'])
    expect(gs.state.players[0].specialInventory).toEqual([{ instanceId: 'S05-1', defId: 'S05' }])
  })

  it('failed shipments discard everything and add nothing to the collection', () => {
    // Below the level-3 minimum (15) so the shipment cannot succeed.
    gs.state.order.cards.push(product('P08')) // price 2, well below min
    expect(gs.canShip()).toBe(false)
    expect(gs.canStopOrFail()).toBe(true)
    gs.doFail()
    expect(gs.state.players[0].productsWon).toEqual([])
    expect(gs.state.discard.some((c) => c.defId === 'P08')).toBe(true)
  })

  it('product prices still affect shipping eligibility', () => {
    // A single cheap product keeps the order below the window minimum
    // regardless of how many distinct categories are represented.
    gs.state.order.cards.push(product('P08')) // Fashion, price 2
    expect(gs.windowStatus.value).toBe('below')
    expect(gs.canShip()).toBe(false)

    gs.state.order.cards.push(product('P16'), product('P24'), product('P25'), product('P41')) // +2+4+1+1 = total 10
    expect(gs.windowStatus.value).toBe('below') // still under 15
    expect(gs.canShip()).toBe(false)

    gs.state.order.cards.push(product('P05')) // +7 => total 17, within 15-25
    expect(gs.windowStatus.value).toBe('within')
    expect(gs.canShip()).toBe(true)
  })

  it('special card discounts change price but never a product category', () => {
    gs.state.order.cards.push(product('P05'), product('P11'), product('P24')) // Fashion 7 + Home 8 + Tech 4 = 19
    const player = gs.state.players[0]
    player.specialInventory.push({ instanceId: 'TEST-S04', defId: 'S04' })
    expect(gs.canUseFlashSale(0, 'TEST-S04')).toBe(true)
    gs.useFlashSale(0, 'TEST-S04', ['P05'])
    expect(gs.effectivePriceOf(gs.state.order.cards[0])).toBe(5) // 7 - 2
    expect(gs.windowStatus.value).toBe('within') // 19 - 2 = 17, still within 15-25
    gs.doShip()
    // The discount never touched which products (and categories) were shipped.
    expect(gs.state.players[0].productsWon).toEqual(['P05', 'P11', 'P24'])
  })

  it('the endgame score is only computed from the accumulated collection, across turns', () => {
    // Turn 1 (Alice): ship Fashion + Home.
    gs.state.order.cards.push(product('P05'), product('P11'))
    gs.doShip()
    // Turn 2 (Bob): ship something else entirely.
    gs.state.order.cards.push(product('P25')) // Food, price 1 -> below min, so fail instead
    gs.doFail()
    // Turn 3 (Alice again): ship a third category.
    gs.state.order.cards.push(product('P05'), product('P21')) // Fashion (dup) + Technology, 7+10=17
    gs.doShip()

    const alice = gs.state.players[0]
    expect(alice.productsWon).toEqual(['P05', 'P11', 'P05', 'P21'])
    expect(endgameScore(alice.productsWon)).toBe(2 /* fashion x2 */ + 0 /* home x1 */ + 0 /* tech x1 */)
    expect(gs.state.players[1].productsWon).toEqual([]) // Bob's shipment failed
  })
})

describe('special card prices (count toward the cart like products)', () => {
  it('a drawn special card adds its own price to the order total', () => {
    gs.state.order.cards.push(product('P05')) // Fashion, price 7
    expect(gs.effectiveTotal.value).toBe(7)
    gs.state.order.cards.push(special('S03', 1)) // Tax Insurance, price 5
    expect(gs.effectiveTotal.value).toBe(12)
  })

  it('a special card price can push the order below or within the window', () => {
    gs.state.order.cards.push(product('P05'), product('P11')) // 7 + 8 = 15, within 15-25
    expect(gs.windowStatus.value).toBe('within')
    gs.state.order.cards.push(special('S03', 1)) // +5 => 20, still within
    expect(gs.windowStatus.value).toBe('within')
    gs.state.order.cards.push(special('S02', 1)) // Free Return, +4 => 24, still within
    expect(gs.windowStatus.value).toBe('within')
    gs.state.order.cards.push(special('S01', 1)) // Discount Coupon, +3 => 27, now above max
    expect(gs.windowStatus.value).toBe('above')
  })
})

describe('circular shipping window (unchanged by this update)', () => {
  it('advances forward with a 5 -> 1 wrap on a successful shipment', () => {
    gs.state.windowLevel = 5 // min 25, max 35
    // P15 Home (10) + P33 Leisure (10) + P21 Technology (10) = 30, within range.
    gs.state.order.cards.push(product('P15'), product('P33'), product('P21'))
    expect(gs.canShip()).toBe(true)
    gs.doShip()
    expect(gs.state.windowLevel).toBe(1)
  })

  it('retreats with a 1 -> 5 wrap on a failed shipment', () => {
    gs.state.windowLevel = 1
    gs.state.order.cards.push(product('P08')) // price 2, below level-1 min (5)
    expect(gs.canStopOrFail()).toBe(true)
    gs.doFail()
    expect(gs.state.windowLevel).toBe(5)
  })
})
