import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  h,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

// Styles
import './VProgressLinear.sass'

// Composables
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useIntersectionObserver } from '@/composables/intersectionObserver'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useRtl } from '@/composables/rtl'
import { useTransition } from '@/composables/transition'

import { convertToUnit } from '@/util'
import { computed, toRef } from '@uni-store/core'

const UniVProgressLinear = uniComponent('v-progress-linear', {
  active: {
    type: Boolean,
    default: true,
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0,
  },
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4,
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100,
  },
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,

  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),

  'onUpdate:modelValue': Function as PropType<(value: number) => void>,

  defaultRender: Function as PropType<(scope: {
    value: number
    buffer: number
  }) => UniNode | undefined>,
}, (name, props, context) => {
  const progress = useProxiedModel(props, context, 'modelValue')
  const { isRtl } = useRtl()
  const { themeClasses } = provideTheme(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(computed(() => props.bgColor || props.color))
  const { backgroundColorClasses: barColorClasses, backgroundColorStyles: barColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { roundedClasses } = useRounded(props)
  const { intersectionRef, isIntersecting } = useIntersectionObserver()
  const setIntersectionRef = useRef(intersectionRef)

  const max = computed(() => parseInt(props.max, 10))
  const height = computed(() => parseInt(props.height, 10))
  const normalizedBuffer = computed(() => parseFloat(props.bufferValue) / max.value * 100)
  const normalizedValue = computed(() => parseFloat(progress.value) / max.value * 100)
  const isReversed = computed(() => isRtl.value !== props.reverse)

  const determinateTransition = useTransition(computed(() => !props.indeterminate), 'slide-x-transition')
  const indeterminateTransition = useTransition(computed(() => props.indeterminate), 'fade-transition')

  const opacity = computed(() => {
    return props.bgOpacity == null
      ? props.bgOpacity
      : parseFloat(props.bgOpacity)
  })

  function onClick (e: MouseEvent) {
    if (!intersectionRef.value) return

    const { left, right, width } = intersectionRef.value.getBoundingClientRect()
    const value = isReversed.value ? (width - e.clientX) + (right - width) : e.clientX - left

    progress.value = Math.round(value / width * max.value)
  }

  const rootClass = computed(() => {
    return [
      {
        [`${name}--active`]: props.active && isIntersecting.value,
        [`${name}--reverse`]: isReversed.value,
        [`${name}--rounded`]: props.rounded,
        [`${name}--rounded-bar`]: props.roundedBar,
        [`${name}--striped`]: props.striped,
      },
      roundedClasses.value,
      themeClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      height: props.active ? convertToUnit(height.value) : 0,
      '--v-progress-linear-height': convertToUnit(height.value),
    }
  })

  const streamClass = computed(() => {
    return classNames([
      `${name}__stream`,
      textColorClasses.value,
    ])
  })
  const streamStyle = computed(() => {
    return {
      ...textColorStyles.value,
      [isReversed.value ? 'left' : 'right']: convertToUnit(-height.value),
      borderTop: `${convertToUnit(height.value / 2)} dotted`,
      opacity: String(opacity.value),
      top: `calc(50% - ${convertToUnit(height.value / 4)})`,
      width: convertToUnit(100 - normalizedBuffer.value, '%'),
      '--v-progress-linear-stream-to': convertToUnit(height.value * (isReversed.value ? 1 : -1)),
    }
  })

  const backgroundClass = computed(() => {
    return classNames([
      `${name}__background`,
      backgroundColorClasses.value,
    ])
  })
  const backgroundStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      opacity: String(opacity.value),
      width: convertToUnit((!props.stream ? 100 : normalizedBuffer.value), '%'),
    }
  })

  const determinateClass = computed(() => {
    return classNames([
      `${name}__determinate`,
      barColorClasses.value,
    ])
  })
  const determinateStyle = computed(() => {
    return {
      ...barColorStyles.value,
      width: convertToUnit(normalizedValue.value, '%'),
    }
  })
  const indeterminateClass = computed(() => {
    return classNames([
      `${name}__indeterminate`,
    ])
  })
  const indeterminateStyle = computed(() => {
    return {
    }
  })

  return {
    rootClass,
    rootStyle,
    normalizedValue,
    normalizedBuffer,
    setIntersectionRef,
    onClick,
    streamClass,
    streamStyle,
    backgroundClass,
    backgroundStyle,
    indeterminateTransition,
    indeterminateClass,
    indeterminateStyle,
    determinateTransition,
    determinateClass,
    determinateStyle,
    barColorClasses,
    barColorStyles,
  }
})

export const VProgressLinear = uni2Platform(UniVProgressLinear, (props, state) => {
  const {
    rootClass,
    rootStyle,
    normalizedValue,
    normalizedBuffer,
    setIntersectionRef,
    onClick,
    streamClass,
    streamStyle,
    backgroundClass,
    backgroundStyle,
    indeterminateTransition,
    indeterminateClass,
    indeterminateStyle,
    determinateTransition,
    determinateClass,
    determinateStyle,
    barColorClasses,
    barColorStyles,
  } = state

  return (
    <props.tag
      ref={ setIntersectionRef }
      class={ rootClass }
      style={ rootStyle }
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax={ props.max }
      aria-valuenow={ props.indeterminate ? undefined : normalizedValue }
      onClick={ props.clickable ? onClick : undefined }
    >
      { props.stream && (
        <div
          class={ streamClass }
          style={ streamStyle }
        />
      ) }

      <div
        class={backgroundClass}
        style={backgroundStyle}
      />

      <div
        ref={determinateTransition.setEleRef}
        class={determinateClass}
        style={determinateStyle}
      />
      <div
        ref={indeterminateTransition.setEleRef}
        class={indeterminateClass}
        style={indeterminateStyle}
      >
        { ['long', 'short'].map(bar => (
          <div
            key={ bar }
            class={classNames([
              'v-progress-linear__indeterminate',
              bar,
              barColorClasses,
            ])}
            style={ barColorStyles }
          />
        )) }
      </div>

      { props.defaultRender && (
        <div class="v-progress-linear__content">
          { props.defaultRender({ value: normalizedValue, buffer: normalizedBuffer }) }
        </div>
      ) }
    </props.tag>
  )
})
