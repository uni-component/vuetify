import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VFileInput,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-file-input', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-file-input'>
      <VFileInput {...{accept: 'image/*'}} label='File input'></VFileInput>
      <VFileInput
        chips
        multiple
        label='File input w/ chips'
      ></VFileInput>
    </div>
  )
})
