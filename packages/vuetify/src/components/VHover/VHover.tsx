import type { PropType, UniNode } from '@uni-component/core'
import { uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeDelayProps, useDelay } from '@/composables/delay'
import { useProxiedModel } from '@/composables/proxiedModel'

const UniVHover = uniComponent('v-hover', {
  disabled: Boolean,
  modelValue: {
    type: Boolean,
    default: undefined,
  },

  ...makeDelayProps(),
  defaultRender: Function as PropType<(scope: {
    hover: boolean | undefined
    props: {
      onMouseEnter: () => Promise<boolean>
      onMouseLeave: () => Promise<boolean>
    }
  }) => UniNode | undefined>,
  'onUpdate:modelValue': Function as PropType<(val: boolean) => void>,
}, (_, props, context) => {
  const hover = useProxiedModel(props, context, 'modelValue')
  const { runOpenDelay, runCloseDelay } = useDelay(props, value => !props.disabled && (hover.value = value))

  return {
    hover,
    runOpenDelay,
    runCloseDelay,
  }
})

export const VHover = uni2Platform(UniVHover, (props, state, { renders }) => {
  const {
    hover,
    runOpenDelay,
    runCloseDelay,
  } = state
  return (props.defaultRender || renders.defaultRender)?.({
    hover,
    props: {
      onMouseEnter: runOpenDelay,
      onMouseLeave: runCloseDelay,
    },
  })
})
