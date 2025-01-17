// Utilities
import { computed, inject, onUnmounted, provide, ref } from '@uni-component/core'
import { convertToUnit, getUid, propsFactory } from '@/util'

// Types
import type { InjectionKey, Prop, Ref } from '@uni-component/core'

type Position = 'top' | 'left' | 'right' | 'bottom'

type LayoutItem = {
  id: string
  top: number
  bottom: number
  left: number
  right: number
  size: number
}

interface LayoutProvide {
  register: (
    id: string,
    priority: Ref<number>,
    position: Ref<Position>,
    layoutSize: Ref<number | string>,
    elementSize: Ref<number | string>,
    active: Ref<boolean>,
    disableTransitions?: Ref<boolean>
  ) => Ref<{[key: string]: string | undefined}>
  unregister: (id: string) => void
  mainStyles: Ref<{[key: string]: string | undefined}>
  getLayoutItem: (id: string) => LayoutItem | undefined
  items: Ref<LayoutItem[]>
}

export const VuetifyLayoutKey: InjectionKey<LayoutProvide> = Symbol.for('vuetify:layout')

export const makeLayoutProps = propsFactory({
  overlaps: {
    type: Array,
    default: () => ([]),
  } as Prop<string[]>,
  fullHeight: Boolean,
}, 'layout')

// Composables
export const makeLayoutItemProps = propsFactory({
  name: {
    type: String,
  },
  priority: {
    type: [Number, String],
    default: 0,
  },
  absolute: Boolean,
}, 'layout-item')

export function useLayout () {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('Could not find injected Vuetify layout')

  return layout
}

export function useLayoutItem (
  name: string | undefined,
  priority: Ref<number>,
  position: Ref<Position>,
  layoutSize: Ref<number | string>,
  elementSize: Ref<number | string>,
  active: Ref<boolean>,
  disableTransitions?: Ref<boolean>,
) {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('Could not find injected Vuetify layout')

  const id = name ?? `layout-item-${getUid()}`

  const styles = layout.register(id, priority, position, layoutSize, elementSize, active, disableTransitions)

  onUnmounted(() => layout.unregister(id))

  return styles
}

const generateLayers = (
  layout: string[],
  registered: string[],
  positions: Map<string, Ref<Position>>,
  layoutSizes: Map<string, Ref<number | string>>,
  activeItems: Map<string, Ref<boolean>>,
) => {
  let previousLayer = { top: 0, left: 0, right: 0, bottom: 0 }
  const layers = [{ id: '', layer: { ...previousLayer } }]
  const ids = !layout.length ? registered : layout.map(l => l.split(':')[0]).filter(l => registered.includes(l))
  for (const id of ids) {
    const position = positions.get(id)
    const amount = layoutSizes.get(id)
    const active = activeItems.get(id)
    if (!position || !amount || !active) continue

    const layer = {
      ...previousLayer,
      [position.value]: parseInt(previousLayer[position.value], 10) + (active.value ? parseInt(amount.value, 10) : 0),
    }

    layers.push({
      id,
      layer,
    })

    previousLayer = layer
  }

  return layers
}

