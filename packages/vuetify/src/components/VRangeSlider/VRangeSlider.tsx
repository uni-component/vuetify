import { computed, h, ref, uni2Platform, uniComponent, useRef, watchEffect } from '@uni-component/core'

// Components
import { VInput } from '../VInput'
import { VSliderThumb } from '../VSlider/VSliderThumb'
import { VSliderTrack } from '../VSlider/VSliderTrack'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { getOffset, makeSliderProps, useSlider } from '../VSlider/slider'
import { useFocus } from '@/composables/focus'

// Utilities

import type { Tick } from '../VSlider/slider'
import type { PropType, UniNode, WritableComputedRef } from '@uni-component/core'
import { filterInputProps, makeVInputProps } from '../VInput/VInput'

const UniVRangeSlider = uniComponent('v-range-slider', {
  ...makeVInputProps(),
  ...makeSliderProps(),

  modelValue: {
    type: Array as PropType<number[]>,
    default: () => ([0, 0]),
  },
  'onUpdate:modelValue': Function as PropType<(value: [number, number]) => void>,

  tickLabelRender: Function as PropType<(scope: {
    tick: Tick
    index: number
  }) => UniNode | undefined>,
  thumbLabelRender: Function as PropType<(scope: {
    modelValue: number
  }) => UniNode | undefined>,
}, (_, props, context) => {
  const focusedThumbEle = ref<HTMLElement>()
  const startThumbContainerEle = ref<HTMLElement>()
  const setStartThumbContainerEle = useRef(startThumbContainerEle)
  const stopThumbContainerEle = ref<HTMLElement>()
  const setStopThumbContainerEle = useRef(stopThumbContainerEle)
  const slideContainerEle = ref<HTMLElement>()
  const setSliderContainerEle = (ele: HTMLElement | undefined) => {
    slideContainerEle.value = ele
  }

  let canSwitch = false
  function getActiveThumb (e: MouseEvent | TouchEvent) {
    if (!startThumbContainerEle.value || !stopThumbContainerEle.value) return

    canSwitch = true

    const startOffset = getOffset(e, startThumbContainerEle.value, props.direction)
    const stopOffset = getOffset(e, stopThumbContainerEle.value, props.direction)

    const a = Math.abs(startOffset)
    const b = Math.abs(stopOffset)

    return (a < b || (a === b && startOffset < 0)) ? startThumbContainerEle.value : stopThumbContainerEle.value
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
    /* eslint-disable @typescript-eslint/no-use-before-define */
    props,
    handleSliderMouseUp: newValue => {
      model.value = focusedThumbEle.value === startThumbContainerEle.value ? [newValue, model.value[1]] : [model.value[0], newValue]
    },
    handleMouseMove: newValue => {
      if (focusedThumbEle.value === startThumbContainerEle.value) {
        model.value = [Math.min(newValue, model.value[1]), model.value[1]]
      } else {
        model.value = [model.value[0], Math.max(model.value[0], newValue)]
      }
      if (canSwitch && model.value[0] === model.value[1]) {
        focusedThumbEle.value = newValue > model.value[0] ? stopThumbContainerEle.value : startThumbContainerEle.value
      }
      canSwitch = false
    },
    getActiveThumb,
    /* eslint-enable @typescript-eslint/no-use-before-define */
  })

  watchEffect(() => {
    const ele = slideContainerEle.value
    if (ele) {
      console.log('ref container ele set', ele)
      setTrackContainerEle(ele.querySelector('.v-slider-track') as HTMLElement | undefined)
      const thumbs = ele.querySelectorAll('.v-slider-thumb')
      setStartThumbContainerEle(thumbs[0] as HTMLElement | undefined)
      setStopThumbContainerEle(thumbs[1] as HTMLElement | undefined)
    } else {
      setTrackContainerEle(undefined)
      setStartThumbContainerEle(undefined)
      setStopThumbContainerEle(undefined)
    }
  })

  const model = useProxiedModel(
    props,
    context,
    'modelValue',
    undefined,
    arr => {
      if (!arr || !arr.length) return [0, 0]

      return arr.map(value => roundValue(value))
    },
  ) as WritableComputedRef<[number, number]>
  const updateStartModel = (v: number) => (model.value = [v, model.value[1]])
  const updateStopModel = (v: number) => (model.value = [model.value[0], v])

  const { isFocused, focus, blur } = useFocus()
  const startThumpFocusEvents = {
    onFocus: (e: FocusEvent) => {
      focus()
      focusedThumbEle.value = startThumbContainerEle.value

      // Make sure second thumb is focused if
      // the thumbs are on top of each other
      // and they are both at minimum value
      // but only if focused from outside.
      if (
        model.value[0] === model.value[1] &&
        model.value[1] === min.value &&
        e.relatedTarget !== stopThumbContainerEle.value
      ) {
        (stopThumbContainerEle.value as any)?.focus()
      }
    },
    onBlur: () => {
      blur()
      focusedThumbEle.value = undefined
    },
  }
  const stopThumpFocusEvents = {
    onFocus: (e: FocusEvent) => {
      focus()
      focusedThumbEle.value = stopThumbContainerEle.value

      // Make sure first thumb is focused if
      // the thumbs are on top of each other
      // and they are both at maximum value
      // but only if focused from outside.
      if (
        model.value[0] === model.value[1] &&
        model.value[0] === max.value &&
        e.relatedTarget !== startThumbContainerEle.value
      ) {
        (startThumbContainerEle.value as any)?.focus()
      }
    },
    onBlur: () => {
      blur()
      focusedThumbEle.value = undefined
    },
  }

  const trackStart = computed(() => position(model.value[0]))
  const trackStop = computed(() => position(model.value[1]))

  const rootClass = computed(() => {
    return [
      'v-slider',
      {
        'v-slider--has-labels': !!props.tickLabelRender || hasLabels.value,
        'v-slider--focused': isFocused.value,
        'v-slider--pressed': mousePressed.value,
        'v-slider--disabled': props.disabled,
      },
    ]
  })

  return {
    rootClass,
    model,
    updateStartModel,
    updateStopModel,
    isFocused,
    startThumpFocusEvents,
    stopThumpFocusEvents,
    trackStart,
    trackStop,
    min,
    max,
    onSliderMouseDown,
    onSliderTouchStart,
    setSliderContainerEle,
    startThumbContainerEle,
    stopThumbContainerEle,
    focusedThumbEle,
  }
})

