import type { PropType, UniNode } from '@uni-component/core'
import { computed, h, ref, uni2Platform, uniComponent, useRef, watchEffect } from '@uni-component/core'

// Styles
import './VSlider.sass'

// Components
import { VInput } from '../VInput'
import { VSliderThumb } from './VSliderThumb'
import { VSliderTrack } from './VSliderTrack'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { useFocus } from '@/composables/focus'
import { makeSliderProps, useSlider } from './slider'

// Types
import { filterInputProps, makeVInputProps } from '@/components/VInput/VInput'

import type { Tick } from './slider'

const UniVSlider = uniComponent('v-slider', {
  ...makeSliderProps(),
  ...makeVInputProps(),

  modelValue: {
    type: [Number, String],
    default: 0,
  },
  'onUpdate:modelValue': Function as PropType<(v: number) => void>,

  tickLabelRender: Function as PropType<(scope: {
    tick: Tick
    index: number
  }) => UniNode | undefined>,
  thumbLabelRender: Function as PropType<(scope: {
    modelValue: number
  }) => UniNode | undefined>,
}, (name, props, context) => {
  const thumbContainerEle = ref<HTMLElement>()
  const setThumbContainerEle = useRef(thumbContainerEle)
  const slideContainerEle = ref<HTMLElement>()
  const setSliderContainerEle = (ele: HTMLElement | undefined) => {
    slideContainerEle.value = ele
  }

  const {
    min,
    max,
    mousePressed,
    roundValue,
    onSliderMouseDown,
    onSliderTouchStart,
    setTrackContainerEle,
    position,
    hasLabels,
  } = useSlider({
    props,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleSliderMouseUp: newValue => model.value = roundValue(newValue),
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleMouseMove: newValue => model.value = roundValue(newValue),
    getActiveThumb: () => thumbContainerEle.value,
  })

  watchEffect(() => {
    const ele = slideContainerEle.value
    if (ele) {
      setTrackContainerEle(ele.querySelector('.v-slider-track') as HTMLElement | undefined)
      setThumbContainerEle(ele.querySelector('.v-slider-thumb') as HTMLElement | undefined)
    } else {
      setTrackContainerEle(undefined)
      setThumbContainerEle(undefined)
    }
  })

  const model = useProxiedModel(
    props,
    context,
    'modelValue',
    undefined,
    v => {
      const value = typeof v === 'string' ? parseFloat(v) : v == null ? min.value : v

      return roundValue(value)
    },
  )
  const updateModel = (v: number) => (model.value = v)

  const focus = useFocus()
  const trackStop = computed(() => position(model.value))

  const rootClass = computed(() => {
    return {
      [`${name}--has-labels`]: !!props.tickLabelRender || hasLabels.value,
      [`${name}--focused`]: focus.isFocused.value,
      [`${name}--pressed`]: mousePressed.value,
      [`${name}--disabled`]: props.disabled,
    }
  })

  return {
    rootClass,
    focus,
    model,
    updateModel,
    trackStop,
    min,
    max,
    setSliderContainerEle,
    onSliderMouseDown,
    onSliderTouchStart,
  }
})

export const VSlider = uni2Platform(UniVSlider, (props, state, { renders }) => {
  const [inputProps, _] = filterInputProps(props)
  const {
    rootClass,
    focus,
    model,
    updateModel,
    trackStop,
    min,
    max,
    setSliderContainerEle,
    onSliderMouseDown,
    onSliderTouchStart,
  } = state

  return (
    <VInput
      class={rootClass}
      { ...inputProps }
      focused={ focus.isFocused }
      { ...renders }
      defaultRender={({ id }) => (
        <div
          ref={setSliderContainerEle}
          class="v-slider__container"
          onMouseDown={ onSliderMouseDown }
          onTouchStart={ onSliderTouchStart }
        >
          <input
            id={ id.value }
            name={ props.name || id.value }
            disabled={ props.disabled }
            readOnly
            tabIndex={-1}
            value={ model }
          />

          <VSliderTrack
            start={ 0 }
            stop={ trackStop }
            tickLabelRender={props.tickLabelRender}
          />

          <VSliderThumb
            focused={ focus.isFocused }
            min={ min }
            max={ max }
            modelValue={ model }
            onUpdate:modelValue={ updateModel }
            position={ trackStop }
            {...focus}
            thumbLabelRender={props.thumbLabelRender}
          />
        </div>
      )}
    />
  )
})
