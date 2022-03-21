import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  computed,
  Fragment,
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VRadioGroup.sass'

// Components
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { VLabel } from '@/components/VLabel'
import { VSelectionControlGroup } from '@/components/VSelectionControlGroup'
import { filterControlProps, makeSelectionControlProps } from '@/components/VSelectionControl/VSelectionControl'

// Utility
import { filterInputAttrs, getUid } from '@/util'

const UniVRadioGroup = uniComponent('v-radio-group', {
  height: {
    type: [Number, String],
    default: 'auto',
  },

  ...makeVInputProps(),
  ...makeSelectionControlProps(),

  trueIcon: {
    type: String,
    default: '$radioOn',
  },
  falseIcon: {
    type: String,
    default: '$radioOff',
  },
  type: {
    type: String,
    default: 'radio',
  },
  labelRender: Function as PropType<(scope: {
    label?: string | undefined
    props: {
      for: string
    }
  }) => UniNode | undefined>,
}, (_, props) => {
  const uid = getUid()
  const id = computed(() => props.id || `radio-group-${uid}`)

  return {
    id,
  }
})

export const VRadioGroup = uni2Platform(UniVRadioGroup, (props, state, { renders, $attrs }) => {
  const [inputAttrs, controlAttrs] = filterInputAttrs($attrs)
  const [inputProps, _1] = filterInputProps(props)
  const [controlProps, _2] = filterControlProps(props)
  const label = props.labelRender
    ? props.labelRender({
      label: props.label,
      props: { for: state.id },
    })
    : props.label
  return (
    <VInput
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
      { ...inputAttrs }
      { ...inputProps }
      { ...renders }
      defaultRender={({ isDisabled, isReadonly, isValid }) => (
        <>
          { label && (
            <VLabel
              disabled={ isDisabled.value }
              error={ isValid.value === false }
              for={ state.id }
            >
              { label }
            </VLabel>
          ) }

          <VSelectionControlGroup
            { ...controlProps }
            { ...controlAttrs }
            { ...renders }
            id={ state.id }
            trueIcon={ props.trueIcon }
            falseIcon={ props.falseIcon }
            type={ props.type }
            disabled={ isDisabled.value }
            readonly={ isReadonly.value }
          />
        </>
      )}
    />
  )
})
