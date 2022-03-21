import type { ComputedRef, PropType, UniNode } from '@uni-component/core'
import { computed, Fragment, h, provide, toRef, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VBreadcrumbs.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VBreadcrumbsItem } from './VBreadcrumbsItem'
import { VBreadcrumbsDivider } from './VBreadcrumbsDivider'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useTextColor } from '@/composables/color'

// Utilities
import { VBreadcrumbsSymbol } from './shared'

// Types
// import type { LinkProps } from '@/composables/router'

// export type BreadcrumbItem = string | (LinkProps & {
//   text: string
// })

export type BreadcrumbItem = string | {
  href?: string
  text: string
}

type InnerItem = {
  props: {
    href?: string | undefined
    text: string
    disabled: boolean
  }
}

const UniVBreadcrumbs = uniComponent('v-breadcrumbs', {
  color: String,
  disabled: Boolean,
  divider: {
    type: String,
    default: '/',
  },
  icon: String,
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    default: () => ([]),
  },

  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeTagProps({ tag: 'ul' }),
  itemRender: Function as PropType<(scope: InnerItem & {index: number}) => UniNode | string | undefined>,
  dividerRender: Function as PropType<(scope: InnerItem & {index: number}) => UniNode | string | undefined>,
}, (_, props) => {
  const { densityClasses } = useDensity(props)
  const { roundedClasses } = useRounded(props)
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))
  const items: ComputedRef<InnerItem[]> = computed(() => {
    return props.items.map((item, index, array) => ({
      props: {
        disabled: index >= array.length - 1,
        ...(typeof item === 'string' ? { text: item } : item),
      },
    }))
  })

  provide(VBreadcrumbsSymbol, {
    color: toRef(props, 'color'),
    disabled: toRef(props, 'disabled'),
  })

  const rootClass = computed(() => {
    return [
      densityClasses.value,
      roundedClasses.value,
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => textColorStyles.value)

  return {
    rootClass,
    rootStyle,
    items,
  }
})

export const VBreadcrumbs = uni2Platform(UniVBreadcrumbs, (props, state, { renders }) => {
  const {
    rootClass,
    rootStyle,
    items,
  } = state
  return (
    <props.tag
      class={rootClass}
      style={rootStyle}
    >
      { props.icon && (
        <VIcon icon={ props.icon } left />
      ) }

      { items.map((item, index) => (
        <Fragment key={ String(index) }>
          <VBreadcrumbsItem
            { ...item.props }
          >
            { props.itemRender?.({ ...item, index }) }
          </VBreadcrumbsItem>

          { index < props.items.length - 1 && (
            <VBreadcrumbsDivider tag={props.tag === 'ul' ? 'li' : 'span'}>
              { props.dividerRender ? props.dividerRender({ ...item, index }) : props.divider }
            </VBreadcrumbsDivider>
          ) }
        </Fragment>
      )) }

      { renders.defaultRender?.() }
    </props.tag>
  )
})
