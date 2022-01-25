import {
  h,
  mergeStyle,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VSystemBar.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { computed } from '@uni-store/core'

const UniVSystemBar = uniComponent('v-system-bar', {
  lightsOut: Boolean,
  window: Boolean,

  ...makeBorderProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { dimensionStyles } = useDimension(props)
  const { elevationClasses } = useElevation(props)
  const { positionClasses, positionStyles } = usePosition(props)
  const { roundedClasses } = useRounded(props)

  const rootClass = computed(() => {
    return [
      {
        [`${name}--lights-out`]: props.lightsOut,
        [`${name}--window`]: props.window,
      },
      themeClasses.value,
      borderClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return mergeStyle(
      dimensionStyles.value,
      positionStyles.value,
    )
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VSystemBar = uni2Platform(UniVSystemBar, (props, state, { renders, $attrs }) => {
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
    >{ renders.defaultRender?.() }</props.tag>
  )
})
