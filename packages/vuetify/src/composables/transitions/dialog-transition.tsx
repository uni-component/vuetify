import type { TransitionHooks } from '../transition'
import { acceleratedEasing, deceleratedEasing, nullifyTransforms } from '@/util'

export const dialogTransition = () => {
  const hooks: TransitionHooks = {
    beforeEnter (el) {
      el.style.pointerEvents = 'none'
    },
    enter (el, done: () => void) {
      new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
        const { x, y } = getDimensions((el as any).dialogTarget as HTMLElement, el)

        const animation = el.animate([
          { transform: `translate(${x}px, ${y}px) scale(0.1)`, opacity: 0 },
          { transform: '' },
        ], {
          duration: 225,
          easing: deceleratedEasing,
        })
        animation.finished.then(() => done())
      })
    },
    afterEnter (el) {
      el.style.removeProperty('pointer-events')
    },
    beforeLeave (el) {
      el.style.pointerEvents = 'none'
    },
    leave (el, done: () => void) {
      new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
        const { x, y } = getDimensions((el as any).dialogTarget as HTMLElement, el)

        const animation = el.animate([
          { transform: '' },
          { transform: `translate(${x}px, ${y}px) scale(0.1)`, opacity: 0 },
        ], {
          duration: 125,
          easing: acceleratedEasing,
        })
        animation.finished.then(() => done())
      })
    },
    afterLeave (el) {
      el.style.removeProperty('pointer-events')
    },
  }
  return hooks
}

function getDimensions (target: HTMLElement, el: HTMLElement) {
  const targetBox = target.getBoundingClientRect()
  const elBox = nullifyTransforms(el)
  const [originX, originY] = getComputedStyle(el).transformOrigin.split(' ').map(v => parseFloat(v))

  const [anchorSide, anchorOffset] = getComputedStyle(el).getPropertyValue('--v-overlay-anchor-origin').split(' ')

  let offsetX = targetBox.left + targetBox.width / 2
  if (anchorSide === 'left' || anchorOffset === 'left') {
    offsetX -= targetBox.width / 2
  } else if (anchorSide === 'right' || anchorOffset === 'right') {
    offsetX += targetBox.width / 2
  }

  let offsetY = targetBox.top + targetBox.height / 2
  if (anchorSide === 'top' || anchorOffset === 'top') {
    offsetY -= targetBox.height / 2
  } else if (anchorSide === 'bottom' || anchorOffset === 'bottom') {
    offsetY += targetBox.height / 2
  }

  return {
    x: offsetX - (originX + elBox.left),
    y: offsetY - (originY + elBox.top),
  }
}
