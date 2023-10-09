import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VForm,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-form', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-form'>
      <VForm>
        xx
      </VForm>
    </div>
  )
})
