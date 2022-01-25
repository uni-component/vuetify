import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VGrid.sass'

// Composables
import { makeTagProps } from '@/composables/tag'
import { computed } from '@uni-store/core'

const UniVContainer = uniComponent('v-container', {
  fluid: {
    type: Boolean,
    default: false,
  },
  ...makeTagProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    return {
      [`${name}--fluid`]: props.fluid,
    }
  })
  return {
    rootClass,
  }
})

export const VContainer = uni2Platform(UniVContainer, (props, state, { renders }) => {
  return (
    <props.tag
      class={state.rootClass}
    >{ renders.defaultRender?.() }</props.tag>
  )
})
