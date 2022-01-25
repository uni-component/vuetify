import { propsFactory } from '@/util'

// Utilities
import { computed, ref } from '@uni-store/core'
import { inject, provide } from '@uni-component/core'
import { useProxiedModel } from '@/composables/proxiedModel'

// Types
import type { ComputedRef, Ref, UnwrapRef } from '@uni-store/core'
import type { Context, InjectionKey, PropType, UniNode } from '@uni-component/core'

export interface FormProvide {
  register: (
    id: number | string,
    validate: () => Promise<string[]>,
    reset: () => void,
    resetValidation: () => void
  ) => void
  unregister: (id: number | string) => void
  items: Ref<FormField[]>
  isDisabled: ComputedRef<boolean>
  isReadonly: ComputedRef<boolean>
  isValidating: Ref<boolean>
}

interface FormField {
  id: number | string
  validate: () => Promise<string[]>
  reset: () => void
  resetValidation: () => void
}

interface FormValidationResult {
  id: number | string
  errorMessages: string[]
}

export const FormKey: InjectionKey<FormProvide> = Symbol.for('vuetify:form')

export interface FormProps {
  disabled: boolean
  fastFail: boolean
  lazyValidation: boolean
  readonly: boolean
  modelValue: boolean | null
  'onUpdate:modelValue'?: ((val: boolean | null) => void)
  onSubmit?: (e: Event) => void
  onReset?: (e: Event) => void
  onResetValidation?: () => void
}

export const makeFormProps = propsFactory({
  disabled: Boolean,
  fastFail: Boolean,
  lazyValidation: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
  'onUpdate:modelValue': Function as PropType<(val: boolean | null) => void>,
  onSubmit: Function as PropType<(e: Event) => void>,
  onReset: Function as PropType<(e: Event) => void>,
  onResetValidation: Function as PropType<() => void>,
  defaultRender: Function as PropType<(form: UnwrapRef<Form>) => UniNode | undefined>,
})

export type Form = ReturnType<typeof createForm>

export function createForm (props: FormProps, context: Context) {
  const model = useProxiedModel(props, context, 'modelValue')

  const isDisabled = computed(() => props.disabled)
  const isReadonly = computed(() => props.readonly)
  const isValidating = ref(false)
  const items = ref<FormField[]>([])
  const errorMessages = ref<FormValidationResult[]>([])

  async function submit (e: Event) {
    e.preventDefault()

    const results = []
    let valid = true

    errorMessages.value = []
    model.value = null
    isValidating.value = true

    for (const item of items.value) {
      const itemErrorMessages = await item.validate()

      if (itemErrorMessages.length > 0) {
        valid = false

        results.push({
          id: item.id,
          errorMessages: itemErrorMessages,
        })
      }

      if (!valid && props.fastFail) break
    }

    errorMessages.value = results
    model.value = valid
    isValidating.value = false

    props.onSubmit?.(e)
  }

  async function reset (e: Event) {
    e.preventDefault()

    items.value.forEach(item => item.reset())
    model.value = null

    props.onReset?.(e)
  }

  async function resetValidation () {
    items.value.forEach(item => item.resetValidation())
    errorMessages.value = []
    model.value = null

    props.onResetValidation?.()
  }

  provide(FormKey, {
    register: (id, validate, reset, resetValidation) => {
      items.value.push({
        id,
        validate,
        reset,
        resetValidation,
      })
    },
    unregister: id => {
      items.value = items.value.filter(item => {
        return item.id !== id
      })
    },
    isDisabled,
    isReadonly,
    isValidating,
    items,
  })

  return {
    errorMessages,
    isDisabled,
    isReadonly,
    isValidating,
    items,
    submit,
    reset,
    resetValidation,
  }
}

export function useForm () {
  return inject(FormKey, null)
}
