import type { PropType } from '@uni-component/core'
import { capitalize, h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VGrid.sass'

// Composables
import { makeTagProps } from '@/composables/tag'

// Utilities
import { computed } from '@uni-store/core'

// Types
// todo
import type { Prop } from '@vue/runtime-core'

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const // no xs

type ALIGNMENT = 'start' | 'end' | 'center'

type BPS = typeof breakpoints
type GetBreakPointsResult<
  P extends string = '',
  T = Prop<string, null>
> = {
  [K in BPS[number] as `${P}${Capitalize<K>}`]: T
}

function makeRowProps (prefix: string, def: () => Prop<string, null>) {
  return breakpoints.reduce((props, val) => {
    props[prefix + capitalize(val)] = def()
    return props
  }, {} as Record<string, Prop<string, null>>)
}

type AlignValidator = ALIGNMENT | 'baseline' | 'stretch'
const alignProps = makeRowProps('align', () => ({
  type: String as PropType<AlignValidator>,
  default: null,
})) as GetBreakPointsResult<'align', Prop<AlignValidator>>

type JustifyValidator = ALIGNMENT | 'space-between' | 'space-around'
const justifyProps = makeRowProps('justify', () => ({
  type: String as PropType<JustifyValidator>,
  default: null,
})) as GetBreakPointsResult<'justify', Prop<JustifyValidator>>

type AlignContentValidator = ALIGNMENT | 'space-between' | 'space-around' | 'stretch'
const alignContentProps = makeRowProps('alignContent', () => ({
  type: String as PropType<AlignContentValidator>,
  default: null,
})) as GetBreakPointsResult<'alignContent', Prop<AlignContentValidator>>

const propMap = {
  align: Object.keys(alignProps),
  justify: Object.keys(justifyProps),
  alignContent: Object.keys(alignContentProps),
}

const classMap = {
  align: 'align',
  justify: 'justify',
  alignContent: 'align-content',
}

function breakpointClass (type: keyof typeof propMap, prop: string, val: string) {
  let className = classMap[type]
  if (val == null) {
    return undefined
  }
  if (prop) {
    // alignSm -> Sm
    const breakpoint = prop.replace(type, '')
    className += `-${breakpoint}`
  }
  // .align-items-sm-center
  className += `-${val}`
  return className.toLowerCase()
}

const UniVRow = uniComponent('v-row', {
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String as PropType<AlignValidator>,
    default: null,
  },
  ...alignProps,
  justify: {
    type: String as PropType<JustifyValidator>,
    default: null,
  },
  ...justifyProps,
  alignContent: {
    type: String as PropType<AlignContentValidator>,
    default: null,
  },
  ...alignContentProps,
  ...makeTagProps(),
}, (name, props) => {
  const rootClass = computed(() => {
    const classList: any[] = []

    // Loop through `align`, `justify`, `alignContent` breakpoint props
    let type: keyof typeof propMap
    for (type in propMap) {
      propMap[type].forEach(prop => {
        const value: string = (props as any)[prop]
        const className = breakpointClass(type, prop, value)
        if (className) classList!.push(className)
      })
    }

    classList.push({
      [`${name}--no-gutters`]: props.noGutters,
      [`${name}--dense`]: props.dense,
      [`align-${props.align}`]: props.align,
      [`justify-${props.justify}`]: props.justify,
      [`align-content-${props.alignContent}`]: props.alignContent,
    })

    return classList
  })

  return {
    rootClass,
  }
})

export const VRow = uni2Platform(UniVRow, (props, state, { renders }) => {
  return (
    <props.tag class={state.rootClass}>
      { renders.defaultRender?.() }
    </props.tag>
  )
})
