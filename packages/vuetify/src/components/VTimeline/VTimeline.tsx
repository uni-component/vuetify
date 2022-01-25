import type { PropType } from '@uni-component/core'
import {
  h,
  provide,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VTimeline.sass'

// Components
import { VTimelineItem } from './VTimelineItem'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Helpers
import { computed, toRef } from '@uni-store/core'
import { convertToUnit } from '@/util'
import { VTimelineSymbol } from './shared'

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineSide = 'before' | 'after'

const UniVTimeline = uniComponent('v-timeline', {
  direction: {
    type: String as PropType<TimelineDirection>,
    default: 'vertical',
    validator: (v: any) => ['vertical', 'horizontal'].includes(v),
  },
  side: {
    type: String as PropType<TimelineSide>,
    validator: (v: any) => v == null || ['before', 'after'].includes(v),
  },
  lineInset: {
    type: [String, Number],
    default: 0,
  },
  lineThickness: {
    type: [String, Number],
    default: 2,
  },
  lineColor: String,
  truncateLine: {
    type: String as PropType<'none' | 'start' | 'end' | 'both'>,
    default: 'start',
    validator: (v: any) => ['none', 'start', 'end', 'both'].includes(v),
  },

  ...makeDensityProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { densityClasses } = useDensity(props)

  provide(VTimelineSymbol, {
    density: toRef(props, 'density'),
    lineColor: toRef(props, 'lineColor'),
  })

  const sideClass = computed(() => {
    const side = props.side ? props.side : props.density !== 'default' ? 'end' : null

    return side && `${name}--side-${side}`
  })

  const rootClass = computed(() => {
    return [
      `${name}--${props.direction}`,
      {
        [`${name}--inset-line`]: !!props.lineInset,
        [`${name}--truncate-line-end`]: props.truncateLine === 'end' || props.truncateLine === 'both',
      },
      themeClasses.value,
      densityClasses.value,
      sideClass.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      '--v-timeline-line-thickness': convertToUnit(props.lineThickness),
      '--v-timeline-line-inset': convertToUnit(props.lineInset || undefined),
    }
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VTimeline = uni2Platform(UniVTimeline, (props, state, { renders, $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
  } = state
  return (
    <props.tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
      {...$attrs}
    >
      { (props.truncateLine === 'none' || props.truncateLine === 'end') && (
        <VTimelineItem hideDot />
      ) }

      { renders.defaultRender?.() }
    </props.tag>
  )
})
