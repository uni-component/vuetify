import {
  computed,
  h,
  nextTick,
  ref,
  uni2Platform,
  uniComponent,
  useRef,
  watch,
} from '@uni-component/core'

// Styles
import './VDialog.sass'

// Components
import { VOverlay } from '@/components/VOverlay'

// Composables
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeTransitionProps } from '@/composables/transition'
import { VDialogTransition } from '@/composables/transitions'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { IN_BROWSER } from '@/util'

import { overlayRenders } from '@/components/VOverlay/VOverlay'

import type { PropType } from '@uni-component/core'

const UniVDialog = uniComponent('v-dialog', {
  fullscreen: Boolean,
  origin: {
    type: String,
    default: 'center center',
  },
  retainFocus: {
    type: Boolean,
    default: true,
  },
  scrollable: Boolean,
  modelValue: Boolean,

  ...makeDimensionProps({ width: 'auto' }),
  ...makeTransitionProps({
    transition: { component: VDialogTransition },
  }),
  ...overlayRenders,

  'onUpdate:modelValue': Function as PropType<(value: boolean) => void>,
}, (name, props, context) => {
  const isActive = useProxiedModel(props, context, 'modelValue')
  const { dimensionStyles } = useDimension(props)

  const onUpdate = (val: boolean) => {
    isActive.value = val
  }

  const overlay = ref<{
    contentEl: HTMLElement | undefined
    activatorEl: HTMLElement | undefined
  }>()
  const setOverlay = useRef(overlay)

  function onFocusin (e: FocusEvent) {
    const before = e.relatedTarget as HTMLElement | null
    const after = e.target as HTMLElement | null

    if (
      before !== after &&
      overlay.value?.contentEl &&
      // It isn't the document or the dialog body
      ![document, overlay.value.contentEl].includes(after!) &&
      // It isn't inside the dialog body
      !overlay.value.contentEl.contains(after)
      // We're the topmost dialog
      // TODO: this.activeZIndex >= this.getMaxZIndex() &&
      // It isn't inside a dependent element (like a menu)
      // TODO: !this.getOpenDependentElements().some(el => el.contains(target))
      // So we must have focused something outside the dialog and its children
    ) {
      const focusable = [...overlay.value.contentEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )].filter(el => !el.hasAttribute('disabled')) as HTMLElement[]

      if (!focusable.length) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (before === firstElement) {
        lastElement.focus()
      } else {
        firstElement.focus()
      }
    }
  }

  if (IN_BROWSER) {
    watch(() => isActive.value && props.retainFocus, val => {
      val
        ? document.addEventListener('focusin', onFocusin)
        : document.removeEventListener('focusin', onFocusin)
    }, { immediate: true })
  }

  watch(isActive, async val => {
    await nextTick()
    if (val) {
      overlay.value!.contentEl?.focus({ preventScroll: true })
    } else {
      overlay.value!.activatorEl?.focus({ preventScroll: true })
    }
  })

  const rootClass = computed(() => {
    return {
      [`${name}--fullscreen`]: props.fullscreen,
    }
  })

  const rootStyle = computed(() => {
    return {
      ...dimensionStyles.value,
    }
  })

  return {
    rootClass,
    rootStyle,
    isActive,
    onUpdate,
    setOverlay,
  }
})

export const VDialog = uni2Platform(UniVDialog, (props, state, { attrs, renders, $attrs }) => {
  const {
    rootClass,
    rootStyle,
    rootId,
    isActive,
    onUpdate,
    setOverlay,
  } = state
  return (
    <VOverlay
      modelValue={isActive}
      onUpdate:modelValue={onUpdate}
      class={rootClass}
      style={rootStyle}
      id={rootId}
      transition={props.transition}
      aria-role="dialog"
      aria-modal="true"
      activatorProps={{
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isActive),
      }}
      {...$attrs}
      defaultRender={renders.defaultRender}
      activatorRender={props.activatorRender}
      ref={setOverlay}
    />
  )
})
