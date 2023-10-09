import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VAlert,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-alert', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-alert'>
      <VAlert
        border='end'
        borderColor='error'
        elevation='2'
        class='ma-2'
      >
        Fusce commodo aliquam arcu. Pellentesque posuere. Phasellus tempus. Donec posuere vulputate arcu.
      </VAlert>
      <VAlert
        density='compact'
        variant='outlined'
        type='error'
        class='ma-2'
      >
        I'm a dense alert with the <strong>outlined</strong> prop and a <strong>type</strong> of error
      </VAlert>
      <VAlert type='success'>
        I'm a success alert.
      </VAlert>

      <VAlert type='info'>
        I'm an info alert.
      </VAlert>

      <VAlert type='warning'>
        I'm a warning alert.
      </VAlert>

      <VAlert type='error'>
        I'm an error alert.
      </VAlert>
    </div>
  )
})
