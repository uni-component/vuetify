import { computed, h, provide, toRef, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VInput.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VMessages } from '@/components/VMessages'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeValidationProps, useValidation } from '@/composables/validation'

// Utilities
import { getUid, pick, propsFactory } from '@/util'

// Types
import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, Ref, UniNode } from '@uni-component/core'

export interface VInputSlot {
  id: ComputedRef<string>
  isDisabled: ComputedRef<boolean>
  isFocused: Ref<boolean>
  isReadonly: ComputedRef<boolean>
  isPristine: Ref<boolean>
  isValid: ComputedRef<boolean | null>
  isValidating: Ref<boolean>
  reset: () => void
  resetValidation: () => void
  validate: () => void
}

export const VInputSymbol = 'VInput' as any as InjectionKey<ComputedRef<VInputSlot>>

type RenderType = PropType<(scope: VInputSlot) => UniNode | undefined>

export const makeVInputProps = propsFactory({
  id: String,
  appendIcon: String,
  prependIcon: String,
  hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
  hint: String,
  messages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },
  persistentHint: Boolean,
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
    // validator: (v: any) => ['horizontal', 'vertical'].includes(v),
  },

  ...makeDensityProps(),
  ...makeValidationProps(),
  defaultRender: Function as RenderType,
  prependRender: Function as RenderType,
  appendRender: Function as RenderType,
  detailsRender: Function as RenderType,
  hintRender: Function as RenderType,
  messagesRender: Function as RenderType,
})

const UniVInput = uniComponent('v-input', {
  focused: Boolean,

  ...makeVInputProps(),

  // todo
  'onClick:prepend': Function as PropType<(e: MouseEvent) => void>,
  'onClick:append': Function as PropType<(e: MouseEvent) => void>,
}, (name, props) => {
  const { densityClasses } = useDensity(props)
  const {
    errorMessages,
    isDisabled,
    isReadonly,
    isPristine,
    isValid,
    isValidating,
    reset,
    resetValidation,
    validate,
    validationClasses,
  } = useValidation(props)

  const uid = getUid()
  const id = computed(() => props.id || `input-${uid}`)
  const isFocused = toRef(props, 'focused')

  const slotProps = computed<VInputSlot>(() => {
    return {
      id,
      isDisabled,
      isFocused,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
    }
  })

  provide(VInputSymbol, slotProps)

  const rootClass = computed(() => {
    return [
      `${name}--${props.direction}`,
      densityClasses.value,
      validationClasses.value,
    ]
  })

  return {
    rootClass,
    slotProps,
    isValid,
    validate,
    reset,
    resetValidation,
    errorMessages,
  }
})

export const VInput = uni2Platform(UniVInput, (props, state, { renders }) => {
  const hasPrepend = (props.prependRender || props.prependIcon)
  const hasAppend = (props.appendRender || props.appendIcon)
  const hasHint = !!(props.hintRender || props.hint)
  const hasMessages = !!(
    props.messagesRender ||
    props.messages?.length ||
    state.errorMessages.length
  )
  const hasDetails = !props.hideDetails || (
    props.hideDetails === 'auto' &&
    (hasMessages || hasHint)
  )
  const showMessages = hasMessages || (
    hasHint &&
    (props.persistentHint || props.focused)
  )
  const defaultContent = (props.defaultRender || renders.defaultRender)?.(state.slotProps)

  return (
    <div class={state.rootClass}>
      { hasPrepend && (
        <div
          class="v-input__prepend"
          onClick={ props['onClick:prepend'] }
        >
          { props.prependRender?.(state.slotProps) }

          { props.prependIcon && (
            <VIcon icon={ props.prependIcon } />
          ) }
        </div>
      ) }

      <div class="v-input__control">
        { defaultContent }
      </div>

      { hasAppend && (
        <div
          class="v-input__append"
          onClick={ props['onClick:append'] }
        >
          { props.appendRender?.(state.slotProps) }

          { props.appendIcon && (
            <VIcon icon={ props.appendIcon } />
          ) }
        </div>
      ) }

      { hasDetails && (
        <div class="v-input__details">
          <VMessages
            active={ showMessages }
            value={ state.errorMessages.length ? state.errorMessages : (hasMessages ? props.messages : props.hint) }
          >
            { props.messagesRender?.(state.slotProps) }
          </VMessages>

          { props.detailsRender?.(state.slotProps) }
        </div>
      ) }
    </div>
  )
})

export function filterInputProps (props: ExtractPropTypes<ReturnType<typeof makeVInputProps>>) {
  return pick(props, Object.keys(UniVInput.rawProps!) as any)
}
