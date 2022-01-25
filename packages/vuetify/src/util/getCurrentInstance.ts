// Utilities
import { getCurrentInstance as _getCurrentInstance } from '@uni-component/core'
import { toKebabCase } from '@/util'

export function getCurrentInstance (name: string, message?: string) {
  const vm = _getCurrentInstance()

  if (!vm) {
    throw new Error(`[Vuetify] ${name} ${message || 'must be called from inside a setup function'}`)
  }

  return vm
}

export function getCurrentInstanceName (name = 'composables') {
  return toKebabCase((getCurrentInstance(name) as any).type?.name)
}
