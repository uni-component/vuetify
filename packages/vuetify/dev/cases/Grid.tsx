import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VContainer,
  VRow,
  VCol,
  VCard,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-gird', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-grid'>
      <VContainer class='grey lighten-5'>
        <VRow noGutters>
          <VCol cols='12' sm='6'>
            <VCard class='pa-2' variant='outlined'>
              One of three columns
            </VCard>
          </VCol>
          <VCol cols='12' sm='6'>
            <VCard class='pa-2'>
              One of three columns
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </div>
  )
})
