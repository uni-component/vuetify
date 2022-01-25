import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VDivider.sass'

// Utilities
import { computed } from '@uni-store/core'
import { convertToUnit } from '@/util'

// Composables
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Types
type DividerKey = 'borderRightWidth' | 'borderTopWidth' | 'maxHeight' | 'maxWidth'
type DividerStyles = Partial<Record<DividerKey, string>>

const UniVDivider = uniComponent('v-divider', {
  inset: Boolean,
  length: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  ...makeThemeProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const rootStyle = computed(() => {
    const styles: DividerStyles = {}

    if (props.length) {
      styles[props.vertical ? 'maxHeight' : 'maxWidth'] = convertToUnit(props.length)
    }

    if (props.thickness) {
      styles[props.vertical ? 'borderRightWidth' : 'borderTopWidth'] = convertToUnit(props.thickness)
    }

    return styles
  })

  const rootClass = computed(() => {
    return [
      {
        [`${name}--inset`]: props.inset,
        [`${name}--vertical`]: props.vertical,
      },
      themeClasses.value,
    ]
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VDivider = uni2Platform(UniVDivider, (props, state, context) => {
  const { rootClass, rootStyle } = state
  return (
    <hr
      class={rootClass}
      style={ rootStyle }
      // aria-orientation={
      //   !attrs.role || attrs.role === 'separator'
      //     ? props.vertical ? 'vertical' : 'horizontal'
      //     : undefined
      // }
      // role={`${attrs.role || 'separator'}`}
    />
  )
})
