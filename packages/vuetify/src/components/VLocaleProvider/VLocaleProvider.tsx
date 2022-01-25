import { h, uni2Platform, uniComponent } from '@uni-component/core'

import './VLocaleProvider.sass'

// Composables
import { provideLocale } from '@/composables/locale'
import { provideRtl } from '@/composables/rtl'

import { computed } from '@uni-store/core'

const UniVLocaleProvider = uniComponent('v-locale-provider', {
  locale: String,
  fallbackLocale: String,
  messages: Object,
  rtl: {
    type: Boolean,
    default: undefined,
  },
}, (_, props) => {
  const localeInstance = provideLocale(props)
  const { rtlClasses } = provideRtl(props, localeInstance)

  const rootClass = computed(() => {
    return rtlClasses.value
  })

  return {
    rootClass,
  }
})

export const VLocaleProvider = uni2Platform(UniVLocaleProvider, (_, state, { renders }) => {
  return (
    <div class={state.rootClass}>
      { renders.defaultRender?.() }
    </div>
  )
})
