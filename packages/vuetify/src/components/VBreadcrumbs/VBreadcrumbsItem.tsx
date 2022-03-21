import { computed, h, inject, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
// import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { useTextColor } from '@/composables/color'

// Utilities
import { VBreadcrumbsSymbol } from './shared'

const UniVBreadcrumbsItem = uniComponent('v-breadcrumbs-item', {
  active: Boolean,
  activeClass: String,
  activeColor: String,
  color: String,
  disabled: Boolean,
  text: String,

  // ...makeRouterProps(),
  ...makeTagProps({ tag: 'li' }),
}, (name, props) => {
  const breadcrumbs = inject(VBreadcrumbsSymbol)

  if (!breadcrumbs) throw new Error('[Vuetify] Could not find v-breadcrumbs provider')

  // const link = useLink(props, attrs)
  const isActive = computed(() => {
    // return props.active || link.isExactActive?.value
    return props.active
  })
  const color = computed(() => {
    if (isActive.value) return props.activeColor ?? breadcrumbs.color.value

    return props.color
  })
  const { textColorClasses, textColorStyles } = useTextColor(color)

  const rootClass = computed(() => {
    return [
      {
        [`${name}--active`]: isActive.value,
        [`${name}--disabled`]: props.disabled || breadcrumbs.disabled.value,
        // [`${name}--link`]: link.isLink.value,
        [`${name}--link`]: props.tag === 'a',
        [`${props.activeClass}`]: isActive.value && props.activeClass,
      },
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return textColorStyles.value
  })

  return {
    rootClass,
    rootStyle,
    isActive,
  }
})

export const VBreadcrumbsItem = uni2Platform(UniVBreadcrumbsItem, (props, state, { renders }) => {
  // const Tag = (link.isLink.value) ? 'a' : props.tag
  const Tag = props.tag

  const text = renders.defaultRender?.() || props.text
  return (
    <Tag
      class={state.rootClass}
      style={state.rootStyle}
      aria-current={ state.isActive ? 'page' : undefined }
      // onClick={ state.isActive && link.navigate }
    >
      { text }
    </Tag>
  )
})
