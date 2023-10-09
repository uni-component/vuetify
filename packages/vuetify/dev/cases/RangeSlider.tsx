import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VRangeSlider,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-range-slider', () => {
  const range = ref([30, 60])
  const updateRange = (v: [number, number]) => range.value = v

  return {
    range,
    updateRange,
  }
}), (_, state) => {
  const {
    range,
    updateRange,
  } = state
  return (
    <div class='section-range-slider'>
      <VRangeSlider
        modelValue={range}
        onUpdate:modelValue={updateRange}
        label='Slider'
      />
      {range}
    </div>
  )
})
