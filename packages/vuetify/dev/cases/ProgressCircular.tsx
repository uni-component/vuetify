import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VProgressCircular,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-progress-circular', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-progress-circular'>
      <VProgressCircular
        size='50'
        color='primary'
        indeterminate
      ></VProgressCircular>
    </div>
  )
})
