import type { PropType, UniNode } from '@uni-component/core'
import { computed, h, onMounted, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VListItem.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VListItemAvatar } from './VListItemAvatar'
import { VListItemHeader } from './VListItemHeader'
import { VListItemSubtitle } from './VListItemSubtitle'
import { VListItemTitle } from './VListItemTitle'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
// import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'

// Directives
import { Ripple } from '@/directives/ripple'
import { useDirective } from '@/composables/directive'

// Utilities
import { useNestedItem } from '@/composables/nested/nested'
import { useList } from './VList'

type ListItemSlot = {
  isActive: boolean
  activate: (activated: boolean, e: Event) => void
  isSelected: boolean
  select: (selected: boolean, e: Event) => void
}

const UniName = 'v-list-item'

const UniVListItem = uniComponent(UniName, {
  active: Boolean,
  activeColor: String,
  activeClass: String,
  appendAvatar: String,
  appendIcon: String,
  disabled: Boolean,
  link: Boolean,
  prependAvatar: String,
  prependIcon: String,
  subtitle: String,
  title: String,
  value: null,

  ...makeBorderProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  // ...makeRouterProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({ variant: 'text' } as const),
  onClick: Function as PropType<(e: MouseEvent) => void>,

  prependRender: Function as PropType<(scope: ListItemSlot) => UniNode | undefined>,
  appendRender: Function as PropType<(scope: ListItemSlot) => UniNode | undefined>,
  defaultRender: Function as PropType<(scope: ListItemSlot) => UniNode | undefined>,
  titleRender: Function as PropType<() => UniNode | undefined>,
  subtitleRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  // const link = useLink(props, attrs)
  // const id = computed(() => props.value ?? link.href.value)
  const id = computed(() => props.value)
  const { activate, isActive: isNestedActive, select, isSelected, root, parent } = useNestedItem(id)
  const list = useList()
  const isActive = computed(() => {
    // return props.active || link.isExactActive?.value || isNestedActive.value
    return props.active || isNestedActive.value
  })
  const activeColor = props.activeColor ?? props.color
  const variantProps = computed(() => ({
    color: isActive.value ? activeColor : props.color,
    textColor: props.textColor,
    variant: props.variant,
  }))

  onMounted(() => {
    // link.isExactActive?.value &&
    if (parent.value != null) {
      root.open(parent.value, true)
    }
  })

  const { themeClasses } = provideTheme(props)
  const { borderClasses } = useBorder(props)
  const { colorClasses, colorStyles, variantClasses } = useVariant(variantProps)
  const { densityClasses } = useDensity(props)
  const { dimensionStyles } = useDimension(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)

  const slotProps = computed(() => ({
    isActive: isActive.value,
    activate,
    select,
    isSelected: isSelected.value,
  }))

  const isClickable = computed(() => {
    // return !props.disabled && (link.isClickable.value || props.link || props.value != null)
    return !props.disabled && (props.link || props.value != null)
  })

  const hasAppend = computed(() => !!(props.appendRender || props.appendAvatar || props.appendIcon))
  const hasPrepend = computed(() => !!(props.prependRender || props.prependAvatar || props.prependIcon))

  const rootClass = computed(() => {
    return [
      {
        [`${name}--active`]: isActive.value,
        [`${name}--disabled`]: props.disabled,
        [`${name}--link`]: isClickable,
        [`${name}--prepend`]: !hasPrepend && list?.hasPrepend.value,
        [`${props.activeClass}`]: isActive.value && props.activeClass,
      },
      themeClasses.value,
      borderClasses.value,
      colorClasses.value,
      densityClasses.value,
      elevationClasses.value,
      roundedClasses.value,
      variantClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return {
      ...colorStyles.value,
      ...dimensionStyles.value,
    }
  })

  const rippleDirective = useDirective(Ripple, computed(() => {
    return {
      value: isClickable.value,
      modifiers: {},
    }
  }))

  const onClick = (e: MouseEvent) => {
    props.onClick?.(e)
    // link.navigate?.(e)
    props.value != null && activate(!isNestedActive.value, e)
  }

  return {
    rootClass,
    rootStyle,
    hasAppend,
    hasPrepend,
    isClickable,
    isActive,
    slotProps,
    list,
    rippleDirective,
    onClick,
  }
})

export const VListItem = uni2Platform(UniVListItem, (props, state, { renders }) => {
  // const Tag = (link.isLink.value) ? 'a' : props.tag
  const Tag = props.tag
  const hasTitle = (props.titleRender || props.title)
  const hasSubtitle = (props.subtitleRender || props.subtitle)
  const hasHeader = !!(hasTitle || hasSubtitle)
  const {
    rootId,
    rootClass,
    rootStyle,
    hasAppend,
    hasPrepend,
    isClickable,
    isActive,
    slotProps,
    list,
    rippleDirective,
    onClick,
  } = state

  list?.updateHasPrepend(hasPrepend)

  return (
    <Tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
      // href={ link.href.value }
      tabIndex={ isClickable ? 0 : undefined }
      onClick={ isClickable ? onClick : undefined }
      ref={rippleDirective.setEleRef}
    >
      { genOverlays(isClickable || isActive, UniName) }

      { hasPrepend && (
        props.prependRender
          ? props.prependRender(slotProps)
          : (
            <VListItemAvatar left>
              <VAvatar
                density={ props.density }
                icon={ props.prependIcon }
                image={ props.prependAvatar }
              />
            </VListItemAvatar>
          )
      ) }

      { hasHeader && (
        <VListItemHeader>
          { hasTitle && (
            <VListItemTitle>
              { props.titleRender
                ? props.titleRender()
                : props.title
              }
            </VListItemTitle>
          ) }

          { hasSubtitle && (
            <VListItemSubtitle>
              { props.subtitleRender
                ? props.subtitleRender()
                : props.subtitle
              }
            </VListItemSubtitle>
          ) }
        </VListItemHeader>
      ) }

      { (props.defaultRender || renders.defaultRender)?.(slotProps) }

      { hasAppend && (
        props.appendRender
          ? props.appendRender(slotProps)
          : (
            <VListItemAvatar right>
              <VAvatar
                density={ props.density }
                icon={ props.appendIcon }
                image={ props.appendAvatar }
              />
            </VListItemAvatar>
          )
      ) }
    </Tag>
  )
})
