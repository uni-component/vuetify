import type { PropType, UniNode } from '@uni-component/core'
import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VChip.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VIcon } from '@/components/VIcon'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
// todo router
// import { makeRouterProps, useLink } from '@/composables/router'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useDirective } from '@/composables/directive'

// Directives
import { Ripple } from '@/directives/ripple'

const UniVChip = uniComponent('v-chip', {
  activeClass: String,
  appendAvatar: String,
  appendIcon: String,
  closable: Boolean,
  closeIcon: {
    type: String,
    default: '$delete',
  },
  closeLabel: {
    type: String,
    default: '$vuetify.close',
  },
  disabled: Boolean,
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: String,
    default: '$complete',
  },
  label: Boolean,
  link: Boolean,
  pill: Boolean,
  prependAvatar: String,
  prependIcon: String,
  ripple: {
    type: Boolean,
    default: true,
  },
  text: String,
  modelValue: {
    type: Boolean,
    default: true,
  },

  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  // ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({ tag: 'span' }),
  ...makeThemeProps(),
  ...makeVariantProps({ variant: 'contained' } as const),

  appendRender: Function as PropType<() => UniNode | undefined>,
  closeRender: Function as PropType<(scope: {props: { onClick: (e: MouseEvent) => void }}) => UniNode | undefined>,
  prependRender: Function as PropType<() => UniNode | undefined>,

  'onClick:close': Function as PropType<(e: Event) => void>,
  'onUpdate:active': Function as PropType<(value: Boolean) => void>,
  'onUpdate:modelValue': Function as PropType<(value: Boolean) => void>,
}, (name, props, context) => {
  const isActive = useProxiedModel(props, context, 'modelValue')

  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { colorClasses, colorStyles, variantClasses } = useVariant(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)
  const { sizeClasses } = useSize(props)
  const { densityClasses } = useDensity(props)
  // const link = useLink(props, attrs)

  // const isClickable = computed(() => !props.disabled && (link.isClickable.value || props.link))
  const isClickable = computed(() => !props.disabled && props.link)

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: isClickable.value && props.ripple,
      modifiers: {},
    }
  }))

  function onCloseClick (e: MouseEvent) {
    isActive.value = false
    props['onClick:close']?.(e)
  }

  const rootClass = computed(() => {
    return [
      {
        [`${name}--disabled`]: props.disabled,
        [`${name}--label`]: props.label,
        [`${name}--link`]: isClickable.value,
        [`${name}--pill`]: props.pill,
      },
      themeClasses.value,
      borderClasses.value,
      colorClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
      sizeClasses.value,
      variantClasses.value,
    ]
  })
  const rootStyle = colorStyles

  return {
    rootClass,
    rootStyle,
    isActive,
    isClickable,
    rippleDirective,
    onCloseClick,
  }
})

export const VChip = uni2Platform(UniVChip, (props, state, { renders }) => {
  // const Tag = (link.isLink.value) ? 'a' : props.tag
  const Tag = props.tag
  const hasAppend = !!(props.appendRender || props.appendIcon || props.appendAvatar)
  const hasClose = !!(props.closeRender || props.closable)
  const hasPrepend = !!(props.prependRender || props.prependIcon || props.prependAvatar)
  const {
    rootClass,
    rootStyle,
    isActive,
    isClickable,
    rippleDirective,
    onCloseClick,
  } = state

  return isActive && (
    <Tag
      class={rootClass}
      style={ rootStyle }
      disabled={ props.disabled || undefined }
      draggable={ props.draggable }
      // href={ link.href.value }
      ref={rippleDirective.setEleRef}
      // onClick={ isClickable && link.navigate }
    >
      { genOverlays(isClickable, 'v-chip') }

      { hasPrepend && (
        <div class="v-chip__prepend">
          { props.prependRender
            ? props.prependRender()
            : (
              <VAvatar
                icon={ props.prependIcon }
                image={ props.prependAvatar }
                size={ props.size }
              />
            )
          }
        </div>
      ) }

      { renders.defaultRender?.() ?? props.text }

      { hasAppend && (
        <div class="v-chip__append">
          { props.appendRender
            ? props.appendRender()
            : (
              <VAvatar
                icon={ props.appendIcon }
                image={ props.appendAvatar }
                size={ props.size }
              />
            )
          }
        </div>
      ) }

      { hasClose && (
        <div
          class="v-chip__close"
          onClick={ onCloseClick }
        >
          { props.closeRender
            ? props.closeRender({ props: { onClick: onCloseClick } })
            : (
              <VIcon
                icon={ props.closeIcon }
                size="x-small"
              />
            )
          }
        </div>
      ) }
    </Tag>
  )
})
