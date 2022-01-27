import type { PropType, UniNode } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VCounter.sass'

import { VSlideYTransition } from '@/composables/transitions'

// Utilities
import type { Transition } from '@/composables/transition'
import { makeTransitionProps, useTransition } from '@/composables/transition'
import { computed } from '@uni-store/core'
import { isObject } from '@/util'

export const CounterRender = Function as PropType<(scope: {
  counter: string
  max: number | string | undefined
  value: number | string
}) => UniNode | undefined>

const UniVCounter = uniComponent('v-counter', {
  active: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0,
  },

  ...makeTransitionProps({
    transition: { component: VSlideYTransition },
  }),

  defaultRender: CounterRender,
}, (_, props) => {
  const counter = computed(() => {
    return props.max ? `${props.value} / ${props.max}` : String(props.value)
  })

  const isActive = computed(() => props.active)
  const transition: Transition = isObject(props.transition) ? props.transition.component({
    model: isActive,
  }) : useTransition(isActive, props.transition)

  return {
    counter,
    transition,
  }
})

export const VCounter = uni2Platform(UniVCounter, (props, state) => {
  const {
    counter,
    rootId,
    rootClass,
    rootStyle,
    transition,
  } = state
  return (
    <div
      id={rootId}
      class={rootClass}
      style={rootStyle}
      ref={transition.setEleRef}
    >
      { props.defaultRender
        ? props.defaultRender({
          counter,
          max: props.max,
          value: props.value,
        })
        : counter
      }
    </div>
  )
})
