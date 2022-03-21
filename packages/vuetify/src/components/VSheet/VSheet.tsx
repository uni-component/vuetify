import {
  computed,
  h,
  toRef,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VSheet.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Utilities

const UniVSheet = uniComponent('v-sheet', {
  color: {
    type: String,
    default: 'surface',
  },

  ...makeBorderProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
}, (_, props) => {
  const { themeClasses } = provideTheme(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { borderClasses } = useBorder(props)
  const { dimensionStyles } = useDimension(props)
  const { elevationClasses } = useElevation(props)
  const { positionClasses, positionStyles } = usePosition(props)
  const { roundedClasses } = useRounded(props)

  const rootClass = computed(() => {
    return [
      themeClasses.value,
      backgroundColorClasses.value,
      borderClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...dimensionStyles.value,
      ...positionStyles.value,
    }
  })
  return {
    rootClass,
    rootStyle,
  }
})

export const VSheet = uni2Platform(UniVSheet, (props, state, { renders, $attrs }) => {
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
