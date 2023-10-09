import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VChip,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-chip', () => {
  const chip = ref(true)
  const closeChip = () => {
    chip.value = false
  }

  return {
    chip,
    closeChip,
  }
}), (_, state) => {
  const {
    chip,
    closeChip,
  } = state
  return (
    <div class='section-chip'>
      {chip && <VChip
        class='ma-2'
        closable
        onClick:close={closeChip}
      >
        Closable
      </VChip>
      }
      <VChip
        class='ma-2'
        link
      >
        Default
      </VChip>

      <VChip
        class='ma-2'
        color='primary'
      >
        Primary
      </VChip>

      <VChip
        class='ma-2'
        color='secondary'
      >
        Secondary
      </VChip>

      <VChip
        class='ma-2'
        color='red'
        textColor='white'
      >
        Red Chip
      </VChip>

      <VChip
        class='ma-2'
        color='green'
        textColor='white'
      >
        Green Chip
      </VChip>
    </div>
  )
})
