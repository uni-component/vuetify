// Composables
import { useForm } from '@/composables/form'

// Utilities
import { computed, onUnmounted, ref } from '@uni-component/core'
import { getCurrentInstanceName, getUid, propsFactory } from '@/util'

// Types
import type { PropType } from '@uni-component/core'

export type ValidationResult = string | true
export type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>)

export interface ValidationProps {
  disabled?: boolean
  error?: boolean
  errorMessages?: string | string[]
  maxErrors?: string | number
  name?: string
  readonly?: boolean
  rules: ValidationRule[]
  modelValue?: any
  'onUpdate:modelValue'?: (value: any) => void
}

export const makeValidationProps = propsFactory({
  disabled: Boolean,
  error: Boolean,
  errorMessages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },
  maxErrors: {
    type: [Number, String],
    default: 1,
  },
  name: String,
  readonly: Boolean,
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => ([]),
  },
  modelValue: {
    type: null,
  },
  'onUpdate:modelValue': Function as PropType<ValidationProps['onUpdate:modelValue']>,
})

export function useValidation (
  props: ValidationProps,
  name = getCurrentInstanceName(),
) {
  const form = useForm()
  const errorMessages = ref<string[]>([])
  const isPristine = ref(true)
  const isDisabled = computed(() => !!(props.disabled || form?.isDisabled.value))
  const isReadonly = computed(() => !!(props.readonly || form?.isReadonly.value))
  const isValid = computed(() => {
    if (
      props.error ||
      props.errorMessages?.length ||
      errorMessages.value.length
    ) return false

    return isPristine.value ? null : true
  })
  const isValidating = ref(false)
  const validationClasses = computed(() => {
    return {
      [`${name}--error`]: isValid.value === false,
      [`${name}--disabled`]: isDisabled.value,
      [`${name}--readonly`]: isReadonly.value,
    }
  })

  const uid = computed(() => props.name ?? getUid())

  form?.register(uid.value, validate, reset, resetValidation)

  onUnmounted(() => {
    form?.unregister(uid.value)
  })

  function reset () {
    resetValidation()

    props['onUpdate:modelValue']?.(null)
  }

  function resetValidation () {
    isPristine.value = true
    errorMessages.value = []
  }

  async function validate () {
    const results = []

    errorMessages.value = []
    isValidating.value = true

    for (const rule of props.rules) {
      if (results.length >= (props.maxErrors || 1)) {
        break
      }

      const handler = typeof rule === 'function' ? rule : () => rule
      const result = await handler(props?.modelValue?.value ?? props.modelValue)

      if (result === true) continue

      if (typeof result !== 'string') {
        // eslint-disable-next-line no-console
        console.warn(`${result} is not a valid value. Rule functions must return boolean true or a string.`)

        continue
      }

      results.push(result)
    }

    errorMessages.value = results
    isValidating.value = false
    isPristine.value = false

    return errorMessages.value
  }

  return {
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
  }
}
