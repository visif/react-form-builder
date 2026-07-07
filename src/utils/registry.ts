import type { ComponentType } from 'react'

import type { RegistryApi } from '../types/form'

type RegistryEntry = ComponentType<unknown> | Record<string, unknown>

function regg(): RegistryApi {
  const registry: Record<string, RegistryEntry> = {}

  const self: RegistryApi = {
    register,
    list,
    get,
  }

  function register(name: string, entry: RegistryEntry): RegistryApi {
    if (!name) {
      throw new Error('You must provide a valid name for this entry.')
    }

    if (registry[name] !== undefined) {
      throw new Error(`'${name}' already registered`)
    }

    if (!entry) {
      throw new Error(`You must provide something to register as '${name}'`)
    }

    registry[name] = entry

    return self
  }

  function get(name: string): RegistryEntry | undefined {
    if (!Object.prototype.hasOwnProperty.call(registry, name)) {
      console.error(`No such entry '${name}'`)
    }
    return registry[name]
  }

  function list(): string[] {
    return Object.keys(registry)
  }

  return self
}

const Registry = regg()

export default Registry
