import { h, onUnmounted, uni2Platform, uniComponent, useRef } from '@uni-component/core'

// Styles
import './VParallax.sass'

// Components
import { VImg } from '@/components/VImg'

// Composables
import { useIntersectionObserver } from '@/composables/intersectionObserver'

// Utilities
import { computed, ref, watch, watchEffect } from '@uni-store/core'
import { getScrollParent } from '@/util'

function floor (val: number) {
  return Math.floor(Math.abs(val)) * Math.sign(val)
}

const UniVParallax = uniComponent('v-parallax', {
  // todo
  // inherit img
  src: String,
  scale: {
    type: [Number, String],
    default: 1.3,
  },
}, (name, props) => {
  const imgRef = ref<{
    imageEl: HTMLElement | undefined
    responsiveEl: HTMLElement | undefined
  }>()
  const setImgRef = useRef(imgRef)
  const { intersectionRef, isIntersecting } = useIntersectionObserver()

  watchEffect(() => {
    intersectionRef.value = imgRef.value?.responsiveEl
  })

  let scrollParent: Element
  watch(isIntersecting, val => {
    if (val) {
      scrollParent = getScrollParent(intersectionRef.value)
      scrollParent = scrollParent === document.scrollingElement ? document as any : scrollParent
      scrollParent.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    } else {
      scrollParent.removeEventListener('scroll', onScroll)
    }
  })

  onUnmounted(() => {
    scrollParent?.removeEventListener('scroll', onScroll)
  })

  let frame = -1
  function onScroll () {
    if (!isIntersecting.value) return

    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const el: HTMLElement | undefined = imgRef.value?.imageEl
      if (!el) return

      const rect = intersectionRef.value!.getBoundingClientRect()
      const scrollHeight = scrollParent.clientHeight ?? window.innerHeight
      const scrollPos = scrollParent.scrollTop ?? window.scrollY
      const top = rect.top + scrollPos
      const progress = (scrollPos + scrollHeight - top) / (rect.height + scrollHeight)
      const translate = floor((rect.height * +props.scale - rect.height) * (-progress + 0.5))

      el.style.setProperty('transform', `translateY(${translate}px) scale(${props.scale})`)
    })
  }

  const rootClass = computed(() => {
    return {
      [`${name}--active`]: isIntersecting.value,
    }
  })

  return {
    rootClass,
    onScroll,
    setImgRef,
  }
})

export const VParallax = uni2Platform(UniVParallax, (props, state, { renders }) => {
  const { rootClass, onScroll, setImgRef } = state
  return (
    <VImg
      class={ rootClass }
      cover
      src={props.src}
      onLoadStart={ onScroll }
      onLoad={ onScroll }
      { ...renders }
      ref={ setImgRef }
    />
  )
})
