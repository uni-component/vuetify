import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeTagProps } from '@/composables/tag'
import { computed } from '@uni-store/core'

const UniVBannerAvatar = uniComponent('v-banner-avatar', {
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

export const VBannerAvatar = uni2Platform(UniVBannerAvatar, (props, state, { renders }) => {
  return (
    <props.tag class={state.rootClass}>
      { renders.defaultRender?.() }
    </props.tag>
  )
})