// TODO: Remove undefined from layout and overlaps when vue typing for required: true prop is fixed
export function createLayout (props: { layout?: string[], overlaps?: string[], fullHeight?: boolean }) {
  const registered = ref<string[]>([])
  const positions = new Map<string, Ref<Position>>()
  const layoutSizes = new Map<string, Ref<number | string>>()
  const priorities = new Map<string, Ref<number>>()
  const activeItems = new Map<string, Ref<boolean>>()
  const transitions = new Map<string, Ref<boolean>>()

  const computedOverlaps = computed(() => {
    const map = new Map<string, { position: Position, amount: number }>()
    const overlaps = props.overlaps ?? []
    for (const overlap of overlaps.filter(item => item.includes(':'))) {
      const [top, bottom] = overlap.split(':')
      if (!registered.value.includes(top) || !registered.value.includes(bottom)) continue

      const topPosition = positions.get(top)
      const bottomPosition = positions.get(bottom)
      const topAmount = layoutSizes.get(top)
      const bottomAmount = layoutSizes.get(bottom)

      if (!topPosition || !bottomPosition || !topAmount || !bottomAmount) continue

      map.set(bottom, { position: topPosition.value, amount: parseInt(topAmount.value, 10) })
      map.set(top, { position: bottomPosition.value, amount: -parseInt(bottomAmount.value, 10) })
    }

    return map
  })

  const layers = computed(() => {
    const entries = [...priorities.entries()]
    const sortedEntries = entries.sort(([, a], [, b]) => a.value - b.value).map(([id]) => id)
    return generateLayers(sortedEntries, registered.value, positions, layoutSizes, activeItems)
  })

  const transitionsEnabled = computed(() => {
    return !Array.from(transitions.values()).some(ref => ref.value)
  })

  const mainStyles = computed(() => {
    const layer = layers.value[layers.value.length - 1].layer

    return {
      position: 'relative',
      paddingLeft: convertToUnit(layer.left),
      paddingRight: convertToUnit(layer.right),
      paddingTop: convertToUnit(layer.top),
      paddingBottom: convertToUnit(layer.bottom),
      ...(transitionsEnabled.value ? undefined : { transition: 'none' }),
    }
  })

  const items = computed(() => {
    return layers.value.slice(1).map(({ id }, index) => {
      const { layer } = layers.value[index]
      const size = layoutSizes.get(id)

      return {
        id,
        ...layer,
        size: Number(size!.value),
      }
    })
  })

  const getLayoutItem = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  provide(VuetifyLayoutKey, {
    register: (
      id: string,
      priority: Ref<number>,
      position: Ref<Position>,
      layoutSize: Ref<number | string>,
      elementSize: Ref<number | string>,
      active: Ref<boolean>,
      disableTransitions?: Ref<boolean>
    ) => {
      priorities.set(id, priority)
      positions.set(id, position)
      layoutSizes.set(id, layoutSize)
      activeItems.set(id, active)
      disableTransitions && transitions.set(id, disableTransitions)
      registered.value.push(id)

      return computed(() => {
        const index = items.value.findIndex(i => i.id === id)

        if (index < 0) throw new Error(`Layout item "${id}" is missing from layout prop`)

        const item = items.value[index]

        if (!item) throw new Error(`Could not find layout item "${id}`)

        const overlap = computedOverlaps.value.get(id)
        if (overlap) {
          item[overlap.position] += overlap.amount
        }

        const isHorizontal = position.value === 'left' || position.value === 'right'
        const isOppositeHorizontal = position.value === 'right'
        const isOppositeVertical = position.value === 'bottom'

        return {
          [position.value]: 0,
          height: isHorizontal ? `calc(100% - ${item.top}px - ${item.bottom}px)` : `${elementSize.value}px`,
          marginLeft: isOppositeHorizontal ? undefined : `${item.left}px`,
          marginRight: isOppositeHorizontal ? `${item.right}px` : undefined,
          marginTop: position.value !== 'bottom' ? `${item.top}px` : undefined,
          marginBottom: position.value !== 'top' ? `${item.bottom}px` : undefined,
          width: !isHorizontal ? `calc(100% - ${item.left}px - ${item.right}px)` : `${elementSize.value}px`,
          zIndex: String(layers.value.length - index),
          transform: `translate${isHorizontal ? 'X' : 'Y'}(${(active.value ? 0 : -110) * (isOppositeHorizontal || isOppositeVertical ? -1 : 1)}%)`,
          ...(transitionsEnabled.value ? undefined : { transition: 'none' }),
        }
      })
    },
    unregister: (id: string) => {
      priorities.delete(id)
      positions.delete(id)
      layoutSizes.delete(id)
      activeItems.delete(id)
      transitions.delete(id)
      registered.value = registered.value.filter(v => v !== id)
    },
    mainStyles,
    getLayoutItem,
    items,
  })

  const layoutClasses = computed(() => [
    'v-layout',
    { 'v-layout--full-height': props.fullHeight },
  ])

  return {
    layoutClasses,
    getLayoutItem,
    items,
  }
}
