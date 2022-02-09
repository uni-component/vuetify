import type { PropType } from '@uni-component/core'
import {
  Fragment,
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VTextField.sass'

// Components
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { filterFieldProps, makeVFieldProps, VField } from '@/components/VField/VField'
import { CounterRender, VCounter } from '@/components/VCounter'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import Intersect from '@/directives/intersect'
import { useDirective } from '@/composables/directive'

// Utilities
import { computed, ref } from '@uni-store/core'
import { filterInputAttrs } from '@/util'

// import { useForwardRef } from '@/composables/forwardRef'

const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month']

const UniVTextField = uniComponent('v-text-field', {
  autofocus: Boolean,
  counter: [Boolean, Number, String] as PropType<true | number | string>,
  counterValue: Function as PropType<(value: any) => number>,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  type: {
    type: String,
    default: 'text',
  },

  ...makeVInputProps(),
  ...makeVFieldProps(),

  counterRender: CounterRender,
}, (name, props, context) => {
  const model = useProxiedModel(props, context, 'modelValue')

  const internalDirty = ref(false)
  const setInternalDirty = (val: boolean) => {
    internalDirty.value = val
  }
  const isDirty = computed(() => {
    return internalDirty.value || !!model.value || dirtyTypes.includes(props.type)
  })

  const counterValue = computed(() => {
    return typeof props.counterValue === 'function'
      ? props.counterValue(model.value)
      : (model.value || '').toString().length
  })
  const max = computed(() => {
    if (context.attrs.maxlength) return context.attrs.maxlength as undefined

    if (
      !props.counter ||
      (typeof props.counter !== 'number' &&
      typeof props.counter !== 'string')
    ) return undefined

    return props.counter
  })

  function onIntersect (
    isIntersecting: boolean,
    entries: IntersectionObserverEntry[]
  ) {
    if (!props.autofocus || !isIntersecting) return

    (entries[0].target as HTMLInputElement)?.focus?.()
  }

  const isFocused = ref(false)
  const inputRef = ref<HTMLInputElement>()
  const intersectDirective = useDirective(Intersect, computed(() => {
    return {
      value: {
        handler: onIntersect,
      },
      modifiers: {
        once: true,
      },
    }
  }))
  const setInputRef = (ele: HTMLInputElement | undefined) => {
    inputRef.value = ele
    intersectDirective.setEleRef(ele)
  }

  function focus () {
    inputRef.value?.focus()
  }
  function blur () {
    inputRef.value?.blur()
  }
  function clear (e?: Event) {
    e?.stopPropagation()

    model.value = ''
  }
  function onInput (e: Event) {
    e.stopPropagation()
    const target = e.target as HTMLInputElement
    const val = target.value
    model.value = val
    context.$attrs.onInput?.(val)
  }
  function onChange (e: Event) {
    e.stopPropagation()
    const target = e.target as HTMLInputElement
    const val = target.value
    model.value = val
    context.$attrs.onChange?.(val)
  }
  function onFocus (e: FocusEvent) {
    isFocused.value = true
    context.$attrs.onFocus?.(e)
  }
  function onBlur (e: FocusEvent) {
    isFocused.value = false
    context.$attrs.onBlur?.(e)
  }

  // const vInputRef = ref<VInput>()
  // const vFieldRef = ref<VInput>()

  const rootClass = computed(() => {
    return {
      [`${name}--prefixed`]: props.prefix,
      [`${name}--suffixed`]: props.suffix,
    }
  })

  // return useForwardRef({
  //   focus,
  //   blur,
  // }, vInputRef, vFieldRef)

  return {
    rootClass,
    model,
    max,
    isDirty,
    counterValue,
    setInternalDirty,
    setInputRef,
    isFocused,
    focus,
    blur,
    clear,
    onInput,
    onChange,
    onFocus,
    onBlur,
  }
})

export const VTextField = uni2Platform(UniVTextField, (props, state, { renders, $attrs }) => {
  const hasCounter = !!(props.counterRender || props.counter || props.counterValue)
  const [rootAttrs, inputAttrs] = filterInputAttrs($attrs)
  const [inputProps] = filterInputProps(props)
  const [fieldProps] = filterFieldProps(props)
  const {
    rootId,
    rootClass,
    rootStyle,
    model,
    max,
    isDirty,
    counterValue,
    setInternalDirty,
    setInputRef,
    isFocused,
    focus,
    clear,
    onInput,
    onChange,
    onFocus,
    onBlur,
  } = state

  return (
    <VInput
      id={rootId}
      class={rootClass}
      style={rootStyle}
      focused={ isFocused }
      { ...rootAttrs }
      { ...inputProps }
      { ...renders }
      defaultRender={({ isDisabled, isReadonly }) => (
        <VField
          active={ isDirty }
          onUpdate:active={ setInternalDirty }
          onClick:control={ focus }
          onClick:clear={ clear }
          // @ts-expect-error
          role="textbox"
          { ...fieldProps }
          { ...renders }
          defaultRender={({ isActive, props: { class: fieldClass, ...slotProps } }) => {
            const showPlaceholder = isActive || props.persistentPlaceholder

            return (
              <>
                { props.prefix && (
                  <span class="v-text-field__prefix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                    { props.prefix }
                  </span>
                ) }

                <input
                  ref={ setInputRef }
                  class={ fieldClass as string }
                  style={{ opacity: showPlaceholder ? undefined : '0' }} // can't this just be a class?
                  value={ model }
                  autoFocus={ props.autofocus }
                  readOnly={ isReadonly.value }
                  disabled={ isDisabled.value }
                  placeholder={ props.placeholder }
                  size={ 1 }
                  type={ props.type }
                  { ...slotProps }
                  { ...inputAttrs }
                  onFocus={ e => {
                    onFocus(e)
                    ;(slotProps as any).onFocus(e)
                  }}
                  onBlur={ e => {
                    onBlur(e)
                    ;(slotProps as any).onBlur(e)
                  }}
                  onChange={ onChange }
                  onInput={ onInput }
                />

                { props.suffix && (
                  <span class="v-text-field__suffix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                    { props.suffix }
                  </span>
                ) }
              </>
            )
          }}
        />
      )}
      detailsRender={ hasCounter ? ({ isFocused }) => (
        <>
          <span />

          <VCounter
            active={ props.persistentCounter || isFocused.value }
            value={ counterValue }
            max={ max }
            defaultRender={ props.counterRender }
          />
        </>
      ) : undefined
      }
    />
  )
})
