import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VLayoutItem.sass'

// Composables
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'

// Utilities
import { computed, toRef } from '@uni-store/core'

const UniVLayoutItem = uniComponent('VLayoutItem', {
  position: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 300,
  },
  modelValue: Boolean,
  ...makeLayoutItemProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    return {
      [`${name}--absolute`]: props.absolute,
    }
  })
  const rootStyle = useLayoutItem(
    props.name,
    computed(() => parseInt(props.priority, 10)),
    toRef(props, 'position'),
    toRef(props, 'size'),
    toRef(props, 'size'),
    toRef(props, 'modelValue')
  )
  return {
    rootClass,
    rootStyle,
  }
})

export const VLayoutItem = uni2Platform(UniVLayoutItem, (props, state, { renders }) => {
  return (
    <div
      class={ state.rootClass }
      style={ state.rootStyle }
    >
      { renders.defaultRender?.() }
    </div>
  )
})
