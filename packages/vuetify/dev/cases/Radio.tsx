import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VRadioGroup,
  VRadio,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-radio', () => {
  const radioGroup = ref(2)
  const updateRadioGroup = (v: number) => {
    radioGroup.value = v
  }

  return {
    radioGroup,
    updateRadioGroup,
  }
}), (_, state) => {
  const {
    radioGroup,
    updateRadioGroup,
  } = state
  return (
    <div class='section-radio'>
      <VRadioGroup modelValue={radioGroup} onUpdate:modelValue={updateRadioGroup}>
        {[1, 2, 3].map((n) => (
          <VRadio
            key={String(n)}
            label={`Radio ${n}`}
            value={n}
          />
        ))}
      </VRadioGroup>
    </div>
  )
})
