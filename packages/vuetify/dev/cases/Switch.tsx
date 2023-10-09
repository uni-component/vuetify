import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VSwitch,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-switch', () => {
  const switchVal = ref(false)
  const updateSwitchVal = (v: boolean) => switchVal.value = v

  return {
    switchVal,
    updateSwitchVal,
  }
}), (_, state) => {
  const {
    switchVal,
    updateSwitchVal,
  } = state
  return (
    <div class='section-switch'>
      <VSwitch
        modelValue={switchVal}
        onUpdate:modelValue={updateSwitchVal}
        label={`Switch val: ${switchVal.toString()}`}
        color='red'
        hideDetails
      ></VSwitch>
    </div>
  )
})
