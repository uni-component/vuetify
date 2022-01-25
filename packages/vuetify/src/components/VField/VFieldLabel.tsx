import {
  h,
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Components
import { VLabel } from '@/components/VLabel'
import { computed } from '@uni-store/core'

const UniVFieldLabel = uniComponent('v-field-label', {
  floating: Boolean,
  for: String,
}, (name, props) => {
  const rootClass = computed(() => {
    return { [`${name}--floating`]: props.floating }
  })

  return {
    rootClass,
  }
})

export const VFieldLabel = uni2Platform(UniVFieldLabel, (props, state, { renders }) => {
  return (
    <VLabel
      class={state.rootClass}
      for={props.for}
      aria-hidden={ props.floating || undefined }
    > { renders.defaultRender?.() } </VLabel>
  )
})
