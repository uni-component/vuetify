import type { PropType, UniNode } from '@uni-component/core'
import { classNames, h, inject, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VSliderThumb.sass'

import { VSliderSymbol } from './slider'
import { useElevation } from '@/composables/elevation'

import Ripple from '@/directives/ripple'
import { useDirective } from '@/composables/directive'

import { useTextColor } from '@/composables/color'
import { VScaleTransition } from '@/composables/transitions'

import { computed } from '@uni-store/core'
import { convertToUnit, keyValues } from '@/util'

const UniVSliderThumb = uniComponent('v-slider-thumb', {
  focused: Boolean,
  max: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  'onUpdate:modelValue': Function as PropType<(v: number) => void>,
  position: {
    type: Number,
    required: true,
  },

  thumbLabelRender: Function as PropType<(scope: {
    modelValue: number
  }) => UniNode | undefined>,
}, (name, props) => {
  const slider = inject(VSliderSymbol)

  if (!slider) throw new Error('[Vuetify] v-slider-thumb must be used inside v-slider or v-range-slider')

  const {
    thumbColor,
    step,
    vertical,
    disabled,
    thumbSize,
    thumbLabel,
    direction,
    label,
    readonly,
    elevation,
    isReversed,
    horizontalDirection,
    mousePressed,
  } = slider

  const { textColorClasses, textColorStyles } = useTextColor(thumbColor)

  const { elevationClasses } = useElevation(computed(() => !disabled.value ? elevation.value : undefined))

  const { pageup, pagedown, end, home, left, right, down, up } = keyValues
  const relevantKeys = [pageup, pagedown, end, home, left, right, down, up]

  const multipliers = computed(() => {
    if (step.value) return [1, 2, 3]
    else return [1, 5, 10]
  })

  function parseKeydown (e: KeyboardEvent, value: number) {
    if (!relevantKeys.includes(e.key)) return

    e.preventDefault()

    const _step = step.value || 0.1
    const steps = (props.max - props.min) / _step
    if ([left, right, down, up].includes(e.key)) {
      const increase = isReversed.value ? [left, up] : [right, up]
      const direction = increase.includes(e.key) ? 1 : -1
      const multiplier = e.shiftKey ? 2 : (e.ctrlKey ? 1 : 0)

      value = value + (direction * _step * multipliers.value[multiplier])
    } else if (e.key === home) {
      value = props.min
    } else if (e.key === end) {
      value = props.max
    } else {
      const direction = e.key === pagedown ? 1 : -1
      value = value - (direction * _step * (steps > 100 ? steps / 10 : 10))
    }

    return Math.max(props.min, Math.min(props.max, value))
  }

  function onKeyDown (e: KeyboardEvent) {
    const newValue = parseKeydown(e, props.modelValue)

    newValue != null && props['onUpdate:modelValue']?.(newValue)
  }

  const rootClass = computed(() => {
    return {
      [`${name}--focused`]: props.focused,
      [`${name}--pressed`]: props.focused && mousePressed.value,
    }
  })
  const rootStyle = computed(() => {
    const positionPercentage = convertToUnit(vertical.value ? 100 - props.position : props.position, '%')
    const inset = vertical.value ? 'Block' : 'Inline'
    return {
      [`inset${inset}Start`]: `calc(${positionPercentage} - var(--v-slider-thumb-size) / 2)`,
      '--v-slider-thumb-size': convertToUnit(thumbSize.value),
      direction: !vertical.value ? horizontalDirection.value : undefined,
    }
  })

  const ripple = useDirective(Ripple, computed(() => {
    return {
      value: true,
      modifiers: {
        circle: true,
        center: true,
      },
    }
  }))

  const transition = VScaleTransition({
    model: computed(() => (thumbLabel.value && props.focused) || thumbLabel.value === 'always'),
    origin: 'bottom center',
  })

  return {
    rootClass,
    rootStyle,
    onKeyDown,
    disabled,
    label,
    readonly,
    direction,
    textColorClasses,
    textColorStyles,
    elevationClasses,
    ripple,
    transition,
  }
})

export const VSliderThumb = uni2Platform(UniVSliderThumb, (props, state, { renders, $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    onKeyDown,
    disabled,
    label,
    readonly,
    direction,
    textColorClasses,
    textColorStyles,
    elevationClasses,
    ripple,
    transition,
  } = state

  return (
    <div
      id={rootId}
      class={rootClass}
      style={rootStyle}
      role="slider"
      tabindex={ disabled ? -1 : 0 }
      aria-label={ label }
      aria-valuemin={ props.min }
      aria-valuemax={ props.max }
      aria-valuenow={ props.modelValue }
      aria-readonly={ readonly }
      aria-orientation={ direction }
      { ...$attrs }
      onKeyDown={ onKeyDown }
    >
      <div
        class={classNames([
          'v-slider-thumb__surface',
          textColorClasses,
          elevationClasses,
        ])}
        style={{
          ...textColorStyles,
        }}
      />
      <div
        class={classNames([
          'v-slider-thumb__ripple',
          textColorClasses,
        ])}
        style={ textColorStyles.value }
        ref={ripple.setEleRef}
      />
      <div
        ref={transition.setEleRef}
        class="v-slider-thumb__label-container"
      >
        <div
          class="v-slider-thumb__label"
        >
          <div>
            { props.thumbLabelRender?.({ modelValue: props.modelValue }) ?? props.modelValue.toFixed(1) }
          </div>
        </div>
      </div>
    </div>
  )
})
