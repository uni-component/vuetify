import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VMenu.sass'

// Components
import { VOverlay } from '@/components/VOverlay'

// Composables
import { makeTransitionProps } from '@/composables/transition'
import { useProxiedModel } from '@/composables/proxiedModel'
import { VDialogTransition } from '@/composables/transitions'

// Utilities
import { computed } from '@uni-store/core'
import { getUid } from '@/util'

import { overlayRenders } from '@/components/VOverlay/VOverlay'

const UniVMenu = uniComponent('v-menu', {
  // TODO
  // closeOnClick: {
  //   type: Boolean,
  //   default: true,
  // },
  // closeOnContentClick: {
  //   type: Boolean,
  //   default: true,
  // },
  disableKeys: Boolean,
  modelValue: Boolean,
  id: String,

  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,

  ...makeTransitionProps({
    transition: { component: VDialogTransition },
  } as const),
  ...overlayRenders,
}, (name, props, context) => {
  const isActive = useProxiedModel(props, context, 'modelValue')
  const updateModelValue = (val: boolean) => {
    isActive.value = val
  }

  const uid = getUid()
  const id = computed(() => props.id || `${name}-${uid}`)

  return {
    id,
    isActive,
    updateModelValue,
  }
})

export const VMenu = uni2Platform(UniVMenu, (props, state, { $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    id,
    isActive,
    updateModelValue,
  } = state
  return (
    <VOverlay
      id={rootId}
      class={rootClass}
      style={rootStyle}
      modelValue={ isActive }
      onUpdate:modelValue={updateModelValue}
      transition={ props.transition }
      absolute
      positionStrategy="connected"
      scrollStrategy="reposition"
      scrim={ false }
      activatorProps={{
        'aria-haspopup': 'menu',
        'aria-expanded': String(isActive),
        'aria-owns': id,
      }}
      { ...$attrs }
      defaultRender={props.defaultRender}
      activatorRender={props.activatorRender}
    />
  )
})
