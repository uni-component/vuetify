import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VCounter,
  VBtn,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-counter', () => {
  const counterActive = ref(false)
  const toggleCounter = () => {
    counterActive.value = !counterActive.value
  }

  return {
    counterActive,
    toggleCounter,
  }
}), (_, state) => {
  const {
    counterActive,
    toggleCounter,
  } = state
  return (
    <div class='section-counter'>
      <VBtn onClick={toggleCounter}>Toggle counter</VBtn>
      <VCounter active={counterActive} style={{position: 'absolute'}}></VCounter>
    </div>
  )
})
