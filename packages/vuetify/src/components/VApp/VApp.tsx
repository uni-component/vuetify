import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VApp.sass'

// Composables
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { createLayout, makeLayoutProps } from '@/composables/layout'

// Utilities
import { useRtl } from '@/composables/rtl'
import { computed } from '@uni-store/core'

const UniVApp = uniComponent('v-app', {
  ...makeLayoutProps({ fullHeight: true }),
  ...makeThemeProps(),
}, (_, props) => {
  const theme = provideTheme(props)
  const { layoutClasses, getLayoutItem, items } = createLayout(props)
  const { rtlClasses } = useRtl()

  const rootClass = computed(() => {
    return [
      theme.themeClasses.value,
      layoutClasses.value,
      rtlClasses.value,
    ]
  })

  return {
    rootClass,
    getLayoutItem,
    items,
    theme,
  }
})

export const VApp = uni2Platform(UniVApp, (_, state, { renders }) => {
  const { rootClass } = state
  return (
    <div
      class={rootClass}
      data-app="true"
    >
      <div class="v-application__wrap">
        { renders.defaultRender?.() }
      </div>
    </div>
  )
})
