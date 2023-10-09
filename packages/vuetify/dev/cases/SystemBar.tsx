import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VSystemBar,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-system-bar', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-system-bar'>
      <VSystemBar>system</VSystemBar>
    </div>
  )
})
