import type { PropType } from '@uni-component/core'
import { capitalize, h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VGrid.sass'

// Composables
import { makeTagProps } from '@/composables/tag'

// Utilities
import { computed } from '@uni-store/core'

// Types
import type { Prop } from '@vue/runtime-core'

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const // no xs

type BPS = typeof breakpoints
type BreakPointsResult<
  T = Prop<boolean | string | number, false>
> = {
  [K in BPS[number]]: T
}

type GetBreakPointsResult<
  P extends string = '',
  T = Prop<boolean | string | number, false>
> = {
  [K in BPS[number] as `${P}${Capitalize<K>}`]: T
}

const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number],
      default: false,
    }
    return props
  }, {} as Record<string, Prop<boolean | string | number, false>>) as any as BreakPointsResult
})()

const offsetProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['offset' + capitalize(val)] = {
      type: [String, Number],
      default: null,
    }
    return props
  }, {} as Record<string, Prop<string | number, null>>) as any as GetBreakPointsResult<'offset', Prop<string | number, null>>
})()

const orderProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['order' + capitalize(val)] = {
      type: [String, Number],
      default: null,
    }
    return props
  }, {} as Record<string, Prop<string | number, null>>) as any as GetBreakPointsResult<'order', Prop<string | number, null>>
})()

const propMap = {
  col: Object.keys(breakpointProps),
  offset: Object.keys(offsetProps),
  order: Object.keys(orderProps),
}

function breakpointClass (type: keyof typeof propMap, prop: string, val: boolean | string | number) {
  let className: string = type
  if (val == null || val === false) {
    return undefined
  }
  if (prop) {
    const breakpoint = prop.replace(type, '')
    className += `-${breakpoint}`
  }
  if (type === 'col') {
    className = 'v-' + className
  }
  // Handling the boolean style prop when accepting [Boolean, String, Number]
  // means Vue will not convert <v-col sm></v-col> to sm: true for us.
  // Since the default is false, an empty string indicates the prop's presence.
  if (type === 'col' && (val === '' || val === true)) {
    // .v-col-md
    return className.toLowerCase()
  }
  // .order-md-6
  className += `-${val}`
  return className.toLowerCase()
}

const UniVCol = uniComponent('v-col', {
  cols: {
    type: [Boolean, String, Number],
    default: false,
  },
  ...breakpointProps,
  offset: {
    type: [String, Number],
    default: null,
  },
  ...offsetProps,
  order: {
    type: [String, Number],
    default: null,
  },
  ...orderProps,
  alignSelf: {
    type: String as PropType<'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'>,
    default: null,
  },
  ...makeTagProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    const classList: any[] = []

    // Loop through `col`, `offset`, `order` breakpoint props
    let type: keyof typeof propMap
    for (type in propMap) {
      propMap[type].forEach(prop => {
        const value: string | number | boolean = (props as any)[prop]
        const className = breakpointClass(type, prop, value)
        if (className) classList!.push(className)
      })
    }

    const hasColClasses = classList.some(className => className.startsWith('v-col-'))

    classList.push({
      // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
      // todo no useless always have v-col class
      [name]: !hasColClasses || !props.cols,
      [`${name}-${props.cols}`]: props.cols,
      [`offset-${props.offset}`]: props.offset,
      [`order-${props.order}`]: props.order,
      [`align-self-${props.alignSelf}`]: props.alignSelf,
    })

    return classList
  })
  return {
    rootClass,
  }
})

export const VCol = uni2Platform(UniVCol, (props, state, { renders }) => {
  const { rootClass } = state
  return (
    <props.tag class={rootClass}>
      { renders.defaultRender?.() }
    </props.tag>
  )
})
