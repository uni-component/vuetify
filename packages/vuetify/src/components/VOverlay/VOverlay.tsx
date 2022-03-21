import type {
  InjectionKey,
  PropType,
  Ref,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  computed,
  Fragment,
  h,
  mergeStyle,
  provide,
  ref,
  uni2Platform,
  uniComponent,
  useRef,
  watch,
} from '@uni-component/core'

// Styles
import './VOverlay.sass'

// Composables
import { makeActivatorProps, useActivator } from './useActivator'
import { makePositionStrategyProps, usePositionStrategies } from './positionStrategies'
import { makeScrollStrategyProps, useScrollStrategies } from './scrollStrategies'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import type { Transition } from '@/composables/transition'
import { makeTransitionProps, useTransition } from '@/composables/transition'
// import { useBackButton } from '@/composables/router'
import { useBackgroundColor } from '@/composables/color'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useRtl } from '@/composables/rtl'
import { useTeleport } from '@/composables/teleport'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeLazyProps, useLazy } from '@/composables/lazy'
import { useStack } from '@/composables/stack'

import { useDirective } from '@/composables/directive'
import { ClickOutside } from '@/directives/click-outside'

// Utilities
import {
  convertToUnit,
  getScrollParent,
  IN_BROWSER,
  isObject,
  standardEasing,
} from '@/util'
import { capitalize } from '@vue/shared'

// Types
import type { BackgroundColorData } from '@/composables/color'

const OverlayScrim = uni2Platform(uniComponent('v-overlay-scrim', {
  modelValue: Boolean,
  color: Object as PropType<BackgroundColorData>,
}, (_, props) => {
  const transition = useTransition(computed(() => props.modelValue), 'fade-transition', true)
  return {
    transition,
  }
}), (props, state) => {
  return (
    <div
      ref={state.transition.setEleRef}
      class={classNames([
        'v-overlay__scrim',
        props.color!.backgroundColorClasses.value,
      ])}
      style={{
        ...props.color!.backgroundColorStyles.value,
      }}
    />
  )
})

export const overlayRenders = {
  defaultRender: Function as PropType<(scope: { isActive: Ref<boolean> }) => UniNode | string | undefined>,
  activatorRender: Function as PropType<(scope: { isActive: boolean, props: Record<string, any> }) => UniNode | undefined>,
}

interface OverlayProvide {
  activatorEl: Ref<HTMLElement | undefined>
  contentEl: Ref<HTMLElement | undefined>
}

export const VOverlaySymbol = 'VOverlay' as any as InjectionKey<OverlayProvide>

