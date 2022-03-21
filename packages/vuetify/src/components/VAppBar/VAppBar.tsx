import { computed, h, toRef, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VAppBar.sass'

// Components
import { VImg } from '@/components/VImg'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { convertToUnit } from '@/util'

// Types
import type { PropType, UniNode } from '@uni-component/core'

const UniVAppBar = uniComponent('v-app-bar', {
  // TODO: Implement scrolling techniques
  // hideOnScroll: Boolean
  // invertedScroll: Boolean
  // collapseOnScroll: Boolean
  // elevateOnScroll: Boolean
  // shrinkOnScroll: Boolean
  // fadeImageOnScroll: Boolean
  collapse: Boolean,
  color: String,
  flat: Boolean,
  height: {
    type: [Number, String],
    default: 64,
  },
  extensionHeight: {
    type: [Number, String],
    default: 48,
  },
  floating: Boolean,
  image: String,
  modelValue: {
    type: Boolean,
    default: true,
  },
  prominent: Boolean,
  prominentHeight: {
    type: [Number, String],
    default: 128,
  },
  position: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'top',
    validator: (value: any) => ['top', 'bottom'].includes(value),
  },

  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeLayoutItemProps(),
  ...makeTagProps({ tag: 'header' }),
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
  imageRender: Function as PropType<(scope: {src?: String}) => UniNode | undefined>,
  extensionRender: Function as PropType<() => UniNode | undefined>,
  prependRender: Function as PropType<() => UniNode | undefined>,
  appendRender: Function as PropType<() => UniNode | undefined>,
}, (name, props, context) => {
  const { borderClasses } = useBorder(props)
  const { densityClasses } = useDensity(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const isExtended = !!props.extensionRender
  const contentHeight = computed(() => (
    Number(props.prominent ? props.prominentHeight : props.height) -
    (props.density === 'comfortable' ? 8 : 0) -
    (props.density === 'compact' ? 16 : 0)
  ))
  const height = computed(() => (
    contentHeight.value +
    Number(isExtended ? props.extensionHeight : 0)
  ))
  const isActive = useProxiedModel(props, context, 'modelValue', props.modelValue)
  const layoutStyles = useLayoutItem(
    props.name,
    computed(() => parseInt(props.priority, 10)),
    toRef(props, 'position'),
    height,
    height,
    isActive,
  )

  const rootClass = computed(() => {
    return [
      {
        [`${name}--bottom`]: props.position === 'bottom',
        [`${name}--collapsed`]: props.collapse,
        [`${name}--flat`]: props.flat,
        [`${name}--floating`]: props.floating,
        [`${name}--is-active`]: isActive.value,
        [`${name}--prominent`]: props.prominent,
        [`${name}--absolute`]: props.absolute,
      },
      backgroundColorClasses.value,
      borderClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...backgroundColorStyles.value,
      ...layoutStyles.value,
    }
  })
  return {
    rootClass,
    rootStyle,
    contentHeight,
  }
})

export const VAppBar = uni2Platform(UniVAppBar, (props, state, { renders }) => {
  const { rootClass, rootStyle, contentHeight } = state
  const hasImage = !!(props.imageRender || props.image)

  return (
    <props.tag
      class={rootClass}
      style={rootStyle}
    >
      { hasImage && (
        <div class="v-app-bar__image">
          { props.imageRender
            ? props.imageRender({ src: props.image })
            : (<VImg src={ props.image } cover />)
          }
        </div>
      ) }

      <div
        class="v-app-bar__content"
        style={{ height: convertToUnit(contentHeight) }}
      >
        { props.prependRender && (
          <div class="v-app-bar__prepend">
            { props.prependRender() }
          </div>
        ) }

        { renders.defaultRender?.() }

        { props.appendRender && (
          <div class="v-app-bar__append">
            { props.appendRender() }
          </div>
        ) }
      </div>

      { props.extensionRender && (
        <div
          class="v-app-bar__extension"
          style={{ height: convertToUnit(props.extensionHeight) }}
        >
          { props.extensionRender() }
        </div>
      ) }
    </props.tag>
  )
})
