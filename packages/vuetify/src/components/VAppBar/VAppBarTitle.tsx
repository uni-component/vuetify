import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VAppBarTitle.sass'

// Composables
import { makeTagProps } from '@/composables/tag'

const UniVAppBarTitle = uniComponent('v-app-bar-title', {
  ...makeTagProps({ tag: 'header' }),
}, () => ({}))

export const VAppBarTitle = uni2Platform(UniVAppBarTitle, (props, state, { renders }) => {
  return (
    <props.tag class={state.rootClass}>
      <div class="v-app-bar-title__placeholder">
        { renders.defaultRender?.() }
      </div>
    </props.tag>
  )
})
