import { computed, inject, provide, ref } from '@uni-component/core'
import { rtl } from '@/locale'

// Types
import type { InjectionKey, Ref } from '@uni-component/core'
import type { LocaleInstance } from './locale'

export interface RtlOptions {
  defaultRtl?: boolean
  rtl?: Record<string, boolean>
}

export interface RtlProps {
  rtl?: boolean
}

export interface RtlInstance {
  isRtl: Ref<boolean>
  rtl: Record<string, boolean>
  rtlClasses: Ref<string>
}

export const RtlSymbol: InjectionKey<RtlInstance> = Symbol.for('vuetify:rtl')

export function createRtl (localeScope: LocaleInstance, options?: RtlOptions) {
  return createRtlScope({
    rtl: {
      ...rtl,
      ...(options?.rtl ?? {}),
    },
    isRtl: ref(options?.defaultRtl ?? false),
    rtlClasses: ref(''),
  }, localeScope)
}

export function createRtlScope (currentScope: RtlInstance, localeScope: LocaleInstance, options?: RtlProps): RtlInstance {
  const isRtl = computed(() => {
    if (typeof options?.rtl === 'boolean') return options.rtl
    if (localeScope.current.value && currentScope.rtl.hasOwnProperty(localeScope.current.value)) {
      return currentScope.rtl[localeScope.current.value]
    }

    return currentScope.isRtl.value
  })

  return {
    isRtl,
    rtl: currentScope.rtl,
    rtlClasses: computed(() => `v-locale--is-${isRtl.value ? 'rtl' : 'ltr'}`),
  }
}

export function provideRtl (props: RtlProps, localeScope: LocaleInstance) {
  const currentScope = inject(RtlSymbol)

  if (!currentScope) throw new Error('[Vuetify] Could not find injected rtl instance')

  const newScope = createRtlScope(currentScope, localeScope, props)

  provide(RtlSymbol, newScope)

  return newScope
}

export function useRtl () {
  const currentScope = inject(RtlSymbol)

  if (!currentScope) throw new Error('[Vuetify] Could not find injected rtl instance')

  return currentScope
}
