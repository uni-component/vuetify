import { h, uni2Platform, uniComponent } from '@uni-component/core'

export function createSimpleFunctional (
  klass: string,
  tag = 'div',
  name?: string
) {
  name = name ?? klass.replace(/__/g, '-')
  return uni2Platform(uniComponent(name, {
    tag: {
      type: String,
      default: tag,
    },
  }, () => ({})), (props, _, { renders }) => {
    return (
      <props.tag class={klass}>
        { renders.defaultRender?.() }
      </props.tag>
    )
  })
}
