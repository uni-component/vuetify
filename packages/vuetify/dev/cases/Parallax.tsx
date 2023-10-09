import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VParallax,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-parallax', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-parallax'>
      <VParallax src='https://cdn.vuetifyjs.com/images/parallax/material.jpg' />
    </div>
  )
})
