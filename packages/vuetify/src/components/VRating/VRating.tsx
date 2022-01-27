import type {
  ExtractPropTypes,
  InjectionKey,
  Prop,
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  inject,
  provide,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Styles
import './VRating.sass'

// Components
import { VBtn } from '../VBtn'

// Composables
import type { Density } from '@/composables/density'
import { makeDensityProps } from '@/composables/density'
import { makeSizeProps } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { useProxiedModel } from '@/composables/proxiedModel'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useLocale } from '@/composables/locale'

// Utilities
import type { ComputedRef, Ref, WritableComputedRef } from '@uni-store/core'
import { computed, ref } from '@uni-store/core'
import { createRange, getUid } from '@/util'

// Types
import type { Variant } from '@/composables/variant'

interface RatingProvide {
  rating: WritableComputedRef<number>
  range: ComputedRef<number[]>
  focusIndex: Ref<number>
  name: ComputedRef<string>
  props: ComputedRef<RatingProps>
}

const VRatingSymbol: InjectionKey<RatingProvide> = Symbol.for('vuetify:v-rating')

const VRatingItem = uni2Platform(uniComponent('v-rating-item', {
  value: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showStar: {
    type: Boolean,
    default: true,
  },
}, (name, props) => {
  const ratingProvide = inject(VRatingSymbol)
  if (!ratingProvide) throw new Error('[Vuetify] v-rating-item must be used inside v-rating')

  const { t } = useLocale()
  const ratingProps = computed(() => ratingProvide!.props.value)
  const rating = computed(() => ratingProvide.rating.value)
  const increments = computed(() => ratingProvide.range.value.flatMap(v => ratingProps.value.halfIncrements ? [v - 0.5, v] : [v]))
  const hoverIndex = ref(-1)
  const firstRef = ref<HTMLElement>()
  const setFirstRef = (el: HTMLElement | undefined) => {
    if (props.index === 0) {
      firstRef.value = el
    }
  }
  let isClicking = false

  const itemsState = computed(() => increments.value.map(value => {
    const props = ratingProps.value
    const isHovering = props.hover && hoverIndex.value > -1
    const isFilled = rating.value >= value
    const isHovered = hoverIndex.value >= value
    const isFullIcon = isHovering ? isHovered : isFilled
    const icon = isFullIcon ? props.fullIcon : props.emptyIcon
    const activeColor = props.activeColor ?? props.color
    const color = (isFilled || isHovered) ? activeColor : props.color

    return { isFilled, isHovered, icon, color }
  }))
  const itemState = computed(() => itemsState.value[props.index])

  const eventState = computed(() => [0, ...increments.value].map(value => {
    const props = ratingProps.value

    function onMouseEnter () {
      hoverIndex.value = value
    }

    function onMouseLeave () {
      hoverIndex.value = -1
    }

    function onFocus () {
      if (value === 0 && rating.value === 0) {
        firstRef.value?.focus()
      } else {
        ratingProvide!.focusIndex.value = value
      }
    }

    function onBlur () {
      if (!isClicking) ratingProvide!.focusIndex.value = -1
    }

    function onClick () {
      if (props.disabled || props.readonly) return
      ratingProvide!.rating.value = rating.value === value && props.clearable ? 0 : value
    }

    return {
      onMouseEnter: props.hover ? onMouseEnter : undefined,
      onMouseLeave: props.hover ? onMouseLeave : undefined,
      onFocus,
      onBlur,
      onClick,
    }
  }))

  function onMouseDown () {
    isClicking = true
  }

  function onMouseUp () {
    isClicking = false
  }

  const events = computed(() => eventState.value[props.index + 1])
  const id = computed(() => `${ratingProvide.name.value}-${String(props.value).replace('.', '-')}`)
  const btnProps = computed(() => {
    const props = ratingProps.value
    return {
      color: itemState.value?.color,
      density: props.density,
      disabled: props.disabled,
      icon: itemState.value?.icon,
      ripple: props.ripple,
      size: props.size,
      tag: 'span',
      variant: 'plain' as Variant,
    }
  })

  return {
    ratingProps,
    rating,
    t,
    id,
    itemState,
    btnProps,
    onMouseDown,
    onMouseUp,
    events,
    setFirstRef,
  }
}), (props, state) => {
  const {
    ratingProps,
    rating,
    t,
    id,
    itemState,
    btnProps,
    onMouseDown,
    onMouseUp,
    events,
    setFirstRef,
  } = state
  return (
    <>
      <label
        htmlFor={ id }
        class={classNames({
          'v-rating__item--half': ratingProps.halfIncrements && props.value % 1 > 0,
          'v-rating__item--full': ratingProps.halfIncrements && props.value % 1 === 0,
        })}
        onMouseDown={ onMouseDown }
        onMouseUp={ onMouseUp }
        onMouseEnter={ events.onMouseEnter }
        onMouseLeave={ events.onMouseLeave }
      >
        <span class="v-rating__hidden">{ t(ratingProps.itemAriaLabel, props.value, ratingProps.length) }</span>
        {
          !props.showStar ? undefined
          : ratingProps.itemRender ? ratingProps.itemRender({
            ...itemState,
            props: btnProps,
            value: props.value,
            index: props.index,
          })
          : (
            <VBtn { ...btnProps } />
          )
        }
      </label>
      <input
        class="v-rating__hidden"
        name={ ratingProps.name }
        id={ id }
        type="radio"
        value={ props.value }
        checked={ rating === props.value }
        onClick={ events.onClick }
        onFocus={ events.onFocus }
        onBlur={ events.onBlur }
        onChange={() => {}}
        ref={ setFirstRef }
        readonly={ ratingProps.readonly }
        disabled={ ratingProps.disabled }
      />
    </>
  )
})

