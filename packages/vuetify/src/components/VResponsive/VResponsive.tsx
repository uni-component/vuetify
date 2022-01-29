import type { InjectionKey, PropType, UniNode } from '@uni-component/core'
import { classNames, h, provide, uni2Platform, uniComponent, useRef } from '@uni-component/core'

// Styles
import './VResponsive.sass'

// Composables
import { makeDimensionProps, useDimension } from '@/composables/dimensions'

// Utilities
import type { Ref } from '@uni-store/core'
import { computed, ref } from '@uni-store/core'

import { useDirective } from '@/composables/directive'
// Directives
import type { ObserveDirectiveBinding } from '@/directives/intersect'
import { Intersect } from '@/directives/intersect'

export function useAspectStyles (props: { aspectRatio?: string | number }) {
  return {
    aspectStyles: computed(() => {
      const ratio = Number(props.aspectRatio)

      return ratio
        ? { paddingBottom: String(1 / ratio * 100) + '%' }
        : undefined
    }),
  }
}

interface ResponsiveProvide {
  responsiveEl: Ref<HTMLDivElement | undefined>
}

export const VResponsiveSymbol = 'VResponsive' as any as InjectionKey<ResponsiveProvide>

const UniVResponsive = uniComponent('v-responsive', {
  aspectRatio: [String, Number],
  contentClass: String,

  ...makeDimensionProps(),

  additionalRender: Function as PropType<() => UniNode | undefined>,

  intersect: Object as PropType<ObserveDirectiveBinding>,
}, (name, props) => {
  const { dimensionStyles } = useDimension(props)
  const { aspectStyles } = useAspectStyles(props)
  const sizerClass = `${name}__sizer`
  const contentClass = computed(() => {
    return classNames([`${name}__content`, props.contentClass])
  })

  const ele = ref<HTMLDivElement>()
  const setEleRef = useRef(ele)

  provide(VResponsiveSymbol, {
    responsiveEl: ele,
  })

  let _setRef: undefined | typeof setRef
  const setRef = (ele: HTMLDivElement | undefined) => {
    setEleRef(ele)
    _setRef?.(ele)
  }
  if (props.intersect) {
    const { setEleRef } = useDirective(Intersect, computed(() => {
      return props.intersect as ObserveDirectiveBinding
    }))
    _setRef = setEleRef
  }

  return {
    setRef,
    dimensionStyles,
    aspectStyles,
    sizerClass,
    contentClass,
    responsiveEl: ele,
  }
})

export const VResponsive = uni2Platform(UniVResponsive, (props, state, { renders }) => {
  const { setRef, rootClass, dimensionStyles, aspectStyles, sizerClass, contentClass } = state
  const content = renders.defaultRender?.()
  return (
    <div class={ rootClass } style={ dimensionStyles } ref={setRef}>
      <div class={ sizerClass } style={ aspectStyles } />
      { props.additionalRender?.() }
      { content ? (
        <div class={ contentClass }>{ content }</div>
      ) : undefined }
    </div>
  )
})
