import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VHover,
  VCard,
  VCardText,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-hover', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-hover'>
      <VHover
        openDelay={200}
        defaultRender={({hover, props}) => (
          <VCard
            elevation={hover ? 16 : 2}
            class={`mx-auto${hover && ' on-hover' || ''}`}
            height='150'
            maxWidth='150'
            {...props}
          >
            <VCardText class='font-weight-medium mt-12 text-center text-subtitle-1'>
              Open Delay (Mouse enter)
            </VCardText>
          </VCard>
        )}
      />
    </div>
  )
})
