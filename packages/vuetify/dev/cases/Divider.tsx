import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VDivider,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-divider', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-divider'>
      <p>before</p>
      <VDivider />
      <p>after</p>
    </div>
  )
})
