import { createDisplay, DisplaySymbol } from '@/composables/display'
import { createTheme, ThemeSymbol } from '@/composables/theme'
import { defaultSets, IconSymbol } from '@/composables/icons'
import { createDefaults, DefaultsSymbol, useDefaults } from '@/composables/defaults'
import { createLocaleAdapter, LocaleAdapterSymbol } from '@/composables/locale'
import { createRtl, RtlSymbol } from '@/composables/rtl'
import { aliases, mdi } from '@/iconsets/mdi'

// Utilities
import { mergeDeep } from '@/util'

// Types
import type { InjectionKey } from '@uni-component/core'
import { beforeUniSetup, computed, getRootInstance, reactive } from '@uni-component/core'
import type { DisplayOptions } from '@/composables/display'
import type { ThemeOptions } from '@/composables/theme'
import type { IconOptions } from '@/composables/icons'
import type { LocaleAdapter, LocaleOptions } from '@/composables/locale'
import type { RtlOptions } from '@/composables/rtl'
import type { DefaultsOptions } from '@/composables/defaults'

// use defaults
beforeUniSetup((props, state, context, FC) => {
  // context.nodeProps
  // props
  const defaults = useDefaults()
  const globalDefaults = defaults.value.global
  const componentDefaults = defaults.value[FC.name]

  if (!globalDefaults && !componentDefaults) {
    return
  }
  for (const prop of Object.keys(props)) {
    let newVal
    if (context.nodeProps?.hasOwnProperty(prop)) {
      // do nothing
      newVal = (props as any)[prop]
    } else {
      newVal = componentDefaults?.[prop] ?? globalDefaults?.[prop] ?? (props as any)[prop]
    }
    if ((props as any)[prop] !== newVal) {
      (props as any)[prop] = newVal
    }
  }
})

export * from './composables'

export const VuetifySymbol: InjectionKey<{

}> = Symbol.for('vuetify')

export interface VuetifyOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
  defaults?: DefaultsOptions
  display?: DisplayOptions
  theme?: ThemeOptions
  icons?: IconOptions
  locale?: (LocaleOptions & RtlOptions) | (LocaleAdapter & RtlOptions)
}

export const createVuetify = (options: VuetifyOptions = {}) => {
  const rootInstance = getRootInstance()

  const defaults = createDefaults(options.defaults)
  const display = createDisplay(options.display)
  const theme = createTheme(rootInstance, options.theme)
  const icon = mergeDeep({
    defaultSet: 'mdi',
    sets: {
      ...defaultSets,
      mdi,
    },
    aliases,
  }, options.icons)
  const { adapter, rootInstance: localeRootInstance } = createLocaleAdapter(rootInstance, options?.locale)
  const rtl = createRtl(localeRootInstance, options?.locale)

  rootInstance.provides[DefaultsSymbol as symbol] = defaults
  rootInstance.provides[DisplaySymbol as symbol] = display
  rootInstance.provides[ThemeSymbol as symbol] = theme
  rootInstance.provides[IconSymbol as symbol] = icon
  rootInstance.provides[LocaleAdapterSymbol as symbol] = adapter
  rootInstance.provides[RtlSymbol as symbol] = rtl

  // todo type
  const $vuetify = computed(() => {
    return reactive({
      defaults: rootInstance.provides[DefaultsSymbol as symbol],
      display: rootInstance.provides[DisplaySymbol as symbol],
      theme: rootInstance.provides[ThemeSymbol as symbol],
      icons: rootInstance.provides[IconSymbol as symbol],
      locale: rootInstance.provides[LocaleAdapterSymbol as symbol],
      rtl: rootInstance.provides[RtlSymbol as symbol],
    })
  })
  rootInstance.provides[VuetifySymbol as symbol] = $vuetify

  return $vuetify

  // const install = (app: App) => {
  //   const {
  //     components = {},
  //     directives = {},
  //     icons = {},
  //   } = options

  //   for (const key in directives) {
  //     const directive = directives[key]

  //     app.directive(key, directive)
  //   }

  //   for (const key in components) {
  //     const component = components[key]

  //     app.component(key, component)
  //   }

  //   app.provide(DefaultsSymbol, createDefaults(options.defaults))
  //   app.provide(DisplaySymbol, createDisplay(options.display))
  //   app.provide(ThemeSymbol, createTheme(app, options.theme))
  //   app.provide(IconSymbol, mergeDeep({
  //     defaultSet: 'mdi',
  //     sets: {
  //       ...defaultSets,
  //       mdi,
  //     },
  //     aliases,
  //   }, icons))
  //   const { adapter, rootInstance } = createLocaleAdapter(app, options?.locale)
  //   app.provide(LocaleAdapterSymbol, adapter)
  //   app.provide(RtlSymbol, createRtl(rootInstance, options?.locale))

  //   // Vue's inject() can only be used in setup
  //   function inject (this: ComponentPublicInstance, key: InjectionKey<any> | string) {
  //     const vm = this.$

  //     const provides = vm.parent?.provides ?? vm.vnode.appContext?.provides

  //     if (provides && (key as any) in provides) {
  //       return provides[(key as string)]
  //     }
  //   }

  //   app.mixin({
  //     computed: {
  //       $vuetify () {
  //         return reactive({
  //           defaults: inject.call(this, DefaultsSymbol),
  //           display: inject.call(this, DisplaySymbol),
  //           theme: inject.call(this, ThemeSymbol),
  //           icons: inject.call(this, IconSymbol),
  //           locale: inject.call(this, LocaleAdapterSymbol),
  //           rtl: inject.call(this, RtlSymbol),
  //         })
  //       },
  //     },
  //   })
  // }

  // return { install }
}
