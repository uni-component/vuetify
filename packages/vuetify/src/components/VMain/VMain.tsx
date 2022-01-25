import { h, uni2Platform, uniComponent } from '@uni-component/core'

// Styles
import './VMain.sass'

// Composables
import { makeTagProps } from '@/composables/tag'
import { useLayout } from '@/composables/layout'
import { useSsrBoot } from '@/composables/ssrBoot'
import { computed } from '@uni-store/core'

const UniVMain = uniComponent('v-main', makeTagProps({ tag: 'main' }), (name, props) => {
  const { mainStyles } = useLayout()
  const { ssrBootStyles } = useSsrBoot()

  const rootStyle = computed(() => {
    return {
      ...mainStyles.value,
      ...ssrBootStyles.value,
    }
  })

  return {
    rootStyle,
  }
})

export const VMain = uni2Platform(UniVMain, (props, state, { renders }) => {
  const { rootId, rootClass, rootStyle } = state
  return (
    <props.tag
      id={rootId}
      class={rootClass}
      style={rootStyle}
    >
      <div class="v-main__wrap">
        { renders.defaultRender?.() }
      </div>
    </props.tag>
  )
})
