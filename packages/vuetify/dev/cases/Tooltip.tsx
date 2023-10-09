import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VTooltip,
  VBtn,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-tooltip', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-tooltip' style={{position: 'relative'}}>
      <VTooltip activatorRender={({ props }) => (
        <VBtn
          color='primary'
          {...props}
        >
          Button
        </VBtn>
      )}>
        <span>Tooltip</span>
      </VTooltip>
    </div>
  )
})
