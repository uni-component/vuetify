import type { PropType } from '@uni-component/core'
import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeTagProps } from '@/composables/tag'
import { makeTransitionProps, useTransition } from '@/composables/transition'
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import { Intersect } from '@/directives/intersect'
import { useDirective } from '@/composables/directive'

const UniVLazy = uniComponent('v-lazy', {
  modelValue: Boolean,
  options: {
    type: Object as PropType<IntersectionObserverInit>,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: undefined,
      rootMargin: undefined,
      threshold: undefined,
    }),
  },

  ...makeDimensionProps(),
  ...makeTagProps(),
  ...makeTransitionProps({ transition: 'fade-transition' }),
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
}, (name, props, context) => {
  const { dimensionStyles } = useDimension(props)
  const isActive = useProxiedModel(props, context, 'modelValue')

  function onIntersect (isIntersecting: boolean) {
    if (isActive.value) return

    isActive.value = isIntersecting
  }
  const intersectDirective = useDirective(Intersect, computed(() => {
    return {
      value: {
        handler: onIntersect,
        options: props.options,
      },
      modifiers: {
        once: !isActive.value,
      },
    }
  }))

  const lazyTransition = useTransition(isActive, props.transition as string | boolean)

  return {
    isActive,
    intersectDirective,
    dimensionStyles,
    lazyTransition,
  }
})

export const VLazy = uni2Platform(UniVLazy, (props, state, { renders }) => {
  const {
    rootClass,
    intersectDirective,
    dimensionStyles,
    lazyTransition,
  } = state
  return (
    <props.tag
      class={rootClass}
      ref={intersectDirective.setEleRef}
      style={ dimensionStyles }
    >
      <div ref={lazyTransition.setEleRef}>
        { renders.defaultRender?.() }
      </div>
    </props.tag>
  )
})
