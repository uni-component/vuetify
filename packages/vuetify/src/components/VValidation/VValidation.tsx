import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  uni2Platform,
  uniComponent,
} from '@uni-component/core'

// Composables
import { makeValidationProps, useValidation } from '@/composables/validation'
import type { UnwrapNestedRefs } from '@uni-store/core'

const UniVValidation = uniComponent('v-validation', {
  ...makeValidationProps(),
  defaultRender: Function as PropType<(validation: UnwrapNestedRefs<ReturnType<typeof useValidation>>) => UniNode | undefined>,
}, (_, props) => {
  const validation = useValidation(props, 'validation')

  return {
    validation,
  }
})

export const VValidation = uni2Platform(UniVValidation, (_, state, { renders }) => {
  return renders.defaultRender?.(state.validation)
})
