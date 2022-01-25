import type { PropType } from '@uni-component/core'
import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VBottomNavigation.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useProxiedModel } from '@/composables/proxiedModel'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Utilities
import { computed } from '@uni-store/core'
import { convertToUnit } from '@/util'

const UniVBottomNavigation = uniComponent('VBottomNavigation', {
  bgColor: String,
  color: String,
  grow: Boolean,
  modelValue: {
    type: Boolean,
    default: true,
  },
  mode: String as PropType<'horizontal' | 'shift'>,
  height: {
    type: [Number, String],
    default: 56,
  },
  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeLayoutItemProps({
    name: 'bottom-navigation',
  }),
  ...makeTagProps({ tag: 'header' }),
  ...makeThemeProps(),
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
}, (name, props, context) => {
  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(computed(() => props.bgColor))
  const { textColorClasses, textColorStyles } = useTextColor(computed(() => props.color))
  const { densityClasses } = useDensity(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)
  const height = computed(() => (
    Number(props.height) -
    (props.density === 'comfortable' ? 8 : 0) -
    (props.density === 'compact' ? 16 : 0)
  ))
  const isActive = useProxiedModel(props, context, 'modelValue', props.modelValue)
  const layoutStyles = useLayoutItem(
    props.name,
    computed(() => parseInt(props.priority, 10)),
    computed(() => 'bottom'),
    computed(() => isActive.value ? height.value : 0),
    height,
    isActive
  )

  const rootClass = computed(() => {
    return [
      {
        [`${name}--grow`]: props.grow,
        [`${name}--horizontal`]: props.mode === 'horizontal',
        [`${name}--is-active`]: isActive.value,
        [`${name}--shift`]: props.mode === 'shift',
        [`${name}--absolute`]: props.absolute,
      },
      themeClasses.value,
      backgroundColorClasses.value,
      borderClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...layoutStyles.value,
      ...textColorStyles.value,
      height: convertToUnit(height.value),
      transform: `translateY(${convertToUnit(!isActive.value ? 100 : 0, '%')})`,
    }
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VBottomNavigation = uni2Platform(UniVBottomNavigation, (props, state, { renders }) => {
  const { rootClass, rootStyle } = state
  const content = renders.defaultRender?.()
  return (
    <props.tag
      class={rootClass}
      style={rootStyle}
    >
      { content && (
        <div class="v-bottom-navigation__content">
          { content }
        </div>
      ) }
    </props.tag>
  )
})
