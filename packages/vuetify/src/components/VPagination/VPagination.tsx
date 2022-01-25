import type { PropType, UniNode } from '@uni-component/core'
import { classNames, h, uni2Platform, uniComponent, useRef } from '@uni-component/core'

import './VPagination.sass'

// Components
import { VBtn } from '../VBtn'

// Composables
import { makeTagProps } from '@/composables/tag'
import { useLocale } from '@/composables/locale'
import { useRtl } from '@/composables/rtl'
import { makeElevationProps } from '@/composables/elevation'
import { makeDensityProps } from '@/composables/density'
import { makeRoundedProps } from '@/composables/rounded'
import { makeSizeProps } from '@/composables/size'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { makeVariantProps } from '@/composables/variant'
import { useResizeObserver } from '@/composables/resizeObserver'
import { makeBorderProps } from '@/composables/border'
import { useRefs } from '@/composables/refs'
import { useProxiedModel } from '@/composables/proxiedModel'
import { provideDefaults } from '@/composables/defaults'

// Utilities
import { computed, nextTick, ref } from '@uni-store/core'
import { createRange, keyValues } from '@/util'

const UniVPagination = uniComponent('v-pagination', {
  start: {
    type: [Number, String],
    default: 1,
  },
  modelValue: {
    type: Number,
    default: (props: any) => props.start,
  },
  disabled: Boolean,
  length: {
    type: [Number, String],
    default: 1,
    validator: (val: number) => val % 1 === 0,
  },
  totalVisible: [Number, String],
  firstIcon: {
    type: String,
    default: '$first',
  },
  prevIcon: {
    type: String,
    default: '$prev',
  },
  nextIcon: {
    type: String,
    default: '$next',
  },
  lastIcon: {
    type: String,
    default: '$last',
  },
  ariaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.root',
  },
  pageAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.page',
  },
  currentPageAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.currentPage',
  },
  firstAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.first',
  },
  previousAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.previous',
  },
  nextAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.next',
  },
  lastAriaLabel: {
    type: String,
    default: '$vuetify.pagination.ariaLabel.last',
  },
  ellipsis: {
    type: String,
    default: '...',
  },
  showFirstLastPage: Boolean,

  ...makeTagProps({ tag: 'nav' }),
  ...makeElevationProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeBorderProps(),
  ...makeThemeProps(),
  ...makeVariantProps({ variant: 'text' } as const),

  // todo ts
  firstRender: Function as PropType<(scope: any) => UniNode | undefined>,
  prevRender: Function as PropType<(scope: any) => UniNode | undefined>,
  nextRender: Function as PropType<(scope: any) => UniNode | undefined>,
  lastRender: Function as PropType<(scope: any) => UniNode | undefined>,
  itemRender: Function as PropType<(scope: any) => UniNode | undefined>,

  'onUpdate:modelValue': Function as PropType<(value: number) => void>,
  onFirst: Function as PropType<(value: number) => void>,
  onPrev: Function as PropType<(value: number) => void>,
  onNext: Function as PropType<(value: number) => void>,
  onLast: Function as PropType<(value: number) => void>,
}, (name, props, context) => {
  const page = useProxiedModel(props, context, 'modelValue')
  const { t, n } = useLocale()
  const { isRtl } = useRtl()
  const { themeClasses } = provideTheme(props)
  const maxButtons = ref(-1)

  provideDefaults(undefined, { scoped: true })

  const { resizeRef } = useResizeObserver((entries: ResizeObserverEntry[]) => {
    if (!entries.length) return

    const { target, contentRect } = entries[0]

    const firstItem = target.querySelector('.v-pagination__list > *')

    if (!firstItem) return

    const totalWidth = contentRect.width
    const itemWidth = firstItem.getBoundingClientRect().width + 10

    maxButtons.value = Math.max(0, Math.floor((totalWidth - 96) / itemWidth))
  })
  const setResizeRef = useRef(resizeRef)

  const length = computed(() => parseInt(props.length, 10))
  const start = computed(() => parseInt(props.start, 10))

  const totalVisible = computed(() => {
    if (props.totalVisible) return Math.min(parseInt(props.totalVisible ?? '', 10), length.value)
    else if (maxButtons.value >= 0) return maxButtons.value
    return length.value
  })

  const range = computed(() => {
    if (length.value <= 0) return []

    if (totalVisible.value <= 3) {
      return [Math.min(Math.max(start.value, page.value), start.value + length.value)]
    }

    if (props.length <= totalVisible.value) {
      return createRange(length.value, start.value)
    }

    const middle = Math.ceil(totalVisible.value / 2)
    const left = middle
    const right = length.value - middle

    if (page.value < left) {
      return [...createRange(Math.max(1, totalVisible.value - 2), start.value), props.ellipsis, length.value]
    } else if (page.value > right) {
      const rangeLength = totalVisible.value - 2
      const rangeStart = length.value - rangeLength + start.value
      return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart)]
    } else {
      const rangeLength = Math.max(1, totalVisible.value - 4)
      const rangeStart = rangeLength === 1 ? page.value : page.value - Math.ceil(rangeLength / 2) + start.value
      return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart), props.ellipsis, length.value]
    }
  })

  function setValue (e: Event, value: number, event?: 'onFirst' | 'onPrev' | 'onNext' | 'onLast') {
    e.preventDefault()
    page.value = value
    if (event) {
      props[event] && (props as any)[event](value)
    }
  }

  const { refs, updateRef, resetRefs } = useRefs<HTMLLIElement>()

  const items = computed(() => {
    const sharedProps = {
      density: props.density,
      rounded: props.rounded,
      size: props.size,
    }
    // todo
    resetRefs()

    return range.value.map((item, index) => {
      if (typeof item === 'string') {
        return {
          isActive: false,
          page: item,
          props: {
            ...sharedProps,
            ellipsis: true,
            icon: true,
            disabled: true,
            variant: props.variant,
            border: props.border,
          },
        }
      } else {
        const isActive = item === page.value
        return {
          isActive,
          page: n(item),
          props: {
            ...sharedProps,
            ellipsis: false,
            icon: true,
            disabled: !!props.disabled || props.length < 2,
            elevation: props.elevation,
            variant: props.variant,
            border: props.border,
            color: isActive ? props.color : undefined,
            ariaCurrent: isActive,
            ariaLabel: t(isActive ? props.currentPageAriaLabel : props.pageAriaLabel, index + 1),
            onClick: (e: Event) => setValue(e, item),
          },
        }
      }
    })
  })

  const controls = computed(() => {
    const sharedProps = {
      color: undefined,
      density: props.density,
      rounded: props.rounded,
      size: props.size,
      variant: props.variant,
      border: props.border,
    }

    const prevDisabled = !!props.disabled || page.value <= start.value
    const nextDisabled = !!props.disabled || page.value >= start.value + length.value - 1

    return {
      first: props.showFirstLastPage ? {
        ...sharedProps,
        icon: isRtl.value ? props.lastIcon : props.firstIcon,
        onClick: (e: Event) => setValue(e, start.value, 'onFirst'),
        disabled: prevDisabled,
        ariaLabel: t(props.firstAriaLabel),
        ariaDisabled: prevDisabled,
      } : undefined,
      prev: {
        ...sharedProps,
        icon: isRtl.value ? props.nextIcon : props.prevIcon,
        onClick: (e: Event) => setValue(e, page.value - 1, 'onPrev'),
        disabled: prevDisabled,
        ariaLabel: t(props.previousAriaLabel),
        ariaDisabled: prevDisabled,
      },
      next: {
        ...sharedProps,
        icon: isRtl.value ? props.prevIcon : props.nextIcon,
        onClick: (e: Event) => setValue(e, page.value + 1, 'onNext'),
        disabled: nextDisabled,
        ariaLabel: t(props.nextAriaLabel),
        ariaDisabled: nextDisabled,
      },
      last: props.showFirstLastPage ? {
        ...sharedProps,
        icon: isRtl.value ? props.firstIcon : props.lastIcon,
        onClick: (e: Event) => setValue(e, start.value + length.value - 1, 'onLast'),
        disabled: nextDisabled,
        ariaLabel: t(props.lastAriaLabel),
        ariaDisabled: nextDisabled,
      } : undefined,
    }
  })

  function updateFocus () {
    const currentIndex = page.value - start.value
    const curLi = refs.value[currentIndex]
    if (curLi) {
      const childEle = curLi.children[0]
      childEle && (childEle as any).focus()
    }
  }

  function onKeyDown (e: KeyboardEvent) {
    if (e.key === keyValues.left && !props.disabled && page.value > props.start) {
      page.value = page.value - 1
      nextTick(updateFocus)
    } else if (e.key === keyValues.right && !props.disabled && page.value < start.value + length.value - 1) {
      page.value = page.value + 1
      nextTick(updateFocus)
    }
  }

  const rootClass = themeClasses
  return {
    rootClass,
    setResizeRef,
    t,
    onKeyDown,
    items,
    controls,
    updateRef,
  }
})

