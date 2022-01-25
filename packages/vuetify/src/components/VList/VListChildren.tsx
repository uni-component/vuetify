import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Components
import { VListGroup } from './VListGroup'
import { VListItem } from './VListItem'

// Types
import type { Prop, PropType, UniNode } from '@uni-component/core'
import type { ListGroupHeaderSlot } from './VListGroup'
import type { ListItem } from './VList'

const UniVListChildren = uniComponent('v-list-children', {
  items: Array as Prop<ListItem[]>,

  externalHeaderRender: Function as PropType<(scope: ListGroupHeaderSlot) => UniNode | undefined>,
  itemRender: Function as PropType<(scope: ListItem) => UniNode | undefined>,
}, () => {
  return {}
})

export const VListChildren = uni2Platform(UniVListChildren, (props, _, { renders }) => {
  const slotContent = renders.defaultRender?.()
  return slotContent ?? props.items?.map(({ children, ...item }) => {
    const { value } = item
    return children ? (
      <VListGroup
        value={value}
        items={children}
        {...renders}
        headerRender={headerProps => {
          return props.externalHeaderRender
            ? props.externalHeaderRender({ ...item, ...headerProps })
            : <VListItem {...item} {...headerProps} />
        }}
      />
    ) : (
      props.itemRender ? props.itemRender(item) : <VListItem {...item} {...renders} />
    )
  })
})
