import { describe, it, expect } from 'vitest'
import { scoreForCategoryCount, categoriesInCards, potentialVp } from './scoring.js'

function product(id) {
  return { instanceId: id, defId: id, type: 'product' }
}
function special(id, i = 1) {
  return { instanceId: `${id}-${i}`, defId: id, type: 'special' }
}

describe('scoreForCategoryCount', () => {
  it('matches the scoring table for 0-5 categories', () => {
    expect(scoreForCategoryCount(0)).toBe(0)
    expect(scoreForCategoryCount(1)).toBe(1)
    expect(scoreForCategoryCount(2)).toBe(3)
    expect(scoreForCategoryCount(3)).toBe(6)
    expect(scoreForCategoryCount(4)).toBe(10)
    expect(scoreForCategoryCount(5)).toBe(15)
  })

  it('clamps above 5 distinct categories (table has no higher entry)', () => {
    expect(scoreForCategoryCount(6)).toBe(15)
  })
})

describe('categoriesInCards / potentialVp', () => {
  it('one category earns 1 VP regardless of duplicate products', () => {
    // P01, P02, P03 are all Fashion & Beauty.
    const cards = [product('P01'), product('P02'), product('P03')]
    expect(categoriesInCards(cards).size).toBe(1)
    expect(potentialVp(cards)).toBe(1)
  })

  it('two distinct categories earn 3 VP', () => {
    // P05 Fashion, P15 Home & Living.
    const cards = [product('P05'), product('P15')]
    expect(categoriesInCards(cards).size).toBe(2)
    expect(potentialVp(cards)).toBe(3)
  })

  it('three distinct categories earn 6 VP', () => {
    // P05 Fashion, P11 Home, P21 Technology.
    const cards = [product('P05'), product('P11'), product('P21')]
    expect(categoriesInCards(cards).size).toBe(3)
    expect(potentialVp(cards)).toBe(6)
  })

  it('four distinct categories earn 10 VP', () => {
    // Fashion, Home, Technology, Food & Kitchen + a duplicate Fashion product.
    const cards = [product('P08'), product('P16'), product('P24'), product('P25'), product('P06')]
    expect(categoriesInCards(cards).size).toBe(4)
    expect(potentialVp(cards)).toBe(10)
  })

  it('five distinct categories earn 15 VP', () => {
    // One product from each of the five categories.
    const cards = [product('P08'), product('P16'), product('P24'), product('P25'), product('P41')]
    expect(categoriesInCards(cards).size).toBe(5)
    expect(potentialVp(cards)).toBe(15)
  })

  it('special cards never count as categories', () => {
    const cards = [product('P01'), special('S01'), special('S02'), special('S03')]
    expect(categoriesInCards(cards).size).toBe(1)
    expect(potentialVp(cards)).toBe(1)
  })

  it('an empty or all-special cart scores 0', () => {
    expect(potentialVp([])).toBe(0)
    expect(potentialVp([special('S01'), special('S02')])).toBe(0)
  })

  it('duplicate category products do not increase the distinct count', () => {
    const base = [product('P01')]
    const withDuplicate = [product('P01'), product('P02')]
    expect(categoriesInCards(base).size).toBe(categoriesInCards(withDuplicate).size)
  })
})
