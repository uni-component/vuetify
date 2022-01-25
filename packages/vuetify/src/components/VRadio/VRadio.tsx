import {
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Components
import { VSelectionControl } from '@/components/VSelectionControl'
import { makeSelectionControlProps } from '@/components/VSelectionControl/VSelectionControl'

const UniVRadio = uniComponent('v-radio', {
  ...makeSelectionControlProps(),
  falseIcon: {
    type: String,
    default: '$radioOff',
  },
  trueIcon: {
    type: String,
    default: '$radioOn',
  },
}, (name, props) => {
  return {}
})

export const VRadio = uni2Platform(UniVRadio, (props, state, { renders }) => {
  return (
    <VSelectionControl
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
      { ...props }
      { ...renders }
      type="radio"
    />
  )
})
