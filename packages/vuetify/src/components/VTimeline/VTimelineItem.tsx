import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  computed,
  h,
  inject,
  ref,
  uni2Platform,
  uniComponent,
  useRef,
  watch,
} from '@uni-component/core'

// Components
import { VTimelineSymbol } from './shared'
import { VTimelineDivider } from './VTimelineDivider'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeSizeProps } from '@/composables/size'
import { makeElevationProps } from '@/composables/elevation'
import { makeRoundedProps } from '@/composables/rounded'

// Utilities
import { convertToUnit } from '@/util'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'

const UniVTimelineItem = uniComponent('v-timeline-item', {
  dotColor: String,
  fillDot: Boolean,
  hideDot: Boolean,
  hideOpposite: {
    type: Boolean,
    default: undefined,
  },
  icon: String,
  iconColor: String,

  ...makeRoundedProps(),
  ...makeElevationProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeDimensionProps(),
  iconRender: Function as PropType<(scope: {
    icon: string | undefined
    iconColor: string | undefined
    size: string | number | undefined
  }) => UniNode | undefined>,
  oppositeRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const timeline = inject(VTimelineSymbol)

  if (!timeline) throw new Error('[Vuetify] Could not find v-timeline provider')

  const { dimensionStyles } = useDimension(props)

  const dotSize = ref(0)
  const rootEle = ref<HTMLElement>()
  const setRootEle = useRef(rootEle)
  const dotRef = computed(() => {
    return rootEle.value?.querySelector('.v-timeline-divider') as HTMLElement | undefined
  })
  watch(dotRef, newValue => {
    if (!newValue) return
    dotSize.value = newValue.querySelector('.v-timeline-divider__dot')?.getBoundingClientRect().width ?? 0
  }, {
    flush: 'post',
  })

  const rootClass = computed(() => {
    return {
      [`${name}--fill-dot`]: props.fillDot,
    }
  })
  const rootStyle = computed(() => {
    return {
      '--v-timeline-dot-size': convertToUnit(dotSize.value),
    }
  })

  return {
    rootClass,
    rootStyle,
    dimensionStyles,
    timeline,
    setRootEle,
  }
})

export const VTimelineItem = uni2Platform(UniVTimelineItem, (props, state, { renders, $attrs }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    dimensionStyles,
    timeline,
    setRootEle,
  } = state
  return (
    <div
      id={rootId}
      class={rootClass}
      style={rootStyle}
      ref={setRootEle}
    >
      <div
        class="v-timeline-item__body"
        style={ dimensionStyles }
      >
        { renders.defaultRender?.() }
      </div>

      <VTimelineDivider
        hideDot={ props.hideDot }
        icon={ props.icon }
        iconColor={ props.iconColor }
        size={ props.size }
        elevation={ props.elevation }
        dotColor={ props.dotColor }
        fillDot={ props.fillDot }
        rounded={ props.rounded }
        defaultRender={props.iconRender}
      />

      { timeline.density !== 'compact' && (
        <div class="v-timeline-item__opposite">
          { !props.hideOpposite && props.oppositeRender?.() }
        </div>
      ) }
    </div>
  )
})
