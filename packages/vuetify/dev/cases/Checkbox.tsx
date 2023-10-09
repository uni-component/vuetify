import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VCheckbox,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-checkbox', () => {
  const checkbox = ref(true)
  const setCheckbox = (val: boolean) => {
    checkbox.value = val
  }

  return {
    checkbox,
    setCheckbox,
  }
}), (_, state) => {
  const {
    checkbox,
    setCheckbox,
  } = state
  return (
    <div class='section-checkbox'>
      <VCheckbox
        modelValue={checkbox}
        onUpdate:modelValue={setCheckbox}
        label={`Checkbox: ${checkbox.toString()}`}
      ></VCheckbox>
    </div>
  )
})
