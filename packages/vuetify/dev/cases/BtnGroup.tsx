import { h, Fragment, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VBtn,
  VBtnGroup,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-btn-group', () => {
  return {}
}), (_, state) => {
  return (
    <>
      <VBtnGroup>
        <VBtn>safdsdf</VBtn>
        <VBtn>ssdf</VBtn>
      </VBtnGroup>
      <div class='section-btn'>
        <VBtn block ripple={false}>outer</VBtn>
        <VBtn border>Text</VBtn>
        <VBtn icon='mdi-heart' color='primary'></VBtn>
      </div>
    </>
  )
})
