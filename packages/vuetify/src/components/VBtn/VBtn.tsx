import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VBtn.sass'

// Components
import { VBtnToggleSymbol } from '@/components/VBtnToggle/VBtnToggle'
import { VIcon } from '@/components/VIcon'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
// import { makeRouterProps, useLink } from '@/composables/router'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'

import { useDirective } from '@/composables/directive'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { computed } from '@uni-store/core'

const UniVBtn = uniComponent('v-btn', {
  flat: Boolean,
  icon: [Boolean, String],
  prependIcon: String,
  appendIcon: String,

  block: Boolean,
  stacked: Boolean,

  ripple: {
    type: Boolean,
    default: true,
  },

  ...makeBorderProps(),
  ...makeRoundedProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makePositionProps(),
  href: String,
  // ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({ tag: 'button' }),
  ...makeThemeProps(),
  ...makeVariantProps({ variant: 'contained' } as const),
  onClick: Function as PropType<(e: MouseEvent) => void>,
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { colorClasses, colorStyles, variantClasses } = useVariant(props)
  const { densityClasses } = useDensity(props)
  const { dimensionStyles } = useDimension(props)
  const { elevationClasses } = useElevation(props)
  const { positionClasses, positionStyles } = usePosition(props)
  const { roundedClasses } = useRounded(props)
  const { sizeClasses } = useSize(props)
  const groupItem = useGroupItem(props, VBtnToggleSymbol, false)
  // const link = useLink(props, attrs)
  const isDisabled = computed(() => groupItem?.disabled.value || props.disabled)
  const isElevated = computed(() => {
    return props.variant === 'contained' && !(props.disabled || props.flat || props.border)
  })

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: !isDisabled.value && props.ripple,
      modifiers: {
        center: !!props.icon,
      },
    }
  }))

  const rootClass = computed(() => {
    return [
      groupItem?.selectedClass.value,
      {
        // 'v-btn--active': link.isExactActive?.value,
        'v-btn--block': props.block,
        'v-btn--disabled': isDisabled.value,
        'v-btn--elevated': isElevated.value,
        'v-btn--flat': props.flat,
        'v-btn--icon': !!props.icon,
        'v-btn--stacked': props.stacked,
      },
      themeClasses.value,
      borderClasses.value,
      colorClasses.value,
      densityClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
      sizeClasses.value,
      variantClasses.value,
    ]
  })

  const rootStyle = computed(() => {
    return {
      ...colorStyles.value,
      ...dimensionStyles.value,
      ...positionStyles.value,
    }
  })

  const onClick = (e: MouseEvent) => {
    // isDisabled.value || link.navigate || groupItem?.toggle
    if (!isDisabled.value) {
      groupItem?.toggle()
      props.onClick?.(e)
    }
  }

  return {
    rootClass,
    rootStyle,
    isDisabled,
    rippleDirective,
    onClick,
  }
})
export const VBtn = uni2Platform(UniVBtn, (props, state, { renders, $attrs }) => {
  const { rootClass, rootStyle, isDisabled, rippleDirective, onClick } = state
  // const Tag = (link.isLink.value) ? 'a' : props.tag
  const Tag = props.tag

  return (
    <Tag
      ref={rippleDirective.setEleRef}
      type={ Tag === 'a' ? undefined : 'button' }
      class={rootClass}
      style={rootStyle}
      disabled={ isDisabled || undefined }
      href={ props.href }
      onClick={ onClick }
      {...$attrs}
    >
      { genOverlays(true, 'v-btn') }

      { !props.icon && props.prependIcon && (
        <VIcon
          class="v-btn__icon"
          icon={ props.prependIcon }
          left={ !props.stacked }
        />
      ) }
      { typeof props.icon === 'boolean'
        ? renders.defaultRender?.()
        : (
          <VIcon
            class="v-btn__icon"
            icon={ props.icon }
            size={ props.size }
          />
        )
      }

      { !props.icon && props.appendIcon && (
        <VIcon
          class="v-btn__icon"
          icon={ props.appendIcon }
          right={ !props.stacked }
        />
      ) }
    </Tag>
  )
})
