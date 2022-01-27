import type { PropType } from '@uni-component/core'
import {
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VTooltip.sass'

// Components
import { VOverlay } from '@/components/VOverlay'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { makeTransitionProps } from '@/composables/transition'

// Utilities
import { computed, watch } from '@uni-store/core'
import { getUid } from '@/util'

import { overlayRenders } from '@/components/VOverlay/VOverlay'
import type { StrategyProps } from '@/components/VOverlay/positionStrategies'

const UniVTooltip = uniComponent('v-tooltip', {
  id: String,
  modelValue: Boolean,
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
  text: String,

  anchor: {
    type: String as PropType<StrategyProps['anchor']>,
    default: 'end',
  },
  origin: {
    type: String as PropType<StrategyProps['origin']>,
    default: 'auto',
  },

  ...makeTransitionProps({
    transition: false,
  } as const),
  ...overlayRenders,
}, (_, props, context) => {
  const isActive = useProxiedModel(props, context, 'modelValue')
  const updateIsActive = (v: boolean) => isActive.value = v

  watch(isActive, v => {
    console.log('v', v)
  })

  const uid = getUid()
  const id = computed(() => props.id || `v-tooltip-${uid}`)

  const anchor = computed(() => {
    return props.anchor.split(' ').length > 1
      ? props.anchor
      : props.anchor + ' center' as StrategyProps['anchor']
  })

  const origin = computed(() => {
    return (
      props.origin === 'auto' ||
      props.origin === 'overlap' ||
      props.origin.split(' ').length > 1 ||
      props.anchor.split(' ').length > 1
    ) ? props.origin
      : props.origin + ' center' as StrategyProps['origin']
  })

  const transition = computed(() => {
    if (props.transition) return props.transition
    return isActive.value ? 'scale-transition' : 'fade-transition'
  })

  return {
    isActive,
    updateIsActive,
    id,
    anchor,
    origin,
    transition,
  }
})

export const VTooltip = uni2Platform(UniVTooltip, (props, state, { $attrs, renders }) => {
  const {
    rootClass,
    rootStyle,
    isActive,
    updateIsActive,
    id,
    anchor,
    origin,
    transition,
  } = state
  return (
    <VOverlay
      modelValue={isActive}
      onUpdate:modelValue={updateIsActive}
      class={rootClass}
      style={rootStyle}
      id={ id }
      transition={ transition }
      absolute
      positionStrategy="connected"
      scrollStrategy="reposition"
      anchor={ anchor }
      origin={ origin }
      minWidth={0}
      offset={ 10 }
      scrim={ false }
      persistent
      openOnClick={ false }
      openOnHover
      // @ts-expect-error
      role="tooltip"
      eager
      activatorProps={{
        'aria-describedby': id,
      }}
      { ...$attrs }
      activatorRender={props.activatorRender}
      defaultRender={scope => {
        return (props.defaultRender || renders.defaultRender)?.(scope) ?? props.text
      }}
    />
  )
})
