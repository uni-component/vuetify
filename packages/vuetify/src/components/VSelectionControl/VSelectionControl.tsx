import type { Context, ExtractPropTypes, PropType, UniNode } from '@uni-component/core'
import { h, inject, uni2Platform, uniComponent, useRef } from '@uni-component/core'

// Styles
import './VSelectionControl.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VLabel } from '@/components/VLabel'
import { VSelectionControlGroupSymbol } from '@/components/VSelectionControlGroup/VSelectionControlGroup'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeThemeProps } from '@/composables/theme'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useTextColor } from '@/composables/color'

// Directives
import { Ripple } from '@/directives/ripple'
import { useDirective } from '@/composables/directive'

// Utilities
import { computed, ref } from '@uni-store/core'
import {
  deepEqual,
  getUid,
  pick,
  propsFactory,
  SUPPORTS_FOCUS_VISIBLE,
  wrapInArray,
} from '@/util'

// Types
import type { ComputedRef, Ref, WritableComputedRef } from '@uni-store/core'

export type SelectionControlSlot = {
  model: WritableComputedRef<any>
  isReadonly: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  textColorClasses: Ref<string[]>
  props: {
    onBlur: (e: Event) => void
    onFocus: (e: FocusEvent) => void
    id: string
  }
}

export const makeSelectionControlProps = propsFactory({
  color: String,
  disabled: Boolean,
  error: Boolean,
  id: String,
  inline: Boolean,
  label: String,
  falseIcon: String,
  trueIcon: String,
  ripple: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
  name: String,
  readonly: Boolean,
  trueValue: {
    type: null,
  },
  falseValue: {
    type: null,
  },
  modelValue: {
    type: null,
  },
  type: String,
  value: {
    type: null,
  },
  valueComparator: {
    type: Function as PropType<typeof deepEqual>,
    default: deepEqual,
  },

  ...makeThemeProps(),
  ...makeDensityProps(),
  labelRender: Function as PropType<(
    scope: { label?: string, props: { for: string } }
  ) => UniNode | undefined>,
  inputRender: Function as PropType<(
    scope: {
      model: boolean
      textColorClasses: string
      props: { onFocus: (e: FocusEvent) => void, onBlur: () => void, id: string}
    }
  ) => UniNode | undefined>,
  'onUpdate:modelValue': Function as PropType<(val: any) => void>,
})

export function useSelectionControl (
  props: ExtractPropTypes<ReturnType<typeof makeSelectionControlProps>>,
  context: Context
) {
  const group = inject(VSelectionControlGroupSymbol, undefined)
  const { densityClasses } = useDensity(props)
  const modelValue = useProxiedModel(props, context, 'modelValue')
  const trueValue = computed(() => (
    props.trueValue !== undefined ? props.trueValue
    : props.value !== undefined ? props.value
    : true
  ))
  const falseValue = computed(() => props.falseValue !== undefined ? props.falseValue : false)
  const isMultiple = computed(() => (
    group?.multiple.value ||
    !!props.multiple ||
    (props.multiple == null && Array.isArray(modelValue.value))
  ))
  const model = computed({
    get () {
      const val = group ? group.modelValue.value : modelValue.value

      return isMultiple.value
        ? val.some((v: any) => props.valueComparator(v, trueValue.value))
        : props.valueComparator(val, trueValue.value)
    },
    set (val: boolean) {
      const currentValue = val ? trueValue.value : falseValue.value

      let newVal = currentValue

      if (isMultiple.value) {
        newVal = val
          ? [...wrapInArray(modelValue.value), currentValue]
          : wrapInArray(modelValue.value).filter((item: any) => !props.valueComparator(item, trueValue.value))
      }

      if (group) {
        group.modelValue.value = newVal
      } else {
        modelValue.value = newVal
      }
    },
  })
  const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
    return (
      model.value &&
      !props.error &&
      !props.disabled
    ) ? props.color : undefined
  }))
  const icon = computed(() => {
    return model.value
      ? group?.trueIcon.value ?? props.trueIcon
      : group?.falseIcon.value ?? props.falseIcon
  })

  return {
    group,
    densityClasses,
    trueValue,
    falseValue,
    model,
    textColorClasses,
    textColorStyles,
    icon,
  }
}

