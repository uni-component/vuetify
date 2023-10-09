import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VBreadcrumbs,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-breadcrumbs', () => {
  const breadcrumbsItems = [
    {
      tag: 'a',
      text: 'Dashboard',
      disabled: false,
      href: 'breadcrumbs_dashboard',
    },
    {
      tag: 'a',
      text: 'Link 1',
      disabled: false,
      href: 'breadcrumbs_link_1',
    },
    {
      tag: 'a',
      text: 'Link 2',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ]

  return {
    breadcrumbsItems,
  }
}), (_, state) => {
  const {
    breadcrumbsItems,
  } = state
  return (
    <div class='section-breadcrumbs'>
      <VBreadcrumbs tag='div' items={breadcrumbsItems} itemRender={(scope) => scope.props.text.toUpperCase()}></VBreadcrumbs>
    </div>
  )
})
