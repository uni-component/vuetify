import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VBtnToggle,
  VBtn,
  VIcon,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-btn-toggle', () => {
  const btnGroupValue = ref('center')
  const onGroupChange = (v: any) => {
    btnGroupValue.value = v
  }

  return {
    btnGroupValue,
    onGroupChange,
  }
}), (_, state) => {
  const {
    btnGroupValue,
    onGroupChange,
  } = state
  return (
    <div class='section-btn-toggle'>
      <VBtnToggle modelValue={btnGroupValue} onUpdate:modelValue={onGroupChange}>
        <VBtn value='left'>
          <VIcon>mdi-format-align-left</VIcon>
        </VBtn>

        <VBtn value='center'>
          <VIcon>mdi-format-align-center</VIcon>
        </VBtn>

        <VBtn value='right'>
          <VIcon>mdi-format-align-right</VIcon>
        </VBtn>

        <VBtn value='justify'>
          <VIcon>mdi-format-align-justify</VIcon>
        </VBtn>
      </VBtnToggle>
    </div>
  )
})
