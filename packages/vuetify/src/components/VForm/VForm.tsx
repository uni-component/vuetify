import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { createForm, makeFormProps } from '@/composables/form'

const UniVForm = uniComponent('v-form', {
  ...makeFormProps(),
}, (_, props, context) => {
  return createForm(props, context)
})

export const VForm = uni2Platform(UniVForm, (props, state, { renders }) => {
  return (
    <form
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
      noValidate
      onReset={ state.reset }
      onSubmit={ state.submit }
    >
      { props.defaultRender ? props.defaultRender(state) : renders.defaultRender?.(state) }
    </form>
  )
})
