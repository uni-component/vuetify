import type { PropType, UniNode } from '@uni-component/core'
import { classNames, h, uni2Platform, uniComponent } from '@uni-component/core'
// Styles
import './VBadge.sass'

// Components
import { VIcon } from '@/components/VIcon'

// Composables
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeTransitionProps, useTransition } from '@/composables/transition'
import { useBackgroundColor, useTextColor } from '@/composables/color'

// Utilities
import { computed, toRef } from '@uni-store/core'
import { convertToUnit } from '@/util'

const UniVBadge = uniComponent('v-badge', {
  bordered: Boolean,
  color: {
    type: String,
    default: 'primary',
  },
  content: String,
  dot: Boolean,
  floating: Boolean,
  icon: String,
  inline: Boolean,
  // todo
  label: {
    type: String,
    default: '$vuetify.badge',
  },
  location: {
    type: String,
    default: 'top-right',
    // validator: (value: string) => {
    //   const [vertical, horizontal] = (value ?? '').split('-')

    //   return (
    //     ['top', 'bottom'].includes(vertical) &&
    //     ['left', 'right'].includes(horizontal)
    //   )
    // },
  },
  max: [Number, String],
  modelValue: {
    type: Boolean,
    default: true,
  },
  offsetX: [Number, String],
  offsetY: [Number, String],
  textColor: String,
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeTransitionProps({ transition: 'scale-rotate-transition' }),
  badgeRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
  const { roundedClasses } = useRounded(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'textColor'))

  const position = computed(() => {
    return props.floating
      ? (props.dot ? 2 : 4)
      : (props.dot ? 8 : 12)
  })

  function calculatePosition (offset?: number | string) {
    return `calc(100% - ${convertToUnit(position.value + parseInt(offset ?? 0, 10))})`
  }

  const locationStyles = computed(() => {
    const [vertical, horizontal] = (props.location ?? '').split('-')

    // TODO: RTL support

    const styles = {
      bottom: 'auto',
      left: 'auto',
      right: 'auto',
      top: 'auto',
    }

    if (!props.inline) {
      styles[horizontal === 'left' ? 'right' : 'left'] = calculatePosition(props.offsetX)
      styles[vertical === 'top' ? 'bottom' : 'top'] = calculatePosition(props.offsetY)
    }

    return styles
  })

  const rootClass = computed(() => {
    return [
      {
        [`${name}--bordered`]: props.bordered,
        [`${name}--dot`]: props.dot,
        [`${name}--floating`]: props.floating,
        [`${name}--inline`]: props.inline,
      },
    ]
  })

  const badgeShow = computed(() => props.modelValue)
  const badgeTransition = useTransition(badgeShow, props.transition as string | boolean)

  const badgeVNode = computed(() => {
    const value = Number(props.content)
    const content = (!props.max || isNaN(value)) ? props.content
      : value <= props.max ? value
      : `${props.max}+`

    const badgeCls = classNames([
      'v-badge__badge',
      backgroundColorClasses.value,
      roundedClasses.value,
      textColorClasses.value,
      badgeTransition.transtionClass.value,
    ])
    const badgeStyle = {
      ...backgroundColorStyles.value,
      ...locationStyles.value,
      ...textColorStyles.value,
      ...badgeTransition.style.value,
    }
    return (
      <span
        class={badgeCls}
        style={badgeStyle}
        aria-atomic="true"
        aria-label="locale string here" // TODO: locale string here
        aria-live="polite"
        role="status"
        // { ...badgeAttrs }
        onTransitionEnd={badgeTransition.onTransitionEnd}
      >
        {
          props.dot ? undefined
          : props.badgeRender ? props.badgeRender()
          : props.icon ? <VIcon icon={props.icon} />
          : <span class="v-badge__content">{content}</span>
        }
      </span>
    )
  })

  return {
    rootClass,
    badgeVNode,
  }
})

export const VBadge = uni2Platform(UniVBadge, (props, state, { renders }) => {
  const {
    rootClass,
    badgeVNode,
  } = state

  // todo
  // const [badgeAttrs, attrs] = pick(ctx.attrs as Record<string, any>, [
  //   'aria-atomic',
  //   'aria-label',
  //   'aria-live',
  //   'role',
  //   'title',
  // ])

  return (
    <props.tag
      class={rootClass}
      // { ...attrs }
    >
      <div class="v-badge__wrapper">
        { renders.defaultRender?.() }
        { badgeVNode }
      </div>
    </props.tag>
  )
})
