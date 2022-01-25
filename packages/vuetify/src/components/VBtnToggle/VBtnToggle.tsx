import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VBtnToggle.sass'

// Components
import { VBtnGroup } from '@/components/VBtnGroup'

// Composables
import { makeGroupProps, useGroup } from '@/composables/group'

// Types
import type { GroupProvide } from '@/composables/group'
import type { InjectionKey, PropType, UniNode } from '@uni-component/core'
import type { UnwrapRef } from '@uni-store/core'

// export type BtnToggleSlotProps = 'isSelected' | 'select' | 'selected' | 'next' | 'prev'
// export interface DefaultBtnToggleSlot extends Pick<GroupProvide, BtnToggleSlotProps> {}

export const VBtnToggleSymbol: InjectionKey<GroupProvide> = Symbol.for('vuetify:v-btn-toggle')

const UniVBtnToggle = uniComponent('v-btn-toggle', {
  ...makeGroupProps({ selectedClass: 'v-btn--selected' }),
  defaultRender: Function as PropType<(scope: UnwrapRef<ReturnType<typeof useGroup>>) => UniNode | undefined>,
}, (name, props, context) => {
  const group = useGroup(props, VBtnToggleSymbol, context)

  return {
    group,
  }
})

export const VBtnToggle = uni2Platform(UniVBtnToggle, (props, state, { renders }) => {
  // todo
  // const { isSelected, next, prev, select, selected } = state.group
  return (
    <VBtnGroup class={state.rootClass}>
      { props.defaultRender ? props.defaultRender(state.group) : renders.defaultRender?.(state.group) }
    </VBtnGroup>
  )
})
