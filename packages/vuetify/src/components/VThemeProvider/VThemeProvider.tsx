import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VThemeProvider.sass'

// Composables
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeTagProps } from '@/composables/tag'

const UniVThemeProvider = uniComponent('v-theme-provider', {
  withBackground: Boolean,

  ...makeThemeProps(),
  ...makeTagProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)

  return {
    rootClass: themeClasses,
  }
})

export const VThemeProvider = uni2Platform(UniVThemeProvider, (props, state, { renders }) => {
  if (!props.withBackground) return renders.defaultRender?.()

  return (
    <props.tag id={state.rootId} class={state.rootClass} style={state.rootStyle}>
      { renders.defaultRender?.() }
    </props.tag>
  )
})
