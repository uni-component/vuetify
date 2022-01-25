// Imports
import { ref } from '@uni-store/core'
import type { Ref } from '@uni-store/core'

export function useRefs <T extends {}> () {
  const refs = ref<(T | undefined)[]>([]) as Ref<(T | undefined)[]>

  const resetRefs = () => {
    refs.value = []
  }

  function updateRef (e: any, i: number) {
    refs.value[i] = e
  }

  return { refs, updateRef, resetRefs }
}
