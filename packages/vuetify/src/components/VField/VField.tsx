import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  inject,
  onMounted,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

// Styles
import './VField.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VFieldLabel } from './VFieldLabel'

// Composables
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useFocus } from '@/composables/focus'
import { VExpandXTransition } from '@/composables/transitions'

// Utilities
import { computed, nextTick, ref, toRef, watch, watchEffect } from '@uni-store/core'
import {
  convertToUnit,
  getUid,
  nullifyTransforms,
  pick,
  propsFactory,
  standardEasing,
} from '@/util'

import type { VInputSlot } from '@/components/VInput/VInput'
import { VInputSymbol } from '@/components/VInput/VInput'
import type { LoaderSlotProps } from '@/composables/loader'

const allowedVariants = ['underlined', 'outlined', 'filled', 'contained', 'plain'] as const
type Variant = typeof allowedVariants[number]

export interface DefaultInputSlot {
  isActive: boolean
  isFocused: boolean
  setControlRef: (ele: HTMLElement | undefined) => void
  focus: () => void
  blur: () => void
}

export interface VFieldSlot extends DefaultInputSlot {
  props: Record<string, unknown>
}

export const makeVFieldProps = propsFactory({
  appendInnerIcon: String,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: String,
    default: '$clear',
  },
  color: String,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: String,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String as PropType<Variant>,
    default: 'filled',
    validator: (v: any) => allowedVariants.includes(v),
  },

  ...makeThemeProps(),
  ...makeLoaderProps(),
}, 'v-field')

