// Utilities
import { computed, isRef } from '@uni-store/core'
import { h, inject, uni2Platform, uniComponent } from '@uni-component/core'
import { propsFactory } from '@/util'

// Types
import type { Ref } from '@uni-store/core'
import type { InjectionKey, PlatformComponent, PropType } from '@uni-component/core'

export type IconValue = string | PlatformComponent<any>

export interface IconAliases {
  [name: string]: IconValue
  complete: IconValue
  cancel: IconValue
  close: IconValue
  delete: IconValue
  clear: IconValue
  success: IconValue
  info: IconValue
  warning: IconValue
  error: IconValue
  prev: IconValue
  next: IconValue
  checkboxOn: IconValue
  checkboxOff: IconValue
  checkboxIndeterminate: IconValue
  delimiter: IconValue
  sort: IconValue
  expand: IconValue
  menu: IconValue
  subgroup: IconValue
  dropdown: IconValue
  radioOn: IconValue
  radioOff: IconValue
  edit: IconValue
  ratingEmpty: IconValue
  ratingFull: IconValue
  ratingHalf: IconValue
  loading: IconValue
  first: IconValue
  last: IconValue
  unfold: IconValue
  file: IconValue
  plus: IconValue
  minus: IconValue
}

export interface IconProps {
  tag: string
  icon: IconValue
  disabled?: Boolean
}

type IconComponent = PlatformComponent<IconProps>

export interface IconSet {
  component: IconComponent
}

export type IconOptions = {
  defaultSet: string
  aliases?: Partial<IconAliases>
  sets: Record<string, IconSet>
}

type IconInstance = {
  component: IconComponent
  icon: IconValue
}

export const IconSymbol: InjectionKey<IconOptions> = Symbol.for('vuetify:icons')

export const makeIconProps = propsFactory({
  icon: {
    type: [String, Object] as PropType<IconValue>,
    required: true,
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: String,
    required: true,
  },
}, 'icon')

const UniVComponentIcon = uniComponent('v-component-icon', makeIconProps(), () => {
  return {}
})

export const VComponentIcon = uni2Platform(UniVComponentIcon, (props, state) => {
  return (
    <props.tag class={state.rootClass}>
      <props.icon />
    </props.tag>
  )
})

const UniVSvgIcon = uniComponent('v-svg-icon', makeIconProps(), () => {
  return {}
})

export const VSvgIcon = uni2Platform(UniVSvgIcon, (props, state) => {
  // todo attrs
  return (
    <props.tag class={state.rootClass} style={ null }>
      <svg
        class="v-icon__svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
      >
        <path d={ props.icon as string }></path>
      </svg>
    </props.tag>
  )
})

const UniVLigatureIcon = uniComponent('v-ligature-icon', makeIconProps(), () => {
  return {}
})

export const VLigatureIcon = uni2Platform(UniVLigatureIcon, (props, state) => {
  return <props.tag class={state.rootClass}>{ props.icon }</props.tag>
})

const UniVClassIcon = uniComponent('v-class-icon', makeIconProps(), (_, props) => {
  const rootClass = computed(() => props.icon)
  return {
    rootClass,
  }
})

export const VClassIcon = uni2Platform(UniVClassIcon, (props, state) => {
  return <props.tag class={ state.rootClass }></props.tag>
})

export const defaultSets: Record<string, IconSet> = {
  svg: {
    component: VSvgIcon,
  },
  class: {
    component: VClassIcon,
  },
}

// Composables
export const useIcon = (props: Ref<string | undefined> | { icon?: IconValue }) => {
  const icons = inject(IconSymbol)

  if (!icons) throw new Error('Missing Vuetify Icons provide!')

  const iconData: Ref<IconInstance> = computed(() => {
    const iconAlias = isRef(props) ? props.value : props.icon

    if (!iconAlias) throw new Error('Icon value is undefined or null')

    let icon: IconValue | undefined = iconAlias

    if (typeof iconAlias === 'string' && iconAlias.includes('$')) {
      icon = icons.aliases?.[iconAlias.slice(iconAlias.indexOf('$') + 1)]
    }

    if (!icon) throw new Error(`Could not find aliased icon "${iconAlias}"`)

    if (typeof icon !== 'string') {
      return {
        component: VComponentIcon,
        icon,
      }
    }

    const iconSetName = Object.keys(icons.sets).find(
      setName => typeof icon === 'string' && icon.startsWith(`${setName}:`)
    )

    const iconName = iconSetName ? icon.slice(iconSetName.length + 1) : icon
    const iconSet = icons.sets[iconSetName ?? icons.defaultSet]

    return {
      component: iconSet.component,
      icon: iconName,
    }
  })

  return { iconData }
}
