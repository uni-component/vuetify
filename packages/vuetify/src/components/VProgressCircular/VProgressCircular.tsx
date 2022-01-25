import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  h,
  mergeStyle,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

// Styles
import './VProgressCircular.sass'

// Composables
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useIntersectionObserver } from '@/composables/intersectionObserver'
import { useTextColor } from '@/composables/color'

import { computed, toRef } from '@uni-store/core'
import { convertToUnit } from '@/util'

const MAGIC_RADIUS_CONSTANT = 20
const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT

const UniVProgressCircular = uniComponent('v-progress-circular', {
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String] as PropType<boolean | 'disable-shrink'>,
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  rotate: {
    type: [Number, String],
    default: 0,
  },
  width: {
    type: [Number, String],
    default: 4,
  },

  ...makeSizeProps(),
  ...makeTagProps({ tag: 'div' }),
  ...makeThemeProps(),
  defaultRender: Function as PropType<(scope: {
    value: number
  }) => UniNode | undefined>,
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { sizeClasses, sizeStyles } = useSize(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))
  const { textColorClasses: underlayColorClasses, textColorStyles: underlayColorStyles } = useTextColor(toRef(props, 'bgColor'))
  const { intersectionRef, isIntersecting } = useIntersectionObserver()
  const setRef = useRef(intersectionRef)

  const normalizedValue = computed(() => Math.max(0, Math.min(100, parseFloat(props.modelValue))))
  const width = computed(() => Number(props.width))
  const size = computed(() => {
    // Get size from element if size prop value is small, large etc
    return sizeStyles.value ? Number(props.size) : intersectionRef.value
      ? intersectionRef.value.getBoundingClientRect().width : Math.max(width.value, 32)
  })
  const diameter = computed(() => (MAGIC_RADIUS_CONSTANT / (1 - width.value / size.value)) * 2)
  const strokeWidth = computed(() => width.value / size.value * diameter.value)
  const strokeDashOffset = computed(() => convertToUnit(((100 - normalizedValue.value) / 100) * CIRCUMFERENCE))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--indeterminate`]: !!props.indeterminate,
        [`${name}--visible`]: isIntersecting.value,
        [`${name}--disable-shrink`]: props.indeterminate === 'disable-shrink',
      },
      themeClasses.value,
      sizeClasses.value,
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return mergeStyle(
      sizeStyles.value,
      textColorStyles.value
    )
  })
  return {
    rootClass,
    rootStyle,
    setRef,
    normalizedValue,
    diameter,
    strokeWidth,
    strokeDashOffset,
    underlayColorClasses,
    underlayColorStyles,
  }
})

export const VProgressCircular = uni2Platform(UniVProgressCircular, (props, state, { renders }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    setRef,
    normalizedValue,
    diameter,
    strokeWidth,
    strokeDashOffset,
    underlayColorClasses,
    underlayColorStyles,
  } = state

  const defRender = props.defaultRender || renders.defaultRender

  return (
    <props.tag
      ref={ setRef }
      id={rootId}
      class={rootClass}
      style={rootStyle}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={ props.indeterminate ? undefined : normalizedValue }
    >
      <svg
        style={{
          transform: `rotate(calc(-90deg + ${Number(props.rotate)}deg))`,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={ `0 0 ${diameter} ${diameter}` }
      >
        <circle
          class={classNames([
            'v-progress-circular__underlay',
            underlayColorClasses,
          ])}
          style={ underlayColorStyles }
          fill="transparent"
          cx="50%"
          cy="50%"
          r={ MAGIC_RADIUS_CONSTANT }
          stroke-width={ strokeWidth }
          stroke-dasharray={ CIRCUMFERENCE }
          stroke-dashoffset={ 0 }
        />

        <circle
          class="v-progress-circular__overlay"
          fill="transparent"
          cx="50%"
          cy="50%"
          r={ MAGIC_RADIUS_CONSTANT }
          stroke-width={ strokeWidth }
          stroke-dasharray={ CIRCUMFERENCE }
          stroke-dashoffset={ strokeDashOffset }
        />
      </svg>
      { defRender && (
        <div class="v-progress-circular__content">
          { defRender({ value: normalizedValue }) }
        </div>
      ) }
    </props.tag>
  )
})
