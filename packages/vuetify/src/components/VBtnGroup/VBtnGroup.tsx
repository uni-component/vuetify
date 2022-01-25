import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VBtnGroup.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeVariantProps } from '@/composables/variant'
import { provideDefaults } from '@/composables/defaults'

// Utility
import { computed, toRef } from '@uni-store/core'

const UniVBtnGroup = uniComponent('v-btn-group', {
  divided: Boolean,

  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { densityClasses } = useDensity(props)
  const { borderClasses } = useBorder(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)

  const rootClass = computed(() => {
    return [
      {
        [`${name}--divided`]: props.divided,
      },
      themeClasses.value,
      borderClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
    ]
  })

  provideDefaults({
    VBtn: {
      height: 'auto',
      color: toRef(props, 'color'),
      flat: true,
      variant: toRef(props, 'variant'),
    },
  })

  return {
    rootClass,
  }
})

export const VBtnGroup = uni2Platform(UniVBtnGroup, (props, state, { renders }) => {
  return (
    <props.tag class={state.rootClass}>
      {renders.defaultRender?.()}
    </props.tag>
  )
})
