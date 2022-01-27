import {
  h,
  inject,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Components
import { VExpansionPanelSymbol } from './VExpansionPanels'

// Composables
import { makeLazyProps, useLazy } from '@/composables/lazy'
import { VExpandTransition } from '@/composables/transitions'

const UniVExpansionPanelText = uniComponent('v-expansion-panel-text', {
  ...makeLazyProps(),
}, (name, props) => {
  const expansionPanel = inject(VExpansionPanelSymbol)

  if (!expansionPanel) throw new Error('[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel')

  const { hasContent, onAfterLeave } = useLazy(props, expansionPanel.isSelected)

  const transition = VExpandTransition({
    model: expansionPanel.isSelected,
  }, {
    afterLeave: onAfterLeave,
  })

  return {
    hasContent,
    transition,
  }
})

export const VExpansionPanelText = uni2Platform(UniVExpansionPanelText, (props, state, { renders }) => {
  const {
    rootClass,
    hasContent,
    transition,
  } = state

  const content = renders.defaultRender?.()

  return (
    <div
      ref={transition.setEleRef}
      class={rootClass}
    >
      { content && hasContent && (
        <div class="v-expansion-panel-text__wrapper">
          { content }
        </div>
      ) }
    </div>
  )
})
