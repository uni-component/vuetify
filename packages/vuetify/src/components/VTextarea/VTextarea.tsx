import type { PropType } from '@uni-component/core'
import {
  classNames,
  computed,
  Fragment,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  uni2Platform,
  uniComponent,
  useRef,
  watch,
} from '@uni-component/core'

// Styles
import './VTextarea.sass'

// Components
import { filterFieldProps, makeVFieldProps } from '@/components/VField/VField'
import { CounterRender, VCounter } from '@/components/VCounter'
import { VField } from '@/components/VField'
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import Intersect from '@/directives/intersect'
import { useDirective } from '@/composables/directive'

// Utilities
import { convertToUnit, filterInputAttrs } from '@/util'

const UniVTextarea = uniComponent('v-textarea', {
  autoGrow: Boolean,
  autofocus: Boolean,
  counter: [Boolean, Number, String] as PropType<true | number | string>,
  counterValue: Function as PropType<(value: any) => number>,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  noResize: Boolean,
  rows: {
    type: [Number, String],
    default: 5,
    validator: (v: any) => !isNaN(parseFloat(v)),
  },
  maxRows: {
    type: [Number, String],
    validator: (v: any) => !isNaN(parseFloat(v)),
  },
  suffix: String,

  ...makeVInputProps(),
  ...makeVFieldProps(),

  counterRender: CounterRender,
}, (name, props, context) => {
  const model = useProxiedModel(props, context, 'modelValue')

  const controlHeight = ref('auto')
  const internalDirty = ref(false)
  const setInternalDirty = (val: boolean) => {
    internalDirty.value = val
  }
  const isDirty = computed(() => {
    return internalDirty.value || !!model.value
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

    (entries[0].target as HTMLTextAreaElement)?.focus?.()
  }

  // todo
  const isFocused = ref(false)
  const inputRef = ref<HTMLTextAreaElement>()

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
  const setInputRef = (ele: HTMLTextAreaElement | undefined) => {
    inputRef.value = ele
    intersectDirective.setEleRef(ele)
  }

  function focus () {
    inputRef.value?.focus()
  }
  function blur () {
    inputRef.value?.blur()
  }
  function onInput (e: Event) {
    e.stopPropagation()
    const target = e.target as HTMLTextAreaElement
    const val = target.value
    model.value = val
    context.$attrs.onInput?.(val)
  }
  function onChange (e: Event) {
    e.stopPropagation()
    const target = e.target as HTMLTextAreaElement
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
  function clear (e?: Event) {
    e?.stopPropagation()

    model.value = ''
  }

  const sizerRef = ref<HTMLTextAreaElement>()
  const setSizerRef = useRef(sizerRef)
  function calculateInputHeight () {
    if (!props.autoGrow) return

    nextTick(() => {
      if (!sizerRef.value) return

      const style = getComputedStyle(sizerRef.value)

      const padding = parseFloat(style.getPropertyValue('--v-field-padding-top')) +
      parseFloat(style.getPropertyValue('--v-field-padding-bottom'))

      const height = sizerRef.value.scrollHeight
      const lineHeight = parseFloat(style.lineHeight)
      const minHeight = parseFloat(props.rows) * lineHeight + padding
      const maxHeight = parseFloat(props.maxRows!) * lineHeight + padding || Infinity

      controlHeight.value = convertToUnit(Math.min(maxHeight, Math.max(minHeight, height ?? 0)))
    })
  }

  onMounted(calculateInputHeight)
  watch(model, calculateInputHeight)
  watch(() => props.rows, calculateInputHeight)
  watch(() => props.maxRows, calculateInputHeight)

  let observer: ResizeObserver | undefined
  watch(sizerRef, val => {
    if (val) {
      observer = new ResizeObserver(calculateInputHeight)
      observer.observe(sizerRef.value!)
    } else {
      observer?.disconnect()
    }
  })
  onUnmounted(() => {
    observer?.disconnect()
  })

  const rootClass = computed(() => {
    return [
      {
        [`${name}--prefixed`]: props.prefix,
        [`${name}--suffixed`]: props.suffix,
        [`${name}--auto-grow`]: props.autoGrow,
        [`${name}--no-resize`]: props.noResize || props.autoGrow,
      },
    ]
  })

  return {
    rootClass,
    model,
    max,
    isDirty,
    counterValue,
    setInternalDirty,
    controlHeight,
    setInputRef,
    focus,
    blur,
    clear,
    onInput,
    onChange,
    onFocus,
    onBlur,
    setSizerRef,
  }
})

export const VTextarea = uni2Platform(UniVTextarea, (props, state, { renders, $attrs }) => {
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
    controlHeight,
    setInputRef,
    focus,
    clear,
    onInput,
    onChange,
    onFocus,
    onBlur,
    setSizerRef,
  } = state

  return (
    <VInput
      id={rootId}
      class={rootClass}
      style={rootStyle}
      { ...rootAttrs }
      { ...inputProps }
      { ...renders }
      defaultRender={({ isDisabled, isReadonly }) => (
        <VField
          style={{
            '--v-input-control-height': controlHeight,
          }}
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
                  <span class="v-textarea__prefix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                    { props.prefix }
                  </span>
                ) }

                <textarea
                  ref={ setInputRef }
                  class={ fieldClass as string }
                  style={{ opacity: showPlaceholder ? undefined : '0' }} // can't this just be a class?
                  value={ model }
                  autoFocus={ props.autofocus }
                  readOnly={ isReadonly.value }
                  disabled={ isDisabled.value }
                  placeholder={ props.placeholder }
                  rows={ props.rows !== undefined ? Number(props.rows) : undefined }
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

                { props.autoGrow && (
                  <textarea
                    ref={ setSizerRef }
                    class={classNames([
                      fieldClass,
                      'v-textarea__sizer',
                    ])}
                    value={ model }
                    readOnly
                    aria-hidden="true"
                  />
                )}

                { props.suffix && (
                  <span class="v-textarea__suffix" style={{ opacity: showPlaceholder ? undefined : '0' }}>
                    { props.suffix }
                  </span>
                ) }
              </>
            )
          }}
        />
      )}
      detailsRender={hasCounter ? ({ isFocused }) => (
        <>
          <span />

          <VCounter
            active={ props.persistentCounter || isFocused.value }
            value={ counterValue }
            max={ max }
            defaultRender={ props.counterRender }
          />
        </>
      ) : undefined}
    />
  )
})
