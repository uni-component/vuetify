import type { PropType, UniNode } from '@uni-component/core'
import { classNames, h, inject, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VSliderTrack.sass'

// Components
import { VSliderSymbol } from './slider'

// Composables
import { useBackgroundColor } from '@/composables/color'
import { useRounded } from '@/composables/rounded'

// Utilities
import { computed } from '@uni-store/core'
import { convertToUnit } from '@/util'

import type { Tick } from './slider'

const UniVSliderTrack = uniComponent('v-slider-track', {
  start: {
    type: Number,
    required: true,
  },
  stop: {
    type: Number,
    required: true,
  },
  tickLabelRender: Function as PropType<(scope: {
    tick: Tick
    index: number
  }) => UniNode | undefined>,
}, (name, props) => {
  const slider = inject(VSliderSymbol)

  if (!slider) throw new Error('[Vuetify] v-slider-track must be inside v-slider or v-range-slider')

  const {
    trackColor,
    trackFillColor,
    vertical,
    tickSize,
    showTicks,
    trackSize,
    color,
    rounded,
    parsedTicks,
    horizontalDirection,
  } = slider

  const { roundedClasses } = useRounded(rounded)

  const {
    backgroundColorClasses: trackFillColorClasses,
    backgroundColorStyles: trackFillColorStyles,
  } = useBackgroundColor(trackFillColor)

  const {
    backgroundColorClasses: trackColorClasses,
    backgroundColorStyles: trackColorStyles,
  } = useBackgroundColor(trackColor)

  const startDir = computed(() => `inset-${vertical.value ? 'block-end' : 'inline-start'}`)
  const endDir = computed(() => vertical.value ? 'height' : 'width')

  const backgroundStyles = computed(() => {
    return {
      [startDir.value]: '0%',
      [endDir.value]: '100%',
    }
  })

  const trackFillWidth = computed(() => props.stop - props.start)

  const trackFillStyles = computed(() => {
    return {
      [startDir.value]: convertToUnit(props.start, '%'),
      [endDir.value]: convertToUnit(trackFillWidth.value, '%'),
    }
  })

  const computedTicks = computed(() => {
    const ticks = vertical.value ? parsedTicks.value.slice().reverse() : parsedTicks.value

    return ticks.map((tick, index) => {
      const directionProperty = vertical.value ? 'inset-block-end' : 'margin-inline-start'
      return (
        <div
          key={ tick.value }
          class={classNames([
            `${name}__tick`,
            {
              [`${name}__tick--filled`]: tick.position >= props.start && tick.position <= props.stop,
            },
          ])}
          style={{
            [directionProperty]: (tick.position > 0 && tick.position < 100) ? convertToUnit(tick.position, '%') : undefined,
          }}
        >
          {
            (tick.label || props.tickLabelRender) && (
              <div class={`${name}__tick-label`}>
                { props.tickLabelRender?.({ tick, index }) ?? tick.label }
              </div>
            )
          }
        </div>
      )
    })
  })

  const rootClass = computed(() => {
    return roundedClasses.value
  })
  const rootStyle = computed(() => {
    return {
      '--v-slider-track-size': convertToUnit(trackSize.value),
      '--v-slider-tick-size': convertToUnit(tickSize.value),
      direction: !vertical.value ? horizontalDirection.value : undefined,
    }
  })

  const backgroundClass = computed(() => {
    return classNames([
      `${name}__background`,
      trackColorClasses.value,
      {
        [`${name}__background--opacity`]: !!color.value || !trackFillColor.value,
      },
    ])
  })
  const backgroundStyle = computed(() => {
    return {
      ...backgroundStyles.value,
      ...trackColorStyles.value,
    }
  })

  const fillClass = computed(() => {
    return classNames([
      `${name}__fill`,
      trackFillColorClasses.value,
    ])
  })
  const fillStyle = computed(() => {
    return {
      ...trackFillStyles.value,
      ...trackFillColorStyles.value,
    }
  })

  const ticksClass = computed(() => {
    return showTicks.value ? classNames([
      `${name}__ticks`,
      {
        [`${name}__ticks--always-show`]: showTicks.value === 'always',
      },
    ]) : ''
  })

  return {
    rootClass,
    rootStyle,
    backgroundClass,
    backgroundStyle,
    fillClass,
    fillStyle,
    showTicks,
    computedTicks,
    ticksClass,
  }
})

export const VSliderTrack = uni2Platform(UniVSliderTrack, (props, state) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    backgroundClass,
    backgroundStyle,
    fillClass,
    fillStyle,
    showTicks,
    computedTicks,
    ticksClass,
  } = state
  return (
    <div
      id={rootId}
      class={rootClass}
      style={rootStyle}
    >
      <div
        class={backgroundClass}
        style={backgroundStyle}
      />
      <div
        class={fillClass}
        style={fillStyle}
      />

      { showTicks && (
        <div
          class={ticksClass}
        >
          { computedTicks }
        </div>
      ) }
    </div>
  )
})
