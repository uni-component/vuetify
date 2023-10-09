import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VSheet,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-sheet', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-sheet'>
      <VSheet
        class='pa-12'
        color='grey lighten-3'
      >
        <VSheet
          class='mx-auto'
          height='100'
          width='100'
          elevation='10'
          rounded
        ></VSheet>
      </VSheet>
    </div>
  )
})
