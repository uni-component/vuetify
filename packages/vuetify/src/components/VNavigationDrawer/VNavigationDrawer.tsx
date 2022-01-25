import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  mergeStyle,
  onMounted,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

// Styles
import './VNavigationDrawer.sass'

// Composables
import { useTouch } from './touch'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useDisplay } from '@/composables/display'
import { useProxiedModel } from '@/composables/proxiedModel'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useBackgroundColor } from '@/composables/color'

// Utilities
import { computed, ref, toRef, watch } from '@uni-store/core'
import { useTransition } from '@/composables/transition'

const UniVNavigationDrawer = uniComponent('v-navigation-drawer', {
  color: String,
  disableResizeWatcher: Boolean,
  expandOnHover: Boolean,
  floating: Boolean,
  modelValue: {
    type: Boolean,
    default: null,
  },
  'onUpdate:modelValue': Function as PropType<(val: boolean) => void>,
  permanent: Boolean,
  rail: Boolean,
  railWidth: {
    type: [Number, String],
    default: 72,
  },
  image: String,
  temporary: Boolean,
  touchless: Boolean,
  width: {
    type: [Number, String],
    default: 256,
  },
  position: {
    type: String as PropType<'left' | 'right' | 'bottom'>,
    default: 'left',
    validator: (value: any) => ['left', 'right', 'bottom'].includes(value),
  },

  ...makeBorderProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({ tag: 'nav' }),
  ...makeThemeProps(),

  imageRender: Function as PropType<(scope: {image?: string}) => UniNode | undefined>,
  prependRender: Function as PropType<() => UniNode | undefined>,
  appendRender: Function as PropType<() => UniNode | undefined>,
}, (name, props, context) => {
  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { elevationClasses } = useElevation(props)
  const { mobile } = useDisplay()
  const { roundedClasses } = useRounded(props)

  const isActive = useProxiedModel(props, context, 'modelValue')
  const setIsActive = (val: boolean) => {
    isActive.value = val
  }
  const isHovering = ref(false)
  const setIsHovering = (val: boolean) => {
    isHovering.value = val
  }
  const width = computed(() => {
    return (props.rail && props.expandOnHover && isHovering.value)
      ? Number(props.width)
      : Number(props.rail ? props.railWidth : props.width)
  })
  const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary))

  if (!props.disableResizeWatcher) {
    watch(mobile, val => !props.permanent && (isActive.value = !val))
  }

  watch(() => props.permanent, val => {
    if (val) isActive.value = true
  })

  onMounted(() => {
    if (props.modelValue != null) return

    isActive.value = props.permanent || !mobile.value
  })

  const rootEl = ref<HTMLElement>()
  const setRootEl = useRef(rootEl)

  const { isDragging, dragProgress, dragStyles } = useTouch({
    isActive,
    isTemporary,
    width,
    touchless: toRef(props, 'touchless'),
    position: toRef(props, 'position'),
  })

  const layoutSize = computed(() => {
    const size = isTemporary.value ? 0
      : props.rail && props.expandOnHover ? Number(props.railWidth)
      : width.value

    return isDragging.value ? size * dragProgress.value : size
  })
  const layoutStyles = useLayoutItem(
    props.name,
    computed(() => parseInt(props.priority, 10)),
    toRef(props, 'position'),
    layoutSize,
    width,
    computed(() => isActive.value || isDragging.value),
    computed(() => isDragging.value)
  )

  const rootClass = computed(() => {
    return [
      {
        [`${name}--bottom`]: props.position === 'bottom',
        [`${name}--end`]: props.position === 'right',
        [`${name}--expand-on-hover`]: props.expandOnHover,
        [`${name}--floating`]: props.floating,
        [`${name}--is-hovering`]: isHovering.value,
        [`${name}--rail`]: props.rail,
        [`${name}--start`]: props.position === 'left',
        [`${name}--temporary`]: isTemporary.value,
        [`${name}--absolute`]: props.absolute,
      },
      themeClasses.value,
      backgroundColorClasses.value,
      borderClasses.value,
      elevationClasses.value,
      roundedClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return mergeStyle(backgroundColorStyles.value, layoutStyles.value, dragStyles.value)
  })

  const transition = useTransition(computed(() => {
    return isTemporary.value && (isDragging.value || isActive.value)
  }), 'fade-transition')

  return {
    rootClass,
    rootStyle,
    setRootEl,
    transition,
    isDragging,
    dragProgress,
    setIsHovering,
    setIsActive,
  }
})

export const VNavigationDrawer = uni2Platform(UniVNavigationDrawer, (props, state, { renders, $attrs }) => {
  const hasImage = (props.imageRender || props.image)
  const {
    rootId,
    rootClass,
    rootStyle,
    setRootEl,
    transition,
    isDragging,
    dragProgress,
    setIsHovering,
    setIsActive,
  } = state
  return (
    <>
      <props.tag
        ref={ setRootEl }
        onMouseEnter={ () => setIsHovering(true) }
        onMouseLeave={ () => setIsHovering(false) }
        id={rootId}
        class={rootClass}
        style={rootStyle}
        { ...$attrs }
      >
        { hasImage && (
          <div class="v-navigation-drawer__img">
            { props.imageRender
              ? props.imageRender({ image: props.image })
              : (<img src={ props.image } alt="" />)
            }
          </div>
        )}

        { props.prependRender && (
          <div class="v-navigation-drawer__prepend">
            { props.prependRender() }
          </div>
        )}

        <div class="v-navigation-drawer__content">
          { renders.defaultRender?.() }
        </div>

        { props.appendRender && (
          <div class="v-navigation-drawer__append">
            { props.appendRender() }
          </div>
        )}
      </props.tag>
      <div
        ref={transition.setEleRef}
        onTransitionEnd={transition.onTransitionEnd}
        style={mergeStyle(isDragging ? {
          opacity: dragProgress * 0.2,
          transition: 'none',
        } : {}, transition.style)}
        class={classNames('v-navigation-drawer__scrim', transition.transtionClass)}
        onClick={ () => setIsActive(false) }
      />
    </>
  )
})
