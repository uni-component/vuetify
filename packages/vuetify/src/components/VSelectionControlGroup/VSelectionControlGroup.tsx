import { computed, h, provide, toRef, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VSelectionControlGroup.sass'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

import { getUid } from '@/util'

// Types
import type { InjectionKey, PropType, Ref } from '@uni-component/core'

export interface VSelectionGroupContext {
  disabled: Ref<boolean>
  inline: Ref<boolean>
  name: Ref<string | undefined>
  modelValue: Ref<any>
  multiple: Ref<boolean>
  trueIcon: Ref<string | undefined>
  falseIcon: Ref<string | undefined>
  readonly: Ref<boolean>
  type: Ref<string | undefined>
}

export const VSelectionControlGroupSymbol: InjectionKey<VSelectionGroupContext> = Symbol.for('vuetify:selection-control-group')

const UniVSelectionControlGroup = uniComponent('v-selection-control-group', {
  disabled: Boolean,
  id: String,
  inline: Boolean,
  name: String,
  falseIcon: String,
  trueIcon: String,
  multiple: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
  readonly: Boolean,
  type: String,
  modelValue: {
    type: null,
  },
  'onUpdate:modelValue': Function as PropType<(value: any) => void>,
}, (prefix, props, context) => {
  const modelValue = useProxiedModel(props, context, 'modelValue')
  const uid = getUid()
  const id = computed(() => props.id || `${prefix}-${uid}`)
  const name = computed(() => props.name || id.value)

  provide(VSelectionControlGroupSymbol, {
    disabled: toRef(props, 'disabled'),
    inline: toRef(props, 'inline'),
    modelValue,
    multiple: computed(() => !!props.multiple || (props.multiple == null && Array.isArray(modelValue.value))),
    name,
    falseIcon: toRef(props, 'falseIcon'),
    trueIcon: toRef(props, 'trueIcon'),
    readonly: toRef(props, 'readonly'),
    type: toRef(props, 'type'),
  })

  return {
    id,
  }
})

export const VSelectionControlGroup = uni2Platform(UniVSelectionControlGroup, (props, state, { renders }) => {
  return (
    <div
      class={state.rootClass}
      // aria-labelled-by={ props.type === 'radio' ? id.value : undefined }
      role={ props.type === 'radio' ? 'radiogroup' : undefined }
    >
      { renders.defaultRender?.() }
    </div>
  )
})