const UniVField = uniComponent('v-field', {
  active: Boolean,
  disabled: Boolean,
  error: Boolean,
  id: String,
  modelValue: {
    type: null,
  },
  ...makeVFieldProps(),

  clearRender: Function as PropType<() => UniNode | undefined>,
  // todo DefaultInputSlot & VInputSlot
  prependInnerRender: Function as PropType<(scope?: VInputSlot) => UniNode | undefined>,
  appendInnerRender: Function as PropType<(scope?: VInputSlot) => UniNode | undefined>,
  labelRender: Function as PropType<(scope: {
    label?: string
    props: { for?: string}
  }) => UniNode | undefined>,
  loaderRender: Function as PropType<(scope: LoaderSlotProps) => UniNode | undefined>,
  defaultRender: Function as PropType<(scope: VFieldSlot) => UniNode | undefined>,

  'onClick:clear': Function as PropType<(e: Event) => void>,
  'onClick:prepend-inner': Function as PropType<(e: MouseEvent) => void>,
  'onClick:append-inner': Function as PropType<(e: MouseEvent) => void>,
  'onClick:control': Function as PropType<(props: DefaultInputSlot) => void>,
  'onUpdate:active': Function as PropType<(active: boolean) => void>,
  'onUpdate:modelValue': Function as PropType<(val: any) => void>,
}, (name, props, context) => {
  const { themeClasses } = provideTheme(props)
  const { loaderClasses } = useLoader(props)
  const isActive = useProxiedModel(props, context, 'active')
  const { isFocused, focus, blur } = useFocus()

  const uid = getUid()

  const labelRef = ref<HTMLElement>()
  const floatingLabelRef = ref<HTMLElement>()
  const fieldEle = ref<HTMLDivElement>()
  const setFieldEle = useRef(fieldEle)
  const outlineEle = ref<HTMLDivElement>()
  const setOutlineEle = useRef(outlineEle)

  const controlRef = ref<HTMLElement>()
  const setControlRef = useRef(controlRef)
  const id = computed(() => props.id || `input-${uid}`)
  const hasLabel = computed(() => !props.singleLine && !!(props.label || props.labelRender))

  const isOutlined = computed(() => props.variant === 'outlined')

  const isShowDefFloatingLabel = computed(() => ['contained', 'filled'].includes(props.variant) && hasLabel.value)
  const isShowOutlinedFloatingLabel = computed(() => isOutlined.value && hasLabel.value)
  const isShowPlainFloatingLabel = computed(() => ['plain', 'underlined'].includes(props.variant) && hasLabel.value)

  const setLabelRef = () => {
    const fieldEl = fieldEle.value!
    const labels = fieldEl.querySelectorAll('.v-field-label')
    if (labels.length > 1) {
      labelRef.value = labels[1] as HTMLElement
      floatingLabelRef.value = labels[0] as HTMLElement
    } else {
      labelRef.value = labels[0] as HTMLElement
      floatingLabelRef.value = undefined
    }

    // outline
    const outlineEl = outlineEle.value!
    const floatingLabels = outlineEl.querySelectorAll('.v-field-label')
    if (floatingLabels.length) {
      floatingLabelRef.value = floatingLabels[0] as HTMLElement
    }
  }

  watch(() => {
    return [
      isShowDefFloatingLabel.value,
      isShowOutlinedFloatingLabel.value,
      isShowPlainFloatingLabel.value,
    ]
  }, () => {
    // wait ui
    nextTick(setLabelRef)
  })

  onMounted(setLabelRef)

  watchEffect(() => isActive.value = isFocused.value)

  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
  const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
    return (
      isActive.value &&
      isFocused.value &&
      !props.error &&
      !props.disabled
    ) ? props.color : undefined
  }))

  watch(isActive, val => {
    if (hasLabel.value) {
      const el = labelRef.value
      const targetEl = floatingLabelRef.value
      if (!el || !targetEl) {
        return
      }
      const rect = nullifyTransforms(el)
      const targetRect = targetEl.getBoundingClientRect()

      const x = targetRect.x - rect.x
      const y = targetRect.y - rect.y - (rect.height / 2 - targetRect.height / 2)

      const targetWidth = targetRect.width / 0.75
      const width = Math.abs(targetWidth - rect.width) > 1
        ? { maxWidth: convertToUnit(targetWidth) }
        : undefined

      const duration = parseFloat(getComputedStyle(el).transitionDuration) * 1000
      const scale = parseFloat(getComputedStyle(targetEl).getPropertyValue('--v-field-label-scale'))

      el.style.visibility = 'visible'
      targetEl.style.visibility = 'hidden'

      el.animate([
        { transform: 'translate(0)' },
        { transform: `translate(${x}px, ${y}px) scale(${scale})`, ...width },
      ], {
        duration,
        easing: standardEasing,
        direction: val ? 'normal' : 'reverse',
      }).finished.then(() => {
        el.style.removeProperty('visibility')
        targetEl.style.removeProperty('visibility')
      })
    }
  }, { flush: 'post' })

  const slotProps = computed<DefaultInputSlot>(() => ({
    isActive: isActive.value,
    isFocused: isFocused.value,
    setControlRef,
    blur,
    focus,
  }))

  const onClick = (e: MouseEvent) => {
    if (e.target !== document.activeElement) {
      e.preventDefault()
    }

    props['onClick:control']?.(slotProps.value)
  }

  const VInput = inject(VInputSymbol)

  const hasPrepend = computed(() => (props.prependInnerRender || props.prependInnerIcon))
  const hasClear = computed(() => !!(props.clearable || props.clearRender))
  const hasAppend = computed(() => !!(props.appendInnerRender || props.appendInnerIcon || hasClear))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--active`]: isActive.value,
        [`${name}--appended`]: hasAppend.value,
        [`${name}--focused`]: isFocused.value,
        [`${name}--has-background`]: !!props.bgColor,
        [`${name}--persistent-clear`]: props.persistentClear,
        [`${name}--prepended`]: hasPrepend.value,
        [`${name}--reverse`]: props.reverse,
        [`${name}--single-line`]: props.singleLine,
        [`${name}--variant-${props.variant}`]: true,
      },
      themeClasses.value,
      loaderClasses.value,
      backgroundColorClasses.value,
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...textColorStyles.value,
    }
  })

  const fieldScope = computed(() => ({
    ...VInput?.value,
    ...slotProps.value,
    props: {
      id: id.value,
      class: 'v-field__input',
      // todo better performance
      // will be rerender 3 times
      onFocus: () => {
        isFocused.value = true
      },
      onBlur: () => {
        isFocused.value = false
      },
    },
    focus,
    blur,
  } as VFieldSlot))

  const clearableTransition = VExpandXTransition({
    model: computed(() => props.active),
  })

  return {
    rootClass,
    rootStyle,
    id,
    fieldScope,
    setFieldEle,

    VInput,

    hasPrepend,
    hasClear,
    hasAppend,
    isOutlined,
    setOutlineEle,
    isShowDefFloatingLabel,
    isShowOutlinedFloatingLabel,
    isShowPlainFloatingLabel,

    clearableTransition,

    onClick,
  }
})

export const VField = uni2Platform(UniVField, (props, state, { attrs, $attrs, renders }) => {
  const {
    rootClass,
    rootStyle,
    id,
    fieldScope,
    setFieldEle,

    VInput,

    hasPrepend,
    hasClear,
    hasAppend,
    isOutlined,
    setOutlineEle,
    isShowDefFloatingLabel,
    isShowOutlinedFloatingLabel,
    isShowPlainFloatingLabel,

    clearableTransition,

    onClick,
  } = state

  const label = props.labelRender
    ? props.labelRender({
      label: props.label,
      props: { for: id },
    })
    : props.label

  return (
    <div
      id={attrs.id}
      class={rootClass}
      style={rootStyle}
      onClick={ onClick }
      { ...$attrs }
    >
      <div class="v-field__overlay" />

      {
        LoaderSlot({
          name: 'v-field',
          active: props.loading,
          color: VInput ? (!VInput.isValid.value ? undefined : props.color) : props.color,
          defaultRender: props.loaderRender,
        })
      }

      { hasPrepend && (
        <div
          class="v-field__prepend-inner"
          onClick={ props['onClick:prepend-inner'] }
        >
          { props.prependInnerIcon && (
            <VIcon icon={ props.prependInnerIcon } />
          ) }

          { props?.prependInnerRender?.(VInput) }
        </div>
      ) }

      <div class="v-field__field" ref={setFieldEle}>
        {isShowDefFloatingLabel && (
          <VFieldLabel floating>
            { label }
          </VFieldLabel>
        ) }

        <VFieldLabel for={ id }>
          { label }
        </VFieldLabel>

        { (props.defaultRender || renders.defaultRender)?.(fieldScope) }
      </div>

      { hasClear && (
        <div
          class={classNames('v-field__clearable', clearableTransition.transtionClass)}
          style={clearableTransition.style}
          onTransitionEnd={clearableTransition.onTransitionEnd}
          onClick={ props['onClick:clear'] }
        >
          { props.clearRender
            ? props.clearRender()
            : <VIcon icon={ props.clearIcon } />
          }
        </div>
      ) }

      { hasAppend && (
        <div
          class="v-field__append-inner"
          onClick={ props['onClick:append-inner'] }
        >
          { props?.appendInnerRender?.(VInput) }

          { props.appendInnerIcon && (
            <VIcon icon={ props.appendInnerIcon } />
          ) }
        </div>
      ) }

      <div class="v-field__outline" ref={setOutlineEle}>
        { isOutlined && (
          <>
            <div class="v-field__outline__start" />

            { isShowOutlinedFloatingLabel && (
              <div class="v-field__outline__notch">
                <VFieldLabel floating>
                  { label }
                </VFieldLabel>
              </div>
            ) }

            <div class="v-field__outline__end" />
          </>
        ) }

        { isShowPlainFloatingLabel && (
          <VFieldLabel floating>
            { label }
          </VFieldLabel>
        ) }
      </div>
    </div>
  )
})

// TODO: this is kinda slow, might be better to implicitly inherit props instead
export function filterFieldProps (attrs: Record<string, unknown>) {
  return pick(attrs, Object.keys(VField.props))
}
