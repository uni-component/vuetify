import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Composables
import { makeTagProps } from '@/composables/tag'
import { useTextColor } from '@/composables/color'

// Utilities
import { computed, toRef } from '@uni-store/core'

const UniVListSubheader = uniComponent('v-list-subheader', {
  color: String,
  inset: Boolean,

  ...makeTagProps(),
}, (name, props) => {
  const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))

  const rootClass = computed(() => {
    return [
      props.inset && `${name}--inset`,
      textColorClasses.value,
    ]
  })
  const rootStyle = computed(() => {
    return textColorStyles.value
  })

  return {
    rootClass,
    rootStyle,
  }
})

export const VListSubheader = uni2Platform(UniVListSubheader, (props, state, { renders }) => {
  const text = renders.defaultRender?.()
  return (
    <props.tag
      id={state.rootId}
      class={state.rootClass}
      style={state.rootStyle}
    >
      { text && (
        <div class="v-list-subheader__text">
          { text }
        </div>
      ) }
    </props.tag>
  )
})
