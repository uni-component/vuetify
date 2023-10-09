import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VPagination,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-pagination', () => {
  const page = ref(1)
  const updatePage = (val: number) => {
    page.value = val
    console.log('cur page', val)
  }

  return {
    page,
    updatePage,
  }
}), (_, state) => {
  const {
    page,
    updatePage,
  } = state
  return (
    <div class='section-pagination'>
      <VPagination
        modelValue={page}
        onUpdate:modelValue={updatePage}
        length={6}
      />
    </div>
  )
})
