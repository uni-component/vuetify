import type { PropType, UniNode } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VCard.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VImg } from '@/components/VImg'
import { VCardActions } from './VCardActions'
import { VCardAvatar } from './VCardAvatar'
import { VCardHeader } from './VCardHeader'
import { VCardHeaderText } from './VCardHeaderText'
import { VCardImg } from './VCardImg'
import { VCardSubtitle } from './VCardSubtitle'
import { VCardText } from './VCardText'
import { VCardTitle } from './VCardTitle'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
// import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'

// Directives
import { Ripple } from '@/directives/ripple'

import { useDirective } from '@/composables/directive'
import { computed } from '@uni-store/core'

const UniVCard = uniComponent('v-card', {
  appendAvatar: String,
  appendIcon: String,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: Boolean,
  prependAvatar: String,
  prependIcon: String,
  ripple: Boolean,
  subtitle: String,
  text: String,
  title: String,

  ...makeThemeProps(),
  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  // ...makeRouterProps(),
  ...makeTagProps(),
  ...makeVariantProps({ variant: 'contained' } as const),
  titleRender: Function as PropType<() => UniNode | undefined | string>,
  subtitleRender: Function as PropType<() => UniNode | undefined | string>,
  appendRender: Function as PropType<() => UniNode | undefined | string>,
  prependRender: Function as PropType<() => UniNode | undefined | string>,
  imageRender: Function as PropType<(scope: {src?: string}) => UniNode | undefined | string>,
  textRender: Function as PropType<() => UniNode | undefined | string>,
  mediaRender: Function as PropType<() => UniNode | undefined | string>,
  actionsRender: Function as PropType<() => UniNode | undefined | string>,
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
  // const link = useLink(props, attrs)

  // const isClickable = !props.disabled && (link.isClickable.value || props.link)
  const isClickable = computed(() => !props.disabled)

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: isClickable.value && props.ripple,
      modifiers: {},
    }
  }))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--disabled`]: props.disabled,
        [`${name}--flat`]: props.flat,
        [`${name}--hover`]: props.hover && !(props.disabled || props.flat),
        [`${name}--link`]: isClickable.value,
      },
      themeClasses.value,
      borderClasses.value,
      colorClasses.value,
      densityClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
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
  return {
    rootClass,
    rootStyle,
    isClickable,
    rippleDirective,
  }
})

export const VCard = uni2Platform(UniVCard, (props, state, { renders, $attrs }) => {
  const {
    rootClass,
    rootStyle,
    isClickable,
    rippleDirective,
  } = state
  // const Tag = (link.isLink.value) ? 'a' : props.tag
  const Tag = props.tag
  const hasTitle = !!(props.titleRender || props.title)
  const hasSubtitle = !!(props.subtitleRender || props.subtitle)
  const hasHeaderText = hasTitle || hasSubtitle
  const hasAppend = !!(props.appendRender || props.appendAvatar || props.appendIcon)
  const hasPrepend = !!(props.prependRender || props.prependAvatar || props.prependIcon)
  const hasImage = !!(props.imageRender || props.image)
  const hasHeader = hasHeaderText || hasPrepend || hasAppend
  const hasText = !!(props.textRender || props.text)

  return (
    <Tag
      id={state.rootId}
      class={rootClass}
      style={rootStyle}
      // href={ link.href.value }
      // onClick={ isClickable && link.navigate }
      onClick={props.onClick}
      ref={rippleDirective.setEleRef}
      {...$attrs}
    >
      { genOverlays(isClickable, 'v-card') }

      { hasImage && (
        <VCardImg>
          { props.imageRender
            ? props.imageRender?.({ src: props.image })
            : (<VImg src={ props.image } cover alt="" />)
          }
        </VCardImg>
      ) }

      { props.mediaRender?.() }

      { hasHeader && (
        <VCardHeader>
          { hasPrepend && (
            <VCardAvatar>
              { props.prependRender
                ? props.prependRender()
                : (
                  <VAvatar
                    density={ props.density }
                    icon={ props.prependIcon }
                    image={ props.prependAvatar }
                  />
                )
              }
            </VCardAvatar>
          ) }

          { hasHeaderText && (
            <VCardHeaderText>
              { hasTitle && (
                <VCardTitle>
                  { props.titleRender
                    ? props.titleRender()
                    : props.title
                  }
                </VCardTitle>
              ) }

              <VCardSubtitle>
                { props.subtitleRender
                  ? props.subtitleRender()
                  : props.subtitle
                }
              </VCardSubtitle>
            </VCardHeaderText>
          ) }

          { hasAppend && (
            <VCardAvatar>
              { props.appendRender
                ? props.appendRender()
                : (
                  <VAvatar
                    density={ props.density }
                    icon={ props.appendIcon }
                    image={ props.appendAvatar }
                  />
                )
              }
            </VCardAvatar>
          ) }
        </VCardHeader>
      ) }

      { hasText && (
        <VCardText>
          { props.textRender ? props.textRender() : props.text }
        </VCardText>
      ) }

      { renders.defaultRender?.() }

      { props.actionsRender && (
        <VCardActions>
          { props.actionsRender() }
        </VCardActions>
      ) }
    </Tag>
  )
})
