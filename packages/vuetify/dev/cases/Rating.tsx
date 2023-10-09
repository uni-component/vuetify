import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VRating,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-rating', () => {
  const rating = ref(3)
  const updateRating = (v: number) => rating.value = v

  return {
    rating,
    updateRating,
  }
}), (_, state) => {
  const {
    rating,
    updateRating,
  } = state
  return (
    <div class='section-rating text-center'>
      <VRating
        modelValue={rating}
        onUpdate:modelValue={updateRating}
        clearable
        hover
        itemLabels={['sad', '', '', '', 'happy']}
        itemLabelPosition='bottom'
        size='x-large'
      />
      {rating}
    </div>
  )
})
