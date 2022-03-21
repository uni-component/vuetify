import { classNames, computed, h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VAlert.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VBtn } from '@/components/VBtn'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeVariantProps, useVariant } from '@/composables/variant'
import { useBorder } from '@/composables/border'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useTextColor } from '@/composables/color'

// Types
import type { PropType, UniNode } from '@uni-component/core'

const allowedTypes = ['success', 'info', 'warning', 'error'] as const

type ContextualType = typeof allowedTypes[number]

const UniVAlert = uniComponent('v-alert', {
  border: [Boolean, String] as PropType<boolean | 'top' | 'end' | 'bottom' | 'start'>,
  borderColor: String,
  closable: Boolean,
  // todo
  closeIcon: {
    type: String,
    default: '$close',
  },
  // todo
  closeLabel: {
    type: String,
    default: '$vuetify.close',
  },
  icon: {
    type: [Boolean, String] as PropType<false | string>,
    default: null,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
  prominent: Boolean,
  sticky: Boolean,
  text: String,
  tip: Boolean,
  type: {
    type: String as PropType<ContextualType>,
    validator: (val: ContextualType) => allowedTypes.includes(val),
  },

  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps(),
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
  closeRender: Function as PropType<(scope: { props: { onClick: (e: MouseEvent) => void } }) => UniNode | undefined>,
  prependRender: Function as PropType<() => UniNode | undefined>,
}, (name, props, context) => {
  const borderProps = computed(() => ({
    border: props.border === true || props.tip ? 'start' : props.border,
  }))
  const isActive = useProxiedModel(props, context, 'modelValue')
  const icon = computed(() => {
    if (props.icon === false) return undefined
    if (!props.type) return props.icon

    return props.icon ?? `$${props.type}`
  })
  const variantProps = computed(() => ({
    color: props.color ?? props.type,
    textColor: props.textColor,
    variant: props.variant,
  }))

  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(borderProps.value)
  const { colorClasses, colorStyles, variantClasses } = useVariant(variantProps)
  const { densityClasses } = useDensity(props)
  const { elevationClasses } = useElevation(props)
  const { positionClasses, positionStyles } = usePosition(props)
  const { roundedClasses } = useRounded(props)
  const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
    return props.borderColor ?? (props.tip ? variantProps.value.color : undefined)
  }))

  const onCloseClick = (e: MouseEvent) => {
    isActive.value = false
  }
  const rootClass = computed(() => {
    return [
      {
        [`${name}--border-${borderProps.value.border}`]: borderProps.value.border,
        [`${name}--prominent`]: props.prominent,
        [`${name}--tip`]: props.tip,
      },
      themeClasses.value,
      borderClasses.value,
      !props.tip && colorClasses.value,
      densityClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
      variantClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...(!props.tip && colorStyles.value),
      ...positionStyles.value,
    }
  })

  const borderClass = computed(() => {
    return classNames([
      `${name}__border`,
      textColorClasses.value,
    ])
  })
  const borderStyle = computed(() => {
    return textColorStyles.value
  })

  return {
    isActive,
    rootClass,
    rootStyle,
    borderClass,
    borderStyle,
    borderProps,
    onCloseClick,
    textColorClasses,
    textColorStyles,
    icon,
  }
})

export const VAlert = uni2Platform(UniVAlert, (props, state, { renders }) => {
  const {
    isActive,
    rootClass,
    rootStyle,
    borderClass,
    borderStyle,
    borderProps,
    onCloseClick,
    textColorClasses,
    textColorStyles,
    icon,
  } = state
  const hasBorder = !!borderProps.border
  const hasClose = !!(props.closeRender || props.closable)
  const hasPrepend = !!(props.prependRender || props.icon || props.type)
  const hasText = !!(renders.defaultRender || props.text || hasClose)

  return isActive && (
    <props.tag
      class={rootClass}
      style={rootStyle}
      role="alert"
    >
      { hasBorder && (
        <div
          class={ borderClass }
          style={ borderStyle }
        />
      ) }

      <div class="v-alert__underlay" />

      <div class="v-alert__content">
        { hasPrepend && (
          <div class="v-alert__avatar">
            { props.prependRender
              ? props.prependRender()
              : (
                <VAvatar
                  class={ props.tip ? textColorClasses : undefined }
                  style={ props.tip ? textColorStyles : undefined }
                  density={ props.density }
                  icon={ icon }
                />
              )
            }
          </div>
        ) }

        { hasText && (
          <div class="v-alert__text">
            { renders.defaultRender?.() || props.text }

            { hasClose && (
              <div class="v-alert__close">
                { props.closeRender
                  ? props.closeRender({ props: { onClick: onCloseClick } })
                  : (
                    <VBtn
                      density={ props.density }
                      icon={ props.closeIcon }
                      variant="text"
                      onClick={ onCloseClick }
                    />
                  )
                }
              </div>
            ) }
          </div>
        ) }
      </div>
    </props.tag>
  )
})
