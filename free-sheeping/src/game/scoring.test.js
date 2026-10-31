import { describe, it, expect } from 'vitest'
import { scoreForCategoryProductCount, categoryCounts, hasDiversityBonus, endgameScore } from './scoring.js'

describe('scoreForCategoryProductCount', () => {
  it('matches the endgame scoring table', () => {
    expect(scoreForCategoryProductCount(0)).toBe(0)
    expect(scoreForCategoryProductCount(1)).toBe(0)
    expect(scoreForCategoryProductCount(2)).toBe(2)
    expect(scoreForCategoryProductCount(3)).toBe(5)
    expect(scoreForCategoryProductCount(4)).toBe(9)
    expect(scoreForCategoryProductCount(5)).toBe(14)
  })

  it('caps at the 5-or-more tier', () => {
    expect(scoreForCategoryProductCount(6)).toBe(14)
    expect(scoreForCategoryProductCount(9)).toBe(14)
  })
})

describe('categoryCounts', () => {
  it('counts products per category and reports all five categories', () => {
    // P01, P02 Fashion; P09 Home.
    const counts = categoryCounts(['P01', 'P02', 'P09'])
    expect(counts).toEqual({ fashion: 2, home: 1, tech: 0, food: 0, leisure: 0 })
  })

  it('an empty collection scores all zeros', () => {
    expect(categoryCounts([])).toEqual({ fashion: 0, home: 0, tech: 0, food: 0, leisure: 0 })
  })
})

describe('hasDiversityBonus', () => {
  it('is false unless every category has at least one product', () => {
    expect(hasDiversityBonus({ fashion: 3, home: 1, tech: 0, food: 2, leisure: 1 })).toBe(false)
  })

  it('is true once all five categories have at least one product', () => {
    expect(hasDiversityBonus({ fashion: 1, home: 1, tech: 1, food: 1, leisure: 1 })).toBe(true)
  })
})

describe('endgameScore', () => {
  it('sums the five category scores with no diversity bonus', () => {
    // Fashion: P01, P02 (2 -> 2 VP). Home: P09, P10, P11 (3 -> 5 VP). Nothing else.
    const score = endgameScore(['P01', 'P02', 'P09', 'P10', 'P11'])
    expect(score).toBe(2 + 5)
  })

  it('adds the 5 VP diversity bonus once every category has a product', () => {
    // One product from each of the five categories (1 each -> 0 VP per category).
    const score = endgameScore(['P01', 'P09', 'P17', 'P25', 'P32'])
    expect(score).toBe(0 + 5) // all singles score 0, plus the diversity bonus
  })

  it('a full 5-or-more category plus full diversity scores the maximum tier everywhere', () => {
    // 5 Fashion products + one product from each other category.
    const score = endgameScore(['P01', 'P02', 'P03', 'P04', 'P05', 'P09', 'P17', 'P25', 'P32'])
    expect(score).toBe(14 + 0 + 0 + 0 + 0 + 5) // fashion maxed, others at 1 (0 VP), plus bonus
  })

  it('an empty collection scores 0', () => {
    expect(endgameScore([])).toBe(0)
  })
})
