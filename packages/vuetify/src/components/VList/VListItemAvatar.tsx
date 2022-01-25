import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeTagProps } from '@/composables/tag'
import { computed } from '@uni-store/core'

const UniVListItemAvatar = uniComponent('v-list-item-avatar', {
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

export const VListItemAvatar = uni2Platform(UniVListItemAvatar, (props, state, { renders }) => {
  return (
    <props.tag
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
    >{ renders.defaultRender?.() }</props.tag>
  )
})
