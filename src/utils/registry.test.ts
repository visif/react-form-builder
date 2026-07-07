import { describe, expect, it } from 'vitest'

import Registry from './registry'

describe('Registry', () => {
  it('registers and retrieves entries', () => {
    const component = () => null
    const name = `TestWidget_${Date.now()}_register`
    Registry.register(name, component)
    expect(Registry.get(name)).toBe(component)
  })

  it('lists registered entry names', () => {
    const name = `TestWidget_${Date.now()}_list`
    Registry.register(name, () => null)
    expect(Registry.list()).toContain(name)
  })

  it('throws when registering without a name', () => {
    expect(() => Registry.register('', () => null)).toThrow('valid name')
  })

  it('throws when registering duplicate names', () => {
    const name = `TestWidget_${Date.now()}_duplicate`
    Registry.register(name, () => null)
    expect(() => Registry.register(name, () => null)).toThrow('already registered')
  })
})
