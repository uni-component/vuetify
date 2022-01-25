import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VFooter.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { computed } from '@uni-store/core'

const UniVFooter = uniComponent('v-footer', {
  ...makeBorderProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeTagProps({ tag: 'footer' }),
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
      themeClasses.value,
      borderClasses.value,
      elevationClasses.value,
      positionClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...dimensionStyles.value,
      ...positionStyles.value,
    }
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VFooter = uni2Platform(UniVFooter, (props, state, { renders }) => {
  return (
    <props.tag
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
    >{ renders.defaultRender?.() }</props.tag>
  )
})
