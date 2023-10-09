import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VCard,
  VCardText,
  VTimeline,
  VTimelineItem,
  VRow,
  VCol,
  VAvatar,
  VImg,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-timeline', () => {
  return {}
}), (_, state) => {
  return (
    <div class='section-timeline'>
      <VCard
        class='mx-auto'
        max-width='400'
      >
        <VCardText class='py-0'>
          <VTimeline side='before'>
            <VTimelineItem
              dotColor='pink'
              size='small'
            >
              <VRow class='pt-1'>
                <VCol cols='3'>
                  <strong>5pm</strong>
                </VCol>
                <VCol>
                  <strong>New Icon</strong>
                  <div class='text-caption'>
                    Mobile App
                  </div>
                </VCol>
              </VRow>
            </VTimelineItem>

            <VTimelineItem
              dotColor='teal lighten-3'
              size='small'
            >
              <VRow class='pt-1'>
                <VCol cols='3'>
                  <strong>3-4pm</strong>
                </VCol>
                <VCol>
                  <strong>Design Stand Up</strong>
                  <div class='text-caption mb-2'>
                    Hangouts
                  </div>
                  <VAvatar>
                    <VImg
                      src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown'
                    ></VImg>
                  </VAvatar>
                  <VAvatar>
                    <VImg
                      src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned'
                    ></VImg>
                  </VAvatar>
                  <VAvatar>
                    <VImg
                      src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale'
                    ></VImg>
                  </VAvatar>
                </VCol>
              </VRow>
            </VTimelineItem>

            <VTimelineItem
              dotColor='pink'
              size='small'
            >
              <VRow class='pt-1'>
                <VCol cols='3'>
                  <strong>12pm</strong>
                </VCol>
                <VCol>
                  <strong>Lunch break</strong>
                </VCol>
              </VRow>
            </VTimelineItem>

            <VTimelineItem
              dotColor='teal lighten-3'
              size='small'
            >
              <VRow class='pt-1'>
                <VCol cols='3'>
                  <strong>9-11am</strong>
                </VCol>
                <VCol>
                  <strong>Finish Home Screen</strong>
                  <div class='text-caption'>
                    Web App
                  </div>
                </VCol>
              </VRow>
            </VTimelineItem>
          </VTimeline>
        </VCardText>
      </VCard>
    </div>
  )
})
