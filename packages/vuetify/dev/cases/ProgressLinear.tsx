import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VProgressLinear,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-progress-linear', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-progress-linear'>
      <VProgressLinear
        indeterminate
        color='teal'
      ></VProgressLinear>
    </div>
  )
})
