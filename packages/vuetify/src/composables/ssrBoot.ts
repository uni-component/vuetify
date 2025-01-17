// Utilities
import { computed, onMounted, ref } from '@uni-component/core'

// Composables
export function useSsrBoot () {
  const isBooted = ref(false)

  onMounted(() => {
    window.requestAnimationFrame(() => {
      isBooted.value = true
    })
  })

  const ssrBootStyles = computed(() => !isBooted.value ? ({
    transition: 'none !important',
  }) : undefined)

  return { ssrBootStyles }
}
