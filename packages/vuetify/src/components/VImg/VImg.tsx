import type {
  InjectionKey,
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  onMounted,
  provide,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

import './VImg.sass'

// Components
import { VResponsive } from '@/components/VResponsive'

// Composables
import { makeTransitionProps, nextFrame, useTransition } from '@/composables/transition'

// Utilities
import type { Ref } from '@uni-store/core'
import {
  computed,
  nextTick,
  ref,
  watch,
} from '@uni-store/core'
import {
  convertToUnit,
  SUPPORTS_INTERSECTION,
} from '@/util'

// not intended for public use, this is passed in by vuetify-loader
export interface srcObject {
  src?: string
  srcset?: string
  lazySrc?: string
  aspect: number
}

interface ImgProvide {
  imageEl: Ref<HTMLImageElement | undefined>
  responsiveEl: Ref<HTMLElement | undefined>
}

export const VImgSymbol = 'VImg' as any as InjectionKey<ImgProvide>

const UniVImg = uniComponent('v-img', {
  aspectRatio: [String, Number],
  alt: String,
  cover: Boolean,
  eager: Boolean,
  gradient: String,
  lazySrc: String,
  options: {
    type: Object as PropType<IntersectionObserverInit>,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: undefined,
      rootMargin: undefined,
      threshold: undefined,
    }),
  },
  sizes: String,
  src: {
    type: [String, Object] as PropType<string | srcObject>,
    default: '',
  },
  srcset: String,
  width: [String, Number],

  ...makeTransitionProps(),

  onLoadStart: Function as PropType<(src?: string) => void>,
  onLoad: Function as PropType<(src?: string) => void>,
  onError: Function as PropType<(src?: string) => void>,
  sourcesRender: Function as PropType<() => UniNode | undefined>,
  placeholderRender: Function as PropType<() => UniNode | undefined>,
  errorRender: Function as PropType<() => UniNode | undefined>,
}, (name, props) => {
  const currentSrc = ref('') // Set from srcset
  const image = ref<HTMLImageElement>()
  const setImageRef = useRef(image)

  const responsiveRef = ref<{
    responsiveEl: HTMLElement | undefined
  }>()
  const setResponsiveRef = useRef(responsiveRef)

  provide(VImgSymbol, {
    imageEl: image,
    responsiveEl: computed(() => responsiveRef.value?.responsiveEl),
  })

  const state = ref<'idle' | 'loading' | 'loaded' | 'error'>(props.eager ? 'loading' : 'idle')
  const naturalWidth = ref<number>()
  const naturalHeight = ref<number>()

  const normalisedSrc = computed<srcObject>(() => {
    return props.src && typeof props.src === 'object'
      ? {
        src: props.src.src,
        srcset: props.srcset || props.src.srcset,
        lazySrc: props.lazySrc || props.src.lazySrc,
        aspect: Number(props.aspectRatio || props.src.aspect),
      } : {
        src: props.src,
        srcset: props.srcset,
        lazySrc: props.lazySrc,
        aspect: Number(props.aspectRatio || 0),
      }
  })
  const aspectRatio = computed(() => {
    return normalisedSrc.value.aspect || naturalWidth.value! / naturalHeight.value! || 0
  })

  watch(() => props.src, () => {
    init(state.value !== 'idle')
  })
  // TODO: getSrc when window width changes

  // onBeforeMount(() => init())
  onMounted(() => init())

  function init (isIntersecting?: boolean) {
    if (props.eager && isIntersecting) return
    if (
      SUPPORTS_INTERSECTION &&
      !isIntersecting &&
      !props.eager
    ) return

    state.value = 'loading'
    nextTick(() => {
      props.onLoadStart?.(image.value?.currentSrc || normalisedSrc.value.src)

      if (image.value?.complete) {
        if (!image.value.naturalWidth) {
          onError()
        }

        if (state.value === 'error') return

        if (!aspectRatio.value) pollForSize(image.value, null)
        onLoad()
      } else {
        if (!aspectRatio.value) pollForSize(image.value!)
        getSrc()
      }
    })

    if (normalisedSrc.value.lazySrc) {
      const lazyImg = new Image()
      lazyImg.src = normalisedSrc.value.lazySrc
      pollForSize(lazyImg, null)
    }
  }

  function onLoad () {
    getSrc()
    state.value = 'loaded'
    props.onLoad?.(image.value?.currentSrc || normalisedSrc.value.src)
  }

  function onError () {
    state.value = 'error'
    props.onError?.(image.value?.currentSrc || normalisedSrc.value.src)
  }

  function getSrc () {
    const img = image.value
    if (img) currentSrc.value = img.currentSrc || img.src
  }

  function pollForSize (img: HTMLImageElement, timeout: number | null = 100) {
    const poll = () => {
      const { naturalHeight: imgHeight, naturalWidth: imgWidth } = img

      if (imgHeight || imgWidth) {
        naturalWidth.value = imgWidth
        naturalHeight.value = imgHeight
      } else if (!img.complete && state.value === 'loading' && timeout != null) {
        setTimeout(poll, timeout)
      } else if (img.currentSrc.endsWith('.svg') || img.currentSrc.startsWith('data:image/svg+xml')) {
        naturalWidth.value = 1
        naturalHeight.value = 1
      }
    }

    poll()
  }

  const containClasses = computed(() => ({
    [`${name}__img--cover`]: props.cover,
    [`${name}__img--contain`]: !props.cover,
  }))

  const imgShow = computed(() => state.value === 'loaded')
  const imgTransition = useTransition(imgShow, props.transition as string, true)
  const setRef = (ele?: HTMLImageElement | HTMLPictureElement) => {
    if (ele) {
      imgTransition.setEleRef(ele)
      if (ele.tagName.toLocaleLowerCase() === 'img') {
        setImageRef(ele as HTMLImageElement)
      }
    } else {
      imgTransition.setEleRef(ele)
      setImageRef(ele)
    }
  }
  const __image = computed(() => {
    if (!normalisedSrc.value.src || state.value === 'idle') return

    const sources = props.sourcesRender?.()

    const img = (
      <img
        ref={sources ? undefined : setRef}
        class={classNames([`${name}__img`, containClasses.value])}
        src={normalisedSrc.value.src}
        srcset={normalisedSrc.value.srcset}
        sizes={props.sizes}
        onLoad={onLoad}
        onError={onError}
      />
    )

    return sources ? (
      <picture
        ref={setRef}
        class={classNames([`${name}__picture`])}
      >{ sources }{ img }</picture>
    ) : img
  })

  const isShowPreImg = computed(() => normalisedSrc.value.lazySrc && state.value !== 'loaded')
  const preImgTransition = useTransition(isShowPreImg, props.transition as string, true)
  const __preloadImage = computed(() => {
    return isShowPreImg.value && (
      <img
        ref={preImgTransition.setEleRef}
        class={classNames([`${name}__img`, `${name}__img--preload`, containClasses.value])}
        src={ normalisedSrc.value.lazySrc }
        alt=""
      />
    )
  })

  const isShowPlaceholder = computed(() => state.value === 'loading' || (state.value === 'error' && !props.errorRender))
  const placeholderTransition = useTransition(isShowPlaceholder, props.transition as string, true)
  const __placeholder = computed(() => {
    if (!props.placeholderRender) {
      return
    }

    return isShowPlaceholder.value && (
      <div
        ref={placeholderTransition.setEleRef}
        class={classNames([`${name}__placeholder`])}
      >
        { props.placeholderRender!() }
      </div>
    )
  })

  const isError = computed(() => state.value === 'error')
  const errorTransition = useTransition(isError, props.transition as string, true)
  const __error = computed(() => {
    if (!props.errorRender) return

    return isError.value && (
      <div
        ref={errorTransition.setEleRef}
        class={classNames([`${name}__error`])}
      >{ props.errorRender!() }</div>
    )
  })

  const __gradient = computed(() => {
    if (!props.gradient) return

    return <div class={`${name}__gradient`} style={{ backgroundImage: `linear-gradient(${props.gradient})` }} />
  })

  const isBooted = ref(false)
  const stop = watch(() => aspectRatio.value, val => {
    if (val) {
      // Doesn't work with nextTick, idk why
      nextFrame(() => {
        isBooted.value = true
      })
      stop()
    }
  })
  const rootClass = computed(() => {
    return { [`${name}--booting`]: !isBooted.value }
  })
  const rootWidth = computed(() => {
    return convertToUnit(props.width === 'auto' ? naturalWidth.value : props.width)
  })

  const intersect = computed(() => {
    return {
      value: {
        handler: init,
        options: props.options,
      },
      modifiers: {
        once: true,
      },
    }
  })

  const additionalRender = () => {
    return (
      <>
        {__image.value}
        {__preloadImage.value}
        {__gradient.value}
        {__placeholder.value}
        {__error.value}
      </>
    )
  }

  return {
    rootClass,
    rootWidth,
    aspectRatio,
    intersect,
    additionalRender,

    currentSrc,
    image,
    state,
    naturalWidth,
    naturalHeight,

    setResponsiveRef,
    imageEl: image,
    responsiveEl: computed(() => responsiveRef.value?.responsiveEl),
  }
})

export const VImg = uni2Platform(UniVImg, (props, state, { renders }) => {
  const { alt } = props
  const {
    rootClass,
    rootWidth,
    aspectRatio,
    intersect,
    additionalRender,
    setResponsiveRef,
  } = state
  return (
    <VResponsive
      class={rootClass}
      width={rootWidth}
      aspectRatio={ aspectRatio }
      aria-label={ alt }
      // @ts-expect-error
      role={ alt ? 'img' : undefined }
      intersect={intersect}
      additionalRender={additionalRender}
      ref={setResponsiveRef}
    >
      { renders.defaultRender?.() }
    </VResponsive>
  )
})
