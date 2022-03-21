import type { UniNode } from '@uni-component/core'
import { computed, h } from '@uni-component/core'

// Components
import { VProgressLinear } from '@/components/VProgressLinear'

// Utilities
import { getCurrentInstanceName, propsFactory } from '@/util'

export interface LoaderSlotProps {
  color: string | undefined
  isActive: boolean
}

export interface LoaderProps {
  loading: boolean
}

// Composables
export const makeLoaderProps = propsFactory({
  loading: Boolean,
}, 'loader')

export function useLoader (
  props: LoaderProps,
  name = getCurrentInstanceName(),
) {
  const loaderClasses = computed(() => ({
    [`${name}--loading`]: props.loading,
  }))

  return { loaderClasses }
}

export function LoaderSlot (
  props: {
    active: boolean
    name: string
    color?: string
    defaultRender?: (scope: LoaderSlotProps) => UniNode | undefined
  }
) {
  return (
    <div class={`${props.name}__loader`}>
      { props.defaultRender?.({
        color: props.color,
        isActive: props.active,
      }) || (
        <VProgressLinear
          active={ props.active }
          color={ props.color }
          height="2"
          indeterminate
        />
      )}
    </div>
  )
}
