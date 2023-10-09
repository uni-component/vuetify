import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VInput,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-input', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-input'>
      <VInput
        messages={['Messages']}
        appendIcon='mdi-close'
        prependIcon='mdi-phone'
      >
        Default Slot
      </VInput>
    </div>
  )
})
