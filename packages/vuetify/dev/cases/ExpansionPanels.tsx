import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VExpansionPanels,
  VExpansionPanel,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-expansion-panels', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-expansion-panels'>
      <VExpansionPanels>
        <VExpansionPanel title='Item' text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'></VExpansionPanel>
        <VExpansionPanel title='Item2' text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'></VExpansionPanel>
      </VExpansionPanels>
    </div>
  )
})
