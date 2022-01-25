import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VLabel.sass'

// Composables
import { makeThemeProps } from '@/composables/theme'
import { computed } from '@uni-store/core'

const UniVLabel = uniComponent('v-label', {
  disabled: Boolean,
  error: Boolean,
  text: String,
  for: String,

  ...makeThemeProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    return {
      [`${name}--disabled`]: props.disabled,
      [`${name}--error`]: props.error,
    }
  })
  return {
    rootClass,
  }
})

export const VLabel = uni2Platform(UniVLabel, (props, state, { renders }) => {
  return (
    <label
      id={state.rootId}
      class={state.rootClass}
      style={state.rootId}
      htmlFor={props.for}
    >
      { props.text }

      { renders.defaultRender?.() }
    </label>
  )
})