export const VRangeSlider = uni2Platform(UniVRangeSlider, (props, state, { renders }) => {
  const [inputProps, _] = filterInputProps(props)
  const {
    rootId,
    rootClass,
    rootStyle,
    model,
    updateStartModel,
    updateStopModel,
    isFocused,
    startThumpFocusEvents,
    stopThumpFocusEvents,
    trackStart,
    trackStop,
    min,
    max,
    onSliderMouseDown,
    onSliderTouchStart,
    setSliderContainerEle,
    startThumbContainerEle,
    stopThumbContainerEle,
    focusedThumbEle,
  } = state

  return (
    <VInput
      id={rootId}
      class={rootClass}
      style={rootStyle}
      { ...inputProps }
      focused={ isFocused }
      { ...renders }
      defaultRender={({ id }) => (
        <div
          ref={setSliderContainerEle}
          class="v-slider__container"
          onMouseDown={ onSliderMouseDown }
          onTouchStart={ onSliderTouchStart }
        >
          <input
            id={ `${id.value}_start` }
            name={ props.name || id.value }
            disabled={ props.disabled }
            readOnly
            tabIndex={-1}
            value={ model[0] }
          />

          <input
            id={ `${id.value}_stop` }
            name={ props.name || id.value }
            disabled={ props.disabled }
            readOnly
            tabIndex={-1}
            value={ model[1] }
          />

          <VSliderTrack
            start={ trackStart }
            stop={ trackStop }
            tickLabelRender={props.tickLabelRender}
          />

          <VSliderThumb
            focused={ isFocused && focusedThumbEle === startThumbContainerEle }
            modelValue={ model[0] }
            onUpdate:modelValue={ updateStartModel }
            {...startThumpFocusEvents}
            min={ min }
            max={ model[1] }
            position={ trackStart }
            thumbLabelRender={props.thumbLabelRender}
          />

          <VSliderThumb
            focused={ isFocused && focusedThumbEle === stopThumbContainerEle }
            modelValue={ model[1] }
            onUpdate:modelValue={ updateStopModel }
            {...stopThumpFocusEvents}
            min={ model[0] }
            max={ max }
            position={ trackStop }
            thumbLabelRender={props.thumbLabelRender}
          />
        </div>
      )}
    />
  )
})
