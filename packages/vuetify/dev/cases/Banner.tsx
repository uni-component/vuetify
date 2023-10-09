import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VBanner,
  VBtn,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-banner', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-banner'>
      <VBanner
        lines='one'
        sticky
        actionsRender={() => (
          <VBtn color='deep-purple-accent-4'>
            Get Online
          </VBtn>
        )}
      >
        We can't save your edits while you are in offline mode.
      </VBanner>
    </div>
  )
})
