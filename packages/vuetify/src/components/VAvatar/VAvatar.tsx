import { h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VAvatar.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VImg } from '@/components/VImg'

// Composables
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'

// Utilities
import { computed, toRef } from '@uni-store/core'

const UniVAvatar = uniComponent('v-avatar', {
  // todo
  color: String,
  left: Boolean,
  right: Boolean,
  icon: String,
  image: String,
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
}, (name, props) => {
  const { themeClasses } = provideTheme(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { densityClasses } = useDensity(props)
  const { roundedClasses } = useRounded(props)
  const { sizeClasses, sizeStyles } = useSize(props)

  const rootClass = computed(() => {
    return [
      {
        [`${name}--left`]: props.left,
        [`${name}--right`]: props.right,
      },
      backgroundColorClasses.value,
      densityClasses.value,
      roundedClasses.value,
      sizeClasses.value,
      themeClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...sizeStyles.value,
    }
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VAvatar = uni2Platform(UniVAvatar, (props, state, { renders }) => {
  const { rootClass, rootStyle } = state
  return (
    <props.tag
      class={rootClass}
      style={rootStyle}
    >
      { props.image && <VImg src={ props.image } alt="" /> }

      { props.icon && !props.image && <VIcon icon={ props.icon } /> }

      { renders.defaultRender?.() }
    </props.tag>
  )
})
