import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VCheckbox.sass'

// Components
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { filterControlProps, makeSelectionControlProps, VSelectionControl } from '@/components/VSelectionControl/VSelectionControl'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Utility
import { computed } from '@uni-store/core'
// todo attrs
// import { filterInputAttrs } from '@/util'

const UniVCheckbox = uniComponent('v-checkbox', {
  indeterminate: Boolean,
  indeterminateIcon: {
    type: String,
    default: '$checkboxIndeterminate',
  },

  ...makeVInputProps(),
  ...makeSelectionControlProps(),

  falseIcon: {
    type: String,
    default: '$checkboxOff',
  },
  trueIcon: {
    type: String,
    default: '$checkboxOn',
  },
  'onUpdate:indeterminate': Function as PropType<(val: boolean) => void>,
}, (_, props, context) => {
  const indeterminate = useProxiedModel(props, context, 'indeterminate')
  const falseIcon = computed(() => {
    return indeterminate.value
      ? props.indeterminateIcon
      : props.falseIcon
  })
  const trueIcon = computed(() => {
    return indeterminate.value
      ? props.indeterminateIcon
      : props.trueIcon
  })

  function onChange (val: any) {
    props['onUpdate:modelValue']?.(val)
    if (indeterminate.value) {
      indeterminate.value = false
    }
  }

  return {
    indeterminate,
    falseIcon,
    trueIcon,
    onChange,
  }
})

export const VCheckbox = uni2Platform(UniVCheckbox, (props, state, { attrs }) => {
  // const [inputAttrs, controlAttrs] = filterInputAttrs(attrs)
  const [inputProps, _1] = filterInputProps(props)
  const [controlProps, _2] = filterControlProps(props)
  const {
    rootClass,
    indeterminate,
    falseIcon,
    trueIcon,
    onChange,
  } = state

  return (
    <VInput
      class={rootClass}
      // { ...inputAttrs }
      { ...inputProps }

      defaultRender={({ isDisabled, isReadonly }) => (
        <VSelectionControl
          { ...controlProps }
          type="checkbox"
          onUpdate:modelValue={ onChange }
          falseIcon={ falseIcon }
          trueIcon={ trueIcon }
          aria-checked={ indeterminate ? 'mixed' : undefined }
          disabled={ isDisabled.value }
          readonly={ isReadonly.value }
          // { ...controlAttrs }
        />
      )}
    />
  )
})
