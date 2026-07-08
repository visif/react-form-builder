import { describe, expect, it } from 'vitest'

import myxss from './xss'

describe('myxss', () => {
  it('strips script tags', () => {
    expect(myxss.process('<script>alert(1)</script>Hello')).toBe('Hello')
  })

  it('allows basic formatting tags', () => {
    expect(myxss.process('<strong>bold</strong>')).toBe('<strong>bold</strong>')
  })

  it('removes event handler attributes', () => {
    const result = myxss.process('<span onclick="alert(1)">text</span>')
    expect(result).not.toContain('onclick')
    expect(result).toContain('text')
  })
})
