import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  computed,
  h,
  inject,
  toRef,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Components
import { VIcon } from '@/components/VIcon'
import { VTimelineSymbol } from './shared'

// Composables
import { useBackgroundColor } from '@/composables/color'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeRoundedProps, useRounded } from '@/composables/rounded'

// Utilities

const UniVTimelineDivider = uniComponent('v-timeline-divider', {
  hideDot: Boolean,
  lineColor: String,
  icon: String,
  iconColor: String,
  fillDot: Boolean,
  dotColor: String,

  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeElevationProps(),
  defaultRender: Function as PropType<(scope: {
    icon: string | undefined
    iconColor: string | undefined
    size: string | number | undefined
  }) => UniNode | undefined>,
}, (name, props) => {
  const timeline = inject(VTimelineSymbol)

  if (!timeline) throw new Error('[Vuetify] Could not find v-timeline provider')

  const { sizeClasses, sizeStyles } = useSize(props, `${name}__dot`)
  const { backgroundColorStyles, backgroundColorClasses } = useBackgroundColor(toRef(props, 'dotColor'))
  const { backgroundColorStyles: lineColorStyles, backgroundColorClasses: lineColorClasses } = useBackgroundColor(timeline.lineColor)
  const { roundedClasses } = useRounded(props, `${name}__dot`)
  const { elevationClasses } = useElevation(props)

  const rootClass = computed(() => {
    return {
      [`${name}--fill-dot`]: props.fillDot,
    }
  })
  return {
    rootClass,
    roundedClasses,
    sizeClasses,
    sizeStyles,
    elevationClasses,
    backgroundColorClasses,
    backgroundColorStyles,
    lineColorClasses,
    lineColorStyles,
  }
})

export const VTimelineDivider = uni2Platform(UniVTimelineDivider, (props, state, { renders, $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    roundedClasses,
    sizeClasses,
    sizeStyles,
    elevationClasses,
    backgroundColorClasses,
    backgroundColorStyles,
    lineColorClasses,
    lineColorStyles,
  } = state
  return (
    <div
      id={rootId}
      class={rootClass}
      style={rootStyle}
      {...$attrs}
    >
      { !props.hideDot && (
        <div
          class={classNames([
            'v-timeline-divider__dot',
            roundedClasses,
            sizeClasses,
            elevationClasses,
          ])}
          // @ts-expect-error: null
          style={ sizeStyles }
        >
          <div
            class={classNames([
              'v-timeline-divider__inner-dot',
              roundedClasses,
              backgroundColorClasses,
            ])}
            style={ backgroundColorStyles }
          >
            {
              props.defaultRender ? props.defaultRender({ icon: props.icon, iconColor: props.iconColor, size: props.size })
              : props.icon ? <VIcon icon={ props.icon } color={ props.iconColor } size={ props.size } />
              : undefined
            }
          </div>
        </div>
      ) }
      <div
        class={classNames([
          'v-timeline-divider__line',
          lineColorClasses,
        ])}
        style={ lineColorStyles }
      />
    </div>
  )
})
