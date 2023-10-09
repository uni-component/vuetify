import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VAvatar,
  VIcon,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-avatar', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-avatar'>
      <VAvatar color='primary' size='50'>VJ</VAvatar>
      <VAvatar color='primary' size='50'>
        <VIcon>
          mdi-account-circle
        </VIcon>
      </VAvatar>
      <VAvatar
        color='primary'
        size='50'
        image='https://cdn.vuetifyjs.com/images/john.jpg'
      ></VAvatar>
    </div>
  )
})
