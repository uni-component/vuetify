import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VCard,
  VNavigationDrawer,
  VListItem,
  VDivider,
  VList,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-navigation-drawer', () => {
  const navigationDrawerItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Photos', icon: 'mdi-image' },
    { title: 'About', icon: 'mdi-help-box' },
  ]
  return {
    navigationDrawerItems,
  }
}), (_, state) => {
  return (
    <div class='section-navigation-drawer'>
      <VCard
        height='400'
        width='556'
        class='mx-auto'
      >
        <VNavigationDrawer permanent>
          <VListItem title='Application' subtitle='subtext' />

          <VDivider />

          <VList
            density='compact'
            nav
          >
            {state.navigationDrawerItems.map((item) => {
              return (
                <VListItem
                  key={item.title}
                  link
                  prependIcon={item.icon}
                  title={item.title}
                />
              )
            })}
          </VList>
        </VNavigationDrawer>
      </VCard>
    </div>
  )
})
