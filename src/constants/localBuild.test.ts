import { describe, expect, it } from 'vitest'

import { IS_LOCAL_BUILD } from './localBuild'

describe('IS_LOCAL_BUILD', () => {
  it('is false for default / publish builds', () => {
    expect(IS_LOCAL_BUILD).toBe(false)
  })
})
