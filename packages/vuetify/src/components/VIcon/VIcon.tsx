import { computed, h, toRef, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VIcon.sass'

// Composables
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { useIcon } from '@/composables/icons'
import { useTextColor } from '@/composables/color'

// Utilities
import { convertToUnit } from '@/util'

// Types
import type { IconValue } from '@/composables/icons'
import type { ComputedRef, PropType } from '@uni-component/core'

const UniVIcon = uniComponent('v-icon', {
  color: String,
  left: Boolean,
  right: Boolean,
  icon: {
    type: [String, Object] as PropType<IconValue>,
  },
  ...makeSizeProps(),
  ...makeTagProps({ tag: 'i' }),
}, (name, props, { renders }) => {
  const { sizeClasses } = useSize(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))

  const rootClass = computed(() => {
    return [
      'notranslate',
      sizeClasses.value,
      textColorClasses.value,
      {
        [`${name}--left`]: props.left,
        [`${name}--righ`]: props.right,
      },
    ]
  })
  const rootStyle = computed(() => {
    const sizeStyle = sizeClasses.value ? {
      fontSize: convertToUnit(props.size),
      width: convertToUnit(props.size),
      height: convertToUnit(props.size),
    } : {}
    return {
      ...sizeStyle,
      ...textColorStyles.value,
    }
  })

  let slotIcon: ComputedRef<string | undefined> | undefined
  if (renders.defaultRender) {
    slotIcon = computed(() => {
      let slot = renders.defaultRender?.()
      if (Array.isArray(slot)) {
        slot = slot[0]
      }
      if (!slot) {
        return
      }
      return slot.children ? slot.children : slot as string
    })
  }

  const { iconData } = useIcon(props.icon !== undefined ? props : slotIcon!)

  return {
    rootClass,
    rootStyle,
    iconData,
  }
})

export const VIcon = uni2Platform(UniVIcon, (props, state, { renders }) => {
  const {
    rootClass,
    rootStyle,
    iconData,
  } = state
  return (
    <iconData.component
      tag={ props.tag }
      icon={ iconData.icon }
      // @ts-expect-error
      class={rootClass}
      style={rootStyle}
      aria-hidden="true"
    />
  )
})
