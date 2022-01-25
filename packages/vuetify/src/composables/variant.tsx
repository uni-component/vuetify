import { Fragment, h } from '@uni-component/core'

// Composables
import { useColor } from '@/composables/color'

// Utilities
import { computed, unref } from '@uni-store/core'
import { getCurrentInstanceName, propsFactory } from '@/util'

// Types
import type { PropType } from '@uni-component/core'
import type { MaybeRef } from '@/util'

export const allowedVariants = ['contained', 'outlined', 'plain', 'text', 'contained-text'] as const

export type Variant = typeof allowedVariants[number]

export interface VariantProps {
  color?: string
  textColor?: string
  variant: Variant
}

export function genOverlays (isClickable: boolean, name: string) {
  return (
    <>
      { isClickable && <div class={`${name}__overlay`} /> }

      <div class={`${name}__underlay`} />
    </>
  )
}

export const makeVariantProps = propsFactory({
  color: String,
  textColor: String,
  variant: {
    type: String as PropType<Variant>,
    default: 'contained',
    validator: (v: any) => allowedVariants.includes(v),
  },
}, 'variant')

export function useVariant (
  props: MaybeRef<VariantProps>,
  name = getCurrentInstanceName(),
) {
  const variantClasses = computed(() => {
    const { variant } = unref(props) as VariantProps
    return `${name}--variant-${variant}`
  })

  const { colorClasses, colorStyles } = useColor(computed(() => {
    const { textColor, variant, color } = unref(props) as VariantProps
    return {
      text: textColor,
      [variant === 'contained' ? 'background' : 'text']: color,
    }
  }))

  return { colorClasses, colorStyles, variantClasses }
}
