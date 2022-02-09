import type { PropType, UniNode } from '@uni-component/core'
import { h, inject, uni2Platform, uniComponent } from '@uni-component/core'

// Components
import { VIcon } from '@/components/VIcon'
import { VExpansionPanelSymbol } from './VExpansionPanels'

// Composables
import { useBackgroundColor } from '@/composables/color'

// Directives
import { Ripple } from '@/directives/ripple'
import { useDirective } from '@/composables/directive'

// Utilities
import { computed, toRef } from '@uni-store/core'
import { propsFactory } from '@/util'

export const makeVExpansionPanelTitleProps = propsFactory({
  expandIcon: {
    type: String,
    default: '$expand',
  },
  collapseIcon: {
    type: String,
    default: '$collapse',
  },
  hideActions: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: false,
  },
  color: String,
})

type Scope = {
  expanded: boolean
  disabled: boolean | undefined
  expandIcon: string
  collapseIcon: string
}

const UniVExpansionPanelTitle = uniComponent('v-expansion-panel-title', {
  ...makeVExpansionPanelTitleProps(),
  defaultRender: Function as PropType<(scope: Scope) => UniNode | undefined>,
  actionsRender: Function as PropType<(scope: Scope) => UniNode | undefined>,
}, (name, props) => {
  const expansionPanel = inject(VExpansionPanelSymbol)

  if (!expansionPanel) throw new Error('[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel')

  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))

  const slotProps = computed(() => ({
    expanded: expansionPanel.isSelected.value,
    disabled: expansionPanel.disabled.value,
    expandIcon: props.expandIcon,
    collapseIcon: props.collapseIcon,
  }))

  const rootClass = computed(() => {
    return [
      expansionPanel.isSelected.value && `${name}--active`,
      backgroundColorClasses.value,
    ]
  })

  const rootStyle = computed(() => {
    return backgroundColorStyles.value
  })

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: props.ripple,
      modifiers: {},
    }
  }))

  return {
    rootClass,
    rootStyle,
    rippleDirective,
    expansionPanel,
    slotProps,
  }
})

export const VExpansionPanelTitle = uni2Platform(UniVExpansionPanelTitle, (props, state, { renders }) => {
  const {
    rootClass,
    rootStyle,
    rippleDirective,
    expansionPanel,
    slotProps,
  } = state
  return (
    <button
      class={rootClass}
      style={rootStyle}
      ref={rippleDirective.setEleRef}
      type="button"
      tabIndex={ expansionPanel.disabled ? -1 : undefined }
      disabled={ expansionPanel.disabled }
      aria-expanded={ expansionPanel.isSelected }
      onClick={ expansionPanel.toggle }
    >
      <div class="v-expansion-panel-title__overlay" />
      { props.defaultRender ? props.defaultRender(slotProps) : renders.defaultRender?.(slotProps) }
      { !props.hideActions && (
        <div class="v-expansion-panel-title__icon">
          {
            props.actionsRender ? props.actionsRender(slotProps)
            : <VIcon icon={ expansionPanel.isSelected ? props.collapseIcon : props.expandIcon } />
          }
        </div>
      ) }
    </button>
  )
})
