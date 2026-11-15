import React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Rating, { toStarRatingValue } from './Rating'

describe('toStarRatingValue', () => {
  it('clamps historical values onto the 1-5 star scale', () => {
    expect(toStarRatingValue(8)).toBe(5)
    expect(toStarRatingValue('8')).toBe(5)
    expect(toStarRatingValue(7)).toBe(5)
    expect(toStarRatingValue(2)).toBe(2)
    expect(toStarRatingValue(5)).toBe(5)
    expect(toStarRatingValue([8])).toBe(5)
    expect(toStarRatingValue({ value: 8 })).toBe(5)
    expect(toStarRatingValue(0)).toBe(0)
    expect(toStarRatingValue(undefined)).toBe(0)
  })
})

describe('Rating', () => {
  it('publishes a clamped 5 when a stored value is 8', () => {
    const handleChange = vi.fn()
    render(
      <Rating
        mutable
        data={{ field_name: 'rating_1', label: 'Need', element: 'Rating' }}
        defaultValue={8}
        handleChange={handleChange}
      />
    )
    expect(handleChange).toHaveBeenCalledWith('rating_1', 5)
    const hidden = document.querySelector('input[name="rating_1"]')
    expect(hidden.value).toBe('5')
  })
})
