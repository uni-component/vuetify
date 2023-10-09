import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VLayout,
  VMain,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VSpacer,
  VImg,
  VBtn,
  VIcon,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-app-bar', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-app-bar'>
      <VLayout>
        <VAppBar
          absolute
          color='#fcb69f'
          // dark
          // shrink-on-scroll
          // scrollTarget='#scrolling-techniques-2'
          image='https://picsum.photos/1920/1080?random'
          imageRender={({ src }) => (
            <VImg
              src={src as string}
              gradient='to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)'
            ></VImg>
          )}
        >
          <VAppBarNavIcon></VAppBarNavIcon>

          <VAppBarTitle>Title</VAppBarTitle>

          <VSpacer></VSpacer>

          <VBtn icon>
            <VIcon>mdi-magnify</VIcon>
          </VBtn>

          <VBtn icon>
            <VIcon>mdi-heart</VIcon>
          </VBtn>

          <VBtn icon>
            <VIcon>mdi-dots-vertical</VIcon>
          </VBtn>
        </VAppBar>
        <VMain>
          {/* <VSheet
            id='scrolling-techniques-2'
            class='overflow-y-auto'
            maxHeight='600'
          >
            <VContainer style='height: 1000px;'></VContainer>
          </VSheet> */}
        </VMain>
      </VLayout>
    </div>
  )
})
