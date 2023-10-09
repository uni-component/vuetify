import { h, uniComponent, uni2Platform, classNames } from '@uni-component/core'
import {
  VItemGroup,
  VItem,
  VContainer,
  VRow,
  VCol,
  VCard,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-item-group', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-item-group'>
      <VItemGroup selectedClass='bg-primary'>
        <VContainer>
          <VRow>
            <VCol>
              <VItem
                defaultRender={({ isSelected, selectedClass, toggle }) => (
                  <VCard
                    class={classNames(['d-flex', 'align-center', selectedClass])}
                    height='200'
                    onClick={toggle}
                  >
                    <div class='text-h3 flex-grow-1 text-center'>
                      { isSelected ? 'Selected' : 'Click Me!' }
                    </div>
                  </VCard>
                )}
              />
            </VCol>
            <VCol>
              <VItem
                defaultRender={({ isSelected, selectedClass, toggle }) => (
                  <VCard
                    class={classNames(['d-flex', 'align-center', selectedClass])}
                    height='200'
                    ripple
                    onClick={toggle}
                  >
                    <div class='text-h3 flex-grow-1 text-center'>
                      { isSelected ? 'Selected' : 'Click Me!' }
                    </div>
                  </VCard>
                )}
              />
            </VCol>
          </VRow>
        </VContainer>
      </VItemGroup>
    </div>
  )
})