const ratingProps = {
  name: String,
  itemAriaLabel: {
    type: String,
    default: '$vuetify.rating.ariaLabel.item',
  },
  activeColor: String,
  color: String,
  clearable: Boolean,
  disabled: Boolean,
  emptyIcon: {
    type: String,
    default: '$ratingEmpty',
  },
  fullIcon: {
    type: String,
    default: '$ratingFull',
  },
  halfIncrements: Boolean,
  hover: Boolean,
  length: {
    type: [Number, String],
    default: 5,
  },
  readonly: Boolean,
  modelValue: {
    type: Number,
    default: 0,
  },
  'onUpdate:modelValue': Function as PropType<(value: number) => void>,
  itemLabels: Array as Prop<string[]>,
  itemLabelPosition: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'top',
    validator: (v: any) => ['top', 'bottom'].includes(v),
  },
  ripple: Boolean,

  ...makeDensityProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),

  itemLabelRender: Function as PropType<(scope: {
    value: number
    index: number
    label: string | undefined
  }) => UniNode | undefined>,
  itemRender: Function as PropType<(scope: {
    value: number
    index: number
    isFilled: boolean
    isHovered: boolean
    icon: string
    color: string | undefined
    props: {
      color: string | undefined
      density: Density
      disabled: boolean
      icon: string | undefined
      ripple: boolean
      size: number | string
      tag: string
      variant: Variant
    }
  }) => UniNode | undefined>,
}

type RatingProps = ExtractPropTypes<typeof ratingProps>

const UniVRating = uniComponent('v-rating', ratingProps, (name, props, context) => {
  const { themeClasses } = provideTheme(props)
  const rating = useProxiedModel(props, context, 'modelValue')

  const range = computed(() => createRange(Number(props.length), 1))
  const focusIndex = ref(-1)

  const fieldName = computed(() => props.name ?? `v-rating-${getUid()}`)

  provide(VRatingSymbol, {
    rating,
    range,
    focusIndex,
    name: fieldName,
    props: computed(() => props),
  })

  const rootClass = computed(() => {
    return [
      {
        [`${name}--hover`]: props.hover,
        [`${name}--readonly`]: props.readonly,
      },
      themeClasses.value,
    ]
  })

  return {
    rootClass,
    range,
    focusIndex,
  }
})

export const VRating = uni2Platform(UniVRating, (props, state, { $attrs }) => {
  const hasLabels = !!props.itemLabels?.length
  const {
    rootId,
    rootClass,
    rootStyle,
    range,
    focusIndex,
  } = state

  return (
    <props.tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
      { ...$attrs }
    >
      <VRatingItem value={ 0 } index={ -1 } showStar={ false } />

      { range.map((value, i) => (
        <div class="v-rating__wrapper" key={String(i)}>
          {
            !hasLabels ? undefined
            : props.itemLabelRender ? props.itemLabelRender({ value, index: i, label: props.itemLabels?.[i] })
            : props.itemLabels?.[i] ? <span>{ props.itemLabels[i] }</span>
            : <span>&nbsp;</span>
          }
          <div
            class={classNames([
              'v-rating__item',
              {
                'v-rating__item--focused': Math.ceil(focusIndex) === value,
              },
            ])}
          >
            { props.halfIncrements ? (
              <>
                <VRatingItem value={ value - 0.5 } index={ i * 2 } />
                <VRatingItem value={ value } index={ (i * 2) + 1 } />
              </>
            ) : (
              <VRatingItem value={ value } index={ i } />
            ) }
          </div>
        </div>
      )) }
    </props.tag>
  )
})
