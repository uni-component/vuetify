// Utilities
import { computed, ref, watch } from '@uni-component/core'

// Types
import type { Ref } from '@uni-component/core'
import { propsFactory } from '@/util'

export const makeLazyProps = propsFactory({
  eager: Boolean,
}, 'lazy')

export function useLazy (props: { eager: boolean }, active: Ref<boolean>) {
  const isBooted = ref(false)
  const hasContent = computed(() => isBooted.value || props.eager || active.value)

  watch(active, () => isBooted.value = true)

  function onAfterLeave () {
    if (!props.eager) isBooted.value = false
  }

  return { isBooted, hasContent, onAfterLeave }
}
