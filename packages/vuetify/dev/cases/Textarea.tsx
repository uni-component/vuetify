import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VTextarea,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-textarea', () => {
  const textarea = ref('The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.')
  const updateTextarea = (v: string) => textarea.value = v

  return {
    textarea,
    updateTextarea,
  }
}), (_, state) => {
  const {
    textarea,
    updateTextarea,
  } = state
  return (
    <div class='section-textarea'>
      <VTextarea
        name='input-7-1'
        label='Default style'
        modelValue={textarea}
        onUpdate:modelValue={updateTextarea}
        hint='Hint text'
      ></VTextarea>
    </div>
  )
})
