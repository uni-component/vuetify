import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VBadge,
  VBtn,
  VAvatar,
  VImg,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-badge', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-badge'>
      <VBadge
        bordered
        color='error'
        icon='mdi-lock'
      >
        <VBtn
          color='error'
          flat
        >
          Lock Account
        </VBtn>
      </VBadge>

      <VBadge
        bordered
        location='bottom-right'
        color='deep-purple-accent-4'
        dot
        offsetX='2'
        offsetY='4'
      >
        <VAvatar size='large'>
          <VImg src='https://cdn.vuetifyjs.com/images/lists/2.jpg'></VImg>
        </VAvatar>
      </VBadge>
      <VBadge
        bordered
        badgeRender={() => (
          <VAvatar>
            <VImg src='https://cdn.vuetifyjs.com/images/logos/v.png'></VImg>
          </VAvatar>
        )}
      >
        <VAvatar size='large'>
          <VImg src='https://cdn.vuetifyjs.com/images/john.png'></VImg>
        </VAvatar>
      </VBadge>
    </div>
  )
})
