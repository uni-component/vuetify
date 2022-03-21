// Utilities
import { computed, ref } from '@uni-component/core'

// Types
import type { Context, Ref } from '@uni-component/core'

// Composables
export function useProxiedModel<
  Props extends object & { [key in Prop as `onUpdate:${Prop}`]?: ((val: any) => void) | undefined },
  Prop extends Extract<keyof Props, string>,
  Inner = Props[Prop],
> (
  props: Props,
  context: Context,
  prop: Prop,
  defaultValue?: Props[Prop],
  transformIn: (value?: Props[Prop]) => Inner = (v: any) => v,
  transformOut: (value: Inner) => Props[Prop] = (v: any) => v,
) {
  const propIsDefined = computed(() => {
    return !!(
      typeof props[prop] !== 'undefined' &&
      context.nodeProps?.hasOwnProperty(prop)
    )
  })

  const internal = ref(transformIn(props[prop])) as Ref<Inner>

  return computed<Inner>({
    get () {
      if (propIsDefined.value) return transformIn(props[prop])
      else return internal.value
    },
    set (newValue) {
      internal.value = newValue
      const cb = `onUpdate:${prop}` as `onUpdate:${Prop}`
      props[cb] && (props[cb] as any)(transformOut(newValue))
    },
  })
}
