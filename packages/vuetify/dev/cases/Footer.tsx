import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VFooter,
  VSpacer,
  VBtn,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-footer', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-footer'>
      <VFooter class='d-flex flex-column'>
        <div class='bg-teal d-flex w-100 align-center px-4'>
          <strong class='text-white'>Get connected with us on social networks!</strong>

          <VSpacer></VSpacer>

          <VBtn
            class='mx-4 text-white'
            icon='mdi-facebook'
            variant='plain'
            size='small'
          ></VBtn>
          <VBtn
            class='mx-4 text-white'
            icon='mdi-twitter'
            variant='plain'
            size='small'
          ></VBtn>
        </div>

        <div class='px-4 py-2 bg-black text-white text-center w-100'>
          {new Date().getFullYear() } — <strong>Vuetify</strong>
        </div>
      </VFooter>
    </div>
  )
})
