import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VTextField,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-text-field', () => {
  const textField = ref('Preliminary report')
  const updateTextField = (v: string) => textField.value = v

  return {
    textField,
    updateTextField,
  }
}), (_, state) => {
  const {
    textField,
    updateTextField,
  } = state
  return (
    <div class='section-text-field'>
      <VTextField
        modelValue={textField}
        onUpdate:modelValue={updateTextField}
        rules={[v => v.length <= 25 || 'Max 25 characters']}
        counter='25'
        hint='This field uses counter prop'
        label='Regular'
        clearable
      />
    </div>
  )
})
