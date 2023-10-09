import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { computed } from '@uni-store/core'
import {
  VCard,
  VDefaultsProvider,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-defaults-provider', () => {
  const defaults = computed(() => ({
    global: {
      elevation: 10,
    },
    VCard: {
      color: 'secondary',
    },
  }))

  return {
    defaults,
  }
}), (_, state) => {
  const {
    defaults,
  } = state
  return (
    <div class='section-default-provider'>
      <VCard title='Title' subtitle='Subtitle' class='ma-10'></VCard>
      <VDefaultsProvider defaults={defaults}>
        <VCard title='Title' subtitle='Subtitle' class='ma-10'></VCard>
      </VDefaultsProvider>
    </div>
  )
})
