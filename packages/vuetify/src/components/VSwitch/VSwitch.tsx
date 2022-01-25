import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VSwitch.sass'

// Components
import { filterControlProps, makeSelectionControlProps, VSelectionControl } from '@/components/VSelectionControl/VSelectionControl'
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { VProgressCircular } from '@/components/VProgressCircular'

// Composables
import type { LoaderSlotProps } from '@/composables/loader'
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utility
import { computed } from '@uni-store/core'
import { filterInputAttrs } from '@/util'

const UniVSwitch = uniComponent('v-switch', {
  indeterminate: Boolean,
  'onUpdate:indeterminate': Function as PropType<(val: boolean) => void>,
  inset: Boolean,
  flat: Boolean,

  ...makeLoaderProps(),
  ...makeVInputProps(),
  ...makeSelectionControlProps(),
  loaderRender: Function as PropType<(scope: LoaderSlotProps) => UniNode | undefined>,
}, (name, props, context) => {
  const indeterminate = useProxiedModel(props, context, 'indeterminate')
  const { loaderClasses } = useLoader(props)

  const loaderColor = computed(() => {
    return typeof props.loading === 'string' && props.loading !== ''
      ? props.loading
      : props.color
  })

  function onChange (val: any) {
    props['onUpdate:modelValue']?.(val)
    if (indeterminate.value) {
      indeterminate.value = false
    }
  }

  const rootClass = computed(() => {
    return [
      {
        [`${name}--inset`]: props.inset,
        [`${name}--indeterminate`]: indeterminate.value,
      },
      loaderClasses.value,
    ]
  })

  return {
    rootClass,
    indeterminate,
    onChange,
    loaderColor,
  }
})

export const VSwitch = uni2Platform(UniVSwitch, (props, state, { $attrs, renders }) => {
  const [inputAttrs, controlAttrs] = filterInputAttrs($attrs)
  const [inputProps, _1] = filterInputProps(props)
  const [controlProps, _2] = filterControlProps(props)
  const {
    rootId,
    rootStyle,
    rootClass,
    indeterminate,
    onChange,
    loaderColor,
  } = state

  return (
    <VInput
      id={rootId}
      class={rootClass}
      style={rootStyle}
      { ...inputAttrs }
      { ...inputProps }
      { ...renders }
      defaultRender={({ isDisabled, isReadonly, isValid, id }) => (
        <VSelectionControl
          { ...controlProps }
          type="checkbox"
          onUpdate:modelValue={ onChange }
          aria-checked={ indeterminate ? 'mixed' : undefined }
          disabled={ isDisabled.value }
          readonly={ isReadonly.value }
          id={id.value}
          { ...controlAttrs }
          inputRender={({ textColorClasses }) => (
            <div
              class={classNames([
                'v-switch__thumb',
                textColorClasses,
              ])}
            >
              { props.loading && LoaderSlot({
                name: 'v-switch',
                active: true,
                color: isValid.value === false ? undefined : loaderColor,
                defaultRender: slotProps => (
                  props.loaderRender
                    ? props.loaderRender(slotProps)
                    : (
                      <VProgressCircular
                        // active={ slotProps.isActive }
                        color={ slotProps.color }
                        indeterminate
                        size="16"
                        width="2"
                      />
                    )
                ),
              })(
              ) }
            </div>
          )}
        >
          <label class="v-switch__track" htmlFor={id.value} />
        </VSelectionControl>
      )}
    />
  )
})