const UniVSelectionControl = uniComponent('v-selection-control', makeSelectionControlProps(), (name, props, context) => {
  const {
    densityClasses,
    group,
    icon,
    model,
    textColorClasses,
    textColorStyles,
    trueValue,
  } = useSelectionControl(props, context)
  const uid = getUid()
  const id = computed(() => props.id || `input-${uid}`)
  const isFocused = ref(false)
  const isFocusVisible = ref(false)
  const input = ref<HTMLInputElement>()
  const setInputEle = useRef(input)

  function onFocus (e: FocusEvent) {
    isFocused.value = true
    if (
      !SUPPORTS_FOCUS_VISIBLE ||
      (SUPPORTS_FOCUS_VISIBLE && (e.target as HTMLElement).matches(':focus-visible'))
    ) {
      isFocusVisible.value = true
    }
  }

  function onBlur () {
    isFocused.value = false
    isFocusVisible.value = false
  }

  const type = computed(() => group?.type.value ?? props.type)
  function onChange (e: Event) {
    const ele = e.target as HTMLInputElement
    const _type = type.value
    if (_type === 'checkbox' || _type === 'radio') {
      model.value = ele.checked
    } else {
      model.value = !!ele.value
    }
  }

  const rootClass = computed(() => {
    return [
      {
        [`${name}--dirty`]: model.value,
        [`${name}--disabled`]: props.disabled,
        [`${name}--error`]: props.error,
        [`${name}--focused`]: isFocused.value,
        [`${name}--focus-visible`]: isFocusVisible.value,
        [`${name}--inline`]: group?.inline.value || props.inline,
      },
      densityClasses.value,
      textColorClasses.value,
    ]
  })

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: !props.disabled && !props.readonly && props.ripple,
      modifiers: {
        center: true,
        circle: true,
      },
    }
  }))

  return {
    type,
    rootClass,
    input,
    setInputEle,
    id,
    group,
    icon,
    model,
    textColorStyles,
    textColorClasses,
    trueValue,
    rippleDirective,
    onFocus,
    onBlur,
    onChange,
  }
})

export const VSelectionControl = uni2Platform(UniVSelectionControl, (props, state, { renders }) => {
  const {
    type,
    rootClass,
    setInputEle,
    id,
    group,
    icon,
    model,
    textColorStyles,
    textColorClasses,
    trueValue,
    rippleDirective,
    onFocus,
    onBlur,
    onChange,
  } = state
  const label = props.labelRender
    ? props.labelRender({
      label: props.label,
      props: { for: id },
    })
    : props.label

  const modelAttrs: any = {
    onInput: onChange,
    onChange,
  }

  if (type === 'checkbox' || type === 'radio') {
    modelAttrs.checked = model
  }

  return (
    <div class={rootClass}>
      <div class="v-selection-control__wrapper">
        { renders.defaultRender?.() }
        <div
          class="v-selection-control__input"
          style={ textColorStyles }
          ref={rippleDirective ? rippleDirective.setEleRef : undefined}
        >
          { icon && <VIcon icon={ icon } /> }

          <input
            ref={ setInputEle }
            disabled={ props.disabled }
            id={ id }
            onBlur={ onBlur }
            onFocus={ onFocus }
            readonly={ props.readonly }
            type={ type }
            value={ trueValue.value }
            name={ group?.name ?? props.name }
            aria-checked={ type === 'checkbox' ? model : undefined }
            { ...modelAttrs }
            // { ...attrs }
          />

          { props.inputRender?.({
            model,
            textColorClasses,
            props: {
              onFocus,
              onBlur,
              id,
            },
          }) }
        </div>
      </div>

      <VLabel
        disabled={ props.disabled }
        error={ props.error }
        for={ id }
      >
        { label }
      </VLabel>
    </div>
  )
})

export function filterControlProps (props: ExtractPropTypes<ReturnType<typeof makeSelectionControlProps>>) {
  return pick(props, Object.keys(UniVSelectionControl.rawProps!) as any)
}
