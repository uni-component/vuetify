import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VMessages.sass'

import { VSlideYTransition } from '@/composables/transitions'

// Composables
import type { Transition } from '@/composables/transition'
import { makeTransitionProps, useTransition } from '@/composables/transition'

// Utilities
import { isObject, wrapInArray } from '@/util'
import { computed } from '@uni-store/core'

const UniVMessages = uniComponent('v-messages', {
  active: Boolean,
  value: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },

  ...makeTransitionProps({
    transition: {
      component: VSlideYTransition,
      // todo group
      // group: true,
    },
  }),
}, (name, props) => {
  const messages = computed(() => wrapInArray(props.value))

  const showMessages = computed(() => messages.value.length > 0 && props.active)
  const transition = (isObject(props.transition) ? props.transition.component({
    model: showMessages,
  }) : useTransition(showMessages, props.transition)) as Transition

  return {
    messages,
    showMessages,
    transition,
  }
})

export const VMessages = uni2Platform(UniVMessages, (props, state, { renders }) => {
  const {
    rootClass,
    messages,
    showMessages,
    transition,
  } = state
  return (
    <div
      class={rootClass}
      ref={transition.setEleRef}
    >
      { showMessages && (
        messages.map((message, i) => (
          <div class="v-messages__message" key={ i }>
            { message }
          </div>
        ))
      ) }

      { renders.defaultRender?.() }
    </div>
  )
})
