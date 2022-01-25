import type { PropType, UniNode } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VBanner.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VBannerActions } from './VBannerActions'
import { VBannerAvatar } from './VBannerAvatar'
import { VBannerContent } from './VBannerContent'
import { VBannerText } from './VBannerText'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useDisplay } from '@/composables/display'
import { useTextColor } from '@/composables/color'

// Utilities
import { computed, toRef } from '@uni-store/core'

const UniVBanner = uniComponent('v-banner', {
  avatar: String,
  color: String,
  icon: String,
  lines: {
    type: String as PropType<'one' | 'two' | 'three'>,
    default: 'one',
  },
  sticky: Boolean,
  text: String,

  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  avatarRender: Function as PropType<() => UniNode | undefined>,
  textRender: Function as PropType<() => UniNode | undefined>,
  iconRender: Function as PropType<() => UniNode | undefined>,
  actionsRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { densityClasses } = useDensity(props)
  const { dimensionStyles } = useDimension(props)
  const { mobile } = useDisplay()
  const { elevationClasses } = useElevation(props)
  const { positionClasses, positionStyles } = usePosition(props)
  const { roundedClasses } = useRounded(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--mobile`]: mobile.value,
        [`${name}--sticky`]: props.sticky,
        [`${name}--${props.lines}-line`]: true,
      },
      borderClasses.value,
      densityClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
      textColorClasses.value,
      themeClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...dimensionStyles.value,
      ...positionStyles.value,
      ...textColorStyles.value,
    }
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VBanner = uni2Platform(UniVBanner, (props, state, { renders }) => {
  const hasAvatar = !!(props.avatar || props.icon || props.avatarRender || props.iconRender)
  const hasText = !!(props.text || props.textRender)
  const defaultContent = renders.defaultRender?.()
  const hasContent = hasAvatar || hasText || defaultContent

  return (
    <props.tag
      class={state.rootClass}
      style={state.rootStyle}
      role="banner"
    >
      { hasContent && (
        <VBannerContent>
          { hasAvatar && (
            <VBannerAvatar>
              { props.avatarRender
                ? props.avatarRender()
                : (
                  // todo icon render
                  <VAvatar
                    density={ props.density }
                    icon={ props.icon }
                    image={ props.avatar }
                  />
                )
              }
            </VBannerAvatar>
          ) }

          { hasText && (
            <VBannerText>
              { props.textRender ? props.textRender() : props.text }
            </VBannerText>
          ) }

          { defaultContent }
        </VBannerContent>
      ) }

      { props.actionsRender && (
        <VBannerActions>
          { props.actionsRender() }
        </VBannerActions>
      ) }
    </props.tag>
  )
})
