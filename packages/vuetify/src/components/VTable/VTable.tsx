import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VTable.sass'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Utilities
import { convertToUnit } from '@/util'
import { makeDensityProps, useDensity } from '@/composables/density'
import { computed } from '@uni-store/core'

const UniVTable = uniComponent('v-table', {
  fixedHeader: Boolean,
  fixedFooter: Boolean,
  height: [Number, String],

  ...makeDensityProps(),
  ...makeThemeProps(),
  ...makeTagProps(),
  topRender: Function as PropType<() => UniNode | undefined>,
  bottomRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { densityClasses } = useDensity(props)

  const rootClass = computed(() => {
    return [
      {
        [`${name}--fixed-height`]: !!props.height,
        [`${name}--fixed-header`]: props.fixedHeader,
        [`${name}--fixed-footer`]: props.fixedFooter,
        [`${name}--has-top`]: !!props.topRender,
        [`${name}--has-bottom`]: !!props.bottomRender,
      },
      themeClasses.value,
      densityClasses.value,
    ]
  })

  return {
    rootClass,
  }
})

export const VTable = uni2Platform(UniVTable, (props, state, { renders, $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
  } = state
  return (
    <props.tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
      {...$attrs}
    >
      { props.topRender?.() }

      { renders.defaultRender && (
        <div
          class="v-table__wrapper"
          style={{ height: convertToUnit(props.height) }}
        >
          <table>
            { renders.defaultRender?.() }
          </table>
        </div>
      ) }

      { props.bottomRender?.() }
    </props.tag>
  )
})
