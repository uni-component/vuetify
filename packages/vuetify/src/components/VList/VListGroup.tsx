import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'

import { VListGroupItems } from './VListGroupItems'

// Composables
import { useNestedGroup } from '@/composables/nested/nested'
import { makeTagProps } from '@/composables/tag'

// Utilities
import { useList } from './VList'

// Types
import type { Prop, PropType, UniNode } from '@uni-component/core'
import type { ListItem } from './VList'

export type ListGroupHeaderSlot = {
  onClick: (e: Event) => void
  appendIcon: string
  class: string
}

const UniVListGroup = uniComponent('v-list-group', {
  value: {
    type: null,
  },
  collapseIcon: {
    type: String,
    default: '$collapse',
  },
  expandIcon: {
    type: String,
    default: '$expand',
  },
  items: Array as Prop<ListItem[]>,

  ...makeTagProps(),

  headerRender: Function as PropType<(scope: ListGroupHeaderSlot) => UniNode | undefined>,
  itemRender: Function as PropType<(scope: ListItem) => UniNode | undefined>,
}, (name, props) => {
  const { isOpen, open } = useNestedGroup(props)
  const list = useList()

  const onClick = (e: Event) => {
    open(!isOpen.value, e)
  }

  const headerProps = computed(() => ({
    onClick,
    appendIcon: isOpen.value ? props.collapseIcon : props.expandIcon,
    class: `${name}__header`,
  }))

  const rootClass = computed(() => {
    return {
      [`${name}--prepend`]: list?.hasPrepend.value,
    }
  })

  return {
    rootClass,
    headerProps,
    isOpen,
  }
})

export const VListGroup = uni2Platform(UniVListGroup, (props, state, { renders }) => {
  return (
    <props.tag class={state.rootClass} style={state.rootStyle} id={state.rootId}>
      { props.headerRender?.(state.headerProps) }
      <VListGroupItems items={props.items} open={state.isOpen} {...renders} />
    </props.tag>
  )
})
