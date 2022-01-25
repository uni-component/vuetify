import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Components
import { VBtn } from '@/components/VBtn'

const UniVAppBarNavIcon = uniComponent('v-app-bar-nav-icon', {
  icon: {
    type: String,
    default: '$menu',
  },
}, () => ({}))

export const VAppBarNavIcon = uni2Platform(UniVAppBarNavIcon, (props, state, { renders }) => {
  return (
    <VBtn class={state.rootClass} icon={ props.icon }>
      { renders.defaultRender?.() }
    </VBtn>
  )
})