const UniVOverlay = uniComponent('v-overlay', {
  absolute: Boolean,
  attach: [Boolean, String, Object] as PropType<boolean | string | Element>,
  contained: Boolean,
  contentClass: null,
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [String, Boolean],
    default: true,
  },

  ...makeActivatorProps(),
  ...makeDimensionProps(),
  ...makePositionStrategyProps(),
  ...makeScrollStrategyProps(),
  ...makeThemeProps(),
  ...makeTransitionProps(),
  ...makeLazyProps(),
  ...overlayRenders,

  'onClick:outside': Function as PropType<(e: MouseEvent) => void>,
  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
}, (name, props, context) => {
  const isActive = useProxiedModel(props, context, 'modelValue')
  const { teleportTarget } = useTeleport(computed(() => props.attach || props.contained))
  const { themeClasses } = provideTheme(props)
  const { rtlClasses } = useRtl()
  const { hasContent, onAfterLeave } = useLazy(props, isActive)
  const scrimColor = useBackgroundColor(computed(() => {
    return typeof props.scrim === 'string' ? props.scrim : null
  }))
  const { activatorEl, activatorEvents } = useActivator(props, isActive)
  const { dimensionStyles } = useDimension(props)
  const { isTop } = useStack(isActive)

  const root = ref<HTMLElement>()
  const setRootEle = useRef(root)
  const contentEl = ref<HTMLElement>()
  const setContentEle = useRef(contentEl)

  provide(VOverlaySymbol, {
    contentEl,
    activatorEl,
  })

  const { contentStyles, updatePosition } = usePositionStrategies(props, {
    contentEl,
    activatorEl,
    isActive,
  })
  useScrollStrategies(props, {
    root,
    contentEl,
    activatorEl,
    isActive,
    updatePosition,
  })

  function onClickOutside (e: MouseEvent) {
    props['onClick:outside']?.(e)

    if (!props.persistent) isActive.value = false
    else animateClick()
  }

  function closeConditional () {
    return isActive.value && isTop.value
  }

  IN_BROWSER && watch(isActive, val => {
    if (val) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }, { immediate: true })

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape' && isTop.value) {
      if (!props.persistent) {
        isActive.value = false
      } else animateClick()
    }
  }

  // todo back
  // useBackButton(next => {
  //   if (isTop.value && isActive.value) {
  //     next(false)
  //     if (!props.persistent) isActive.value = false
  //     else animateClick()
  //   } else {
  //     next()
  //   }
  // })

  const top = ref<number>()
  watch(() => isActive.value && (props.absolute || props.contained) && teleportTarget.value == null, val => {
    if (val) {
      const scrollParent = getScrollParent(root.value)
      if (scrollParent && scrollParent !== document.scrollingElement) {
        top.value = scrollParent.scrollTop
      }
    }
  })

  // Add a quick "bounce" animation to the content
  function animateClick () {
    if (props.noClickAnimation) return

    contentEl.value?.animate([
      { transformOrigin: 'center' },
      { transform: 'scale(1.03)' },
      { transformOrigin: 'center' },
    ], {
      duration: 150,
      easing: standardEasing,
    })
  }

  const eventsMap: Record<string, string> = {
    mouseenter: 'mouseEnter',
    mouseleave: 'mouseLeave',
  }
  const activatorProps = computed(() => {
    const handlers = {} as Record<string, any>
    const events = activatorEvents.value
    for (const k in events) {
      handlers[`on${capitalize(eventsMap[k] || k)}`] = (events as any)[k]
    }
    return {
      isActive: isActive.value,
      props: {
        modelValue: isActive.value,
        'onUpdate:modelValue': (val: boolean) => isActive.value = val,
        ...handlers,
        ...props.activatorProps,
      },
    }
  })
  const renderActivator = () => {
    return props.activatorRender?.(activatorProps.value)
  }
  const rootClass = computed(() => {
    return classNames([
      name,
      // todo attrs class
      context.attrs.class,
      {
        [`${name}--absolute`]: props.absolute || props.contained,
        [`${name}--active`]: isActive.value,
        [`${name}--contained`]: props.contained,
      },
      themeClasses.value,
      rtlClasses.value,
    ])
  })
  const rootStyle = computed(() => {
    const inlineStyle = context.attrs.style
    const style: { top?: string } = {}
    if (top.value != null) {
      style.top = convertToUnit(top.value)
    }
    return mergeStyle(inlineStyle, style)
  })

  const contentTransition = (isObject(props.transition) ? props.transition.component({
    model: isActive,
    appear: true,
  }, {
    afterLeave: onAfterLeave,
  }) : useTransition(isActive, props.transition, true, {
    afterLeave: onAfterLeave,
  })) as Transition
  watch(() => activatorEl.value, val => {
    isObject(props.transition) && contentTransition.setCSS(!val)
  })
  watch(() => props.transition, newName => {
    // ignore other case
    !isObject(newName) && contentTransition.setName(newName as string)
  }, {
    // flush: 'sync'
  })

  const contentStyle = computed(() => {
    return {
      ...dimensionStyles.value,
      ...contentStyles.value,
    }
  })
  const clickOutsideDirective = useDirective(ClickOutside, computed(() => {
    return {
      value: { handler: onClickOutside, closeConditional, include: () => [activatorEl.value] },
      modifiers: {},
    }
  }))
  const setContentEleRef = (ele?: HTMLDivElement) => {
    setContentEle(ele)
    clickOutsideDirective.setEleRef(ele)
    contentTransition.setEleRef(ele)
    if (ele) {
      (ele as any).dialogTarget = activatorEl.value
    }
  }
  const renderContent = () => {
    return hasContent.value && (
      <div
        class={rootClass.value}
        style={rootStyle.value}
        id={context.attrs.id}
        ref={ setRootEle }
        {...context.$attrs}
      >
        <OverlayScrim color={scrimColor} modelValue={isActive.value && !!props.scrim}></OverlayScrim>
        <div
          ref={ setContentEleRef }
          class={classNames([
            'v-overlay__content',
            props.contentClass,
          ])}
          style={contentStyle.value}
        >
          { (props.defaultRender || context.renders.defaultRender)?.({ isActive }) }
        </div>
      </div>
    )
  }

  return {
    renderActivator,
    renderContent,
    contentEl,
    activatorEl,
  }
})

export const VOverlay = uni2Platform(UniVOverlay, (_, state) => {
  const {
    renderActivator,
    renderContent,
  } = state
  return (
    <>
      { renderActivator() }
      { renderContent() }
    </>
  )
})
