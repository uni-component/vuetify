import { computed, h, uni2Platform, uniComponent } from '@uni-component/core'
import { VExpandTransition } from '@/composables/transitions'
import { VListChildren } from './VListChildren'
import { createList } from './VList'
import type { Prop, PropType, UniNode } from '@uni-component/core'
import type { ListItem } from './VList'

const UniVListGroupItems = uniComponent('v-list-group-items', {
  open: Boolean,
  items: Array as Prop<ListItem[]>,

  itemRender: Function as PropType<(scope: ListItem) => UniNode | undefined>,
}, (_, props) => {
  createList()

  const transition = VExpandTransition({
    model: computed(() => props.open),
  })

  const rootClass = computed(() => {
    return ['v-list-group__items']
  })

  return {
    rootClass,
    transition,
  }
})

export const VListGroupItems = uni2Platform(UniVListGroupItems, (props, state, { renders }) => {
  return (
    <div
      class={state.rootClass}
      id={state.rootId}
      style={state.rootStyle}
      ref={state.transition.setEleRef}
    >
      <VListChildren items={props.items} {...renders} />
    </div>
  )
})
