import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VLayout.sass'

// Composables
import { createLayout, makeLayoutProps } from '@/composables/layout'

const UniVLayout = uniComponent('v-layout', makeLayoutProps(), (name, props) => {
  const { layoutClasses: rootClass, getLayoutItem, items } = createLayout(props)
  return {
    rootClass,
    getLayoutItem,
    items,
  }
})

export const VLayout = uni2Platform(UniVLayout, (_, state, { renders }) => {
  return (
    <div class={ state.rootClass }>
      { renders.defaultRender?.() }
    </div>
  )
})
