import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeTagProps } from '@/composables/tag'

const UniVListItemMedia = uniComponent('v-list-item-media', {
  left: Boolean,
  right: Boolean,

  ...makeTagProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    return {
      [`${name}--start`]: props.left,
      [`${name}--end`]: props.right,
    }
  })
  return {
    rootClass,
  }
})

export const VListItemMedia = uni2Platform(UniVListItemMedia, (props, state, { renders }) => {
  return (
    <props.tag
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
    >{ renders.defaultRender?.() }</props.tag>
  )
})