export const VPagination = uni2Platform(UniVPagination, (props, state, { renders }) => {
  const {
    rootId,
    rootClass,
    rootStyle,
    setResizeRef,
    t,
    onKeyDown,
    items,
    controls,
    updateRef,
  } = state
  return (
    <props.tag
      ref={ setResizeRef }
      id={ rootId }
      class={ rootClass }
      style={ rootStyle }
      role="navigation"
      aria-label={ t(props.ariaLabel) }
      onKeyDown={ onKeyDown }
      data-test="v-pagination-root"
    >
      <ul class="v-pagination__list">
        { props.showFirstLastPage && (
          <li class="v-pagination__first" data-test="v-pagination-first">
            { props.firstRender ? props.firstRender(controls.first) : (
              <VBtn {...controls.first} />
            ) }
          </li>
        ) }

        <li class="v-pagination__prev" data-test="v-pagination-prev">
          { props.prevRender ? props.prevRender(controls.prev) : (
            <VBtn {...controls.prev} />
          ) }
        </li>

        { items.map((item, index) => (
          <li
            ref={el => updateRef(el, index)}
            key={ `${index}_${item.page}` }
            class={classNames([
              'v-pagination__item',
              {
                'v-pagination__item--is-active': item.isActive,
              },
            ])}
            data-test="v-pagination-item"
          >
            { props.itemRender ? props.itemRender(item) : (
              <VBtn {...item.props}>{ item.page }</VBtn>
            ) }
          </li>
        )) }

        <li class="v-pagination__next" data-test="v-pagination-next">
          { props.nextRender ? props.nextRender(controls.next) : (
            <VBtn {...controls.next} />
          ) }
        </li>

        { props.showFirstLastPage && (
          <li class="v-pagination__last" data-test="v-pagination-last">
            { props.lastRender ? props.lastRender(controls.last) : (
              <VBtn {...controls.last} />
            ) }
          </li>
        ) }
      </ul>
    </props.tag>
  )
})
