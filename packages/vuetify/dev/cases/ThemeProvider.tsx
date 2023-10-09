import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VThemeProvider,
  VCard,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-theme-provider', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-theme-provider'>
      <VThemeProvider theme='dark' withBackground class='pa-10'>
        <VCard title='Title' subtitle='Subtitle' />
      </VThemeProvider>
    </div>
  )
})
