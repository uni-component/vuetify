// Composables
import { useProxiedModel } from './proxiedModel'

// Utilities
import { computed, inject, onMounted, onUnmounted, provide, reactive, toRef } from '@uni-component/core'
import { consoleWarn, deepEqual, getCurrentInstance, getUid, propsFactory, wrapInArray } from '@/util'

// Types
import type { Context, InjectionKey, PropType, Ref, UnwrapRef } from '@uni-component/core'
import type { ExtractPropTypes } from '@vue/runtime-core'

export interface GroupItem {
  id: number
  value: Ref<unknown>
  disabled: Ref<boolean | undefined>
}

export interface GroupProps {
  disabled?: boolean
  multiple?: boolean
  modelValue?: unknown
  mandatory?: boolean | 'force'
  max?: number
  selectedClass?: string
  'onUpdate:modelValue'?: (val: unknown) => void
}

export interface GroupProvide {
  register: (item: GroupItem) => void
  unregister: (id: number) => void
  select: (id: number, value: boolean) => void
  selected: Ref<any[]>
  isSelected: (id: number) => boolean
  prev: () => void
  next: () => void
  selectedClass: Ref<string | undefined>
  items: Ref<number[]>
  disabled: Ref<boolean | undefined>
}

export interface GroupItemProvide {
  id: number
  isSelected: Ref<boolean>
  toggle: () => void
  select: (value: boolean) => void
  selectedClass: Ref<string | undefined>
  value: Ref<unknown>
  disabled: Ref<boolean | undefined>
  group: GroupProvide
}

export const makeGroupProps = propsFactory({
  modelValue: {
    type: null,
    default: undefined,
  },
  multiple: Boolean,
  mandatory: [Boolean, String] as PropType<boolean | 'force'>,
  max: Number,
  selectedClass: String,
  disabled: Boolean,
  'onUpdate:modelValue': Function as PropType<(val: unknown) => void>,
}, 'group')

export const makeGroupItemProps = propsFactory({
  value: {
    type: null,
  },
  disabled: Boolean,
  selectedClass: String,
}, 'group-item')

type GroupItemProps = ExtractPropTypes<ReturnType<typeof makeGroupItemProps>>

// Composables
export function useGroupItem (
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>,
  required?: true,
): GroupItemProvide
export function useGroupItem (
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>,
  required: false,
): GroupItemProvide | null
export function useGroupItem (
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>,
  required = true,
): GroupItemProvide | null {
  const vm = getCurrentInstance('useGroupItem')

  if (!vm) {
    throw new Error(
      '[Vuetify] useGroupItem composable must be used inside a component setup function'
    )
  }

  const group = inject(injectKey, null)

  if (!group) {
    if (!required) return group

    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${injectKey.description}`)
  }

  const id = getUid()
  const value = toRef(props, 'value')
  const disabled = computed(() => group.disabled.value || props.disabled)

  group.register({
    id,
    value,
    disabled,
  })

  onUnmounted(() => {
    group.unregister(id)
  })

  const isSelected = computed(() => {
    return group.isSelected(id)
  })

  const selectedClass = computed(() => {
    const cls = isSelected.value && (group.selectedClass.value ?? props.selectedClass)
    return cls === false ? undefined : cls
  })

  return {
    id,
    isSelected,
    toggle: () => group.select(id, !isSelected.value),
    select: (value: boolean) => group.select(id, value),
    selectedClass,
    value,
    disabled,
    group,
  }
}

export function useGroup (
  props: GroupProps,
  injectKey: InjectionKey<GroupProvide>,
  context: Context
) {
  let isUnmounted = false
  const items = reactive<GroupItem[]>([])
  const selected = useProxiedModel(
    props,
    context,
    'modelValue',
    [],
    v => {
      if (v == null) return []

      return getIds(items, wrapInArray(v))
    },
    v => {
      const arr = getValues(items, v)

      return props.multiple ? arr : arr[0]
    }
  )

  function register (item: GroupItem) {
    // Is there a better way to fix this typing?
    const unwrapped = item as unknown as UnwrapRef<GroupItem>
    const id = unwrapped.id

    const index = items.findIndex(item => item.id === id)

    if (index > -1) items.splice(index, 0, unwrapped)
    else items.push(unwrapped)
  }

  function unregister (id: number) {
    if (isUnmounted) return

    // TODO: re-evaluate this line's importance in the future
    // should we only modify the model if mandatory is set.
    // selected.value = selected.value.filter(v => v !== id)

    forceMandatoryValue()

    const index = items.findIndex(item => item.id === id)
    items.splice(index, 1)
  }

  // If mandatory and nothing is selected, then select first non-disabled item
  function forceMandatoryValue () {
    const item = items.find(item => !item.disabled)
    if (item && props.mandatory === 'force' && !selected.value.length) {
      selected.value = [item.id]
    }
  }

  onMounted(() => {
    forceMandatoryValue()
  })

  onUnmounted(() => {
    isUnmounted = true
  })

  function select (id: number, isSelected: boolean) {
    const item = items.find(item => item.id === id)
    if (isSelected && item?.disabled) return

    if (props.multiple) {
      const internalValue = selected.value.slice()
      const index = internalValue.findIndex(v => v === id)

      // We can't remove value if group is
      // mandatory, value already exists,
      // and it is the only value
      if (
        props.mandatory &&
        index > -1 &&
        internalValue.length <= 1
      ) return

      // We can't add value if it would
      // cause max limit to be exceeded
      if (
        props.max != null &&
        index < 0 &&
        internalValue.length + 1 > props.max
      ) return

      if (index < 0 && isSelected) internalValue.push(id)
      else if (index >= 0 && !isSelected) internalValue.splice(index, 1)

      selected.value = internalValue
    } else {
      if (props.mandatory && selected.value.includes(id)) return

      selected.value = isSelected ? [id] : []
    }
  }

  function step (offset: number) {
    // getting an offset from selected value obviously won't work with multiple values
    if (props.multiple) consoleWarn('This method is not supported when using "multiple" prop')

    if (!selected.value.length) {
      const item = items.find(item => !item.disabled)
      item && (selected.value = [item.id])
    } else {
      const currentId = selected.value[0]
      const currentIndex = items.findIndex(i => i.id === currentId)

      let newIndex = (currentIndex + offset) % items.length
      let newItem = items[newIndex]

      while (newItem.disabled && newIndex !== currentIndex) {
        newIndex = (newIndex + offset) % items.length
        newItem = items[newIndex]
      }

      if (newItem.disabled) return

      selected.value = [items[newIndex].id]
    }
  }

  const state = {
    register,
    unregister,
    selected,
    select,
    disabled: toRef(props, 'disabled'),
    prev: () => step(items.length - 1),
    next: () => step(1),
    isSelected: (id: number) => selected.value.includes(id),
    selectedClass: computed(() => props.selectedClass),
    items: computed(() => items.map(({ id }) => id)),
  }

  provide(injectKey, state)

  return state
}

function getIds (items: UnwrapRef<GroupItem[]>, modelValue: any[]) {
  const ids = []
  for (const item of items) {
    if (item.value != null) {
      if (modelValue.find(value => deepEqual(value, item.value))) {
        ids.push(item.id)
      }
    } else if (modelValue.includes(item.id)) {
      ids.push(item.id)
    }
  }

  return ids
}

function getValues (items: UnwrapRef<GroupItem[]>, ids: any[]) {
  const values = []

  for (const item of items) {
    if (ids.includes(item.id)) {
      values.push(item.value != null ? item.value : item.id)
    }
  }

  return values
}
