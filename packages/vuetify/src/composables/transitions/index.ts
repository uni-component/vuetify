import type { Ref } from '@uni-component/core'
import {
  createCssTransition,
  createJavascriptTransition,
} from './createTransition'

import ExpandTransitionGenerator from './expand-transition'
import { dialogTransition } from './dialog-transition'

// Component specific transitions
export const VCarouselTransition = createCssTransition('carousel-transition')
export const VCarouselReverseTransition = createCssTransition('carousel-reverse-transition')
export const VTabTransition = createCssTransition('tab-transition')
export const VTabReverseTransition = createCssTransition('tab-reverse-transition')
export const VMenuTransition = createCssTransition('menu-transition')
// todo mode
export const VFabTransition = createCssTransition('fab-transition', 'center center', 'out-in')

// Generic transitions
export const VDialogBottomTransition = createCssTransition('dialog-bottom-transition')
export const VDialogTopTransition = createCssTransition('dialog-top-transition')
export const VFadeTransition = createCssTransition('fade-transition')
export const VScaleTransition = createCssTransition('scale-transition')
export const VScrollXTransition = createCssTransition('scroll-x-transition')
export const VScrollXReverseTransition = createCssTransition('scroll-x-reverse-transition')
export const VScrollYTransition = createCssTransition('scroll-y-transition')
export const VScrollYReverseTransition = createCssTransition('scroll-y-reverse-transition')
export const VSlideXTransition = createCssTransition('slide-x-transition')
export const VSlideXReverseTransition = createCssTransition('slide-x-reverse-transition')
export const VSlideYTransition = createCssTransition('slide-y-transition')
export const VSlideYReverseTransition = createCssTransition('slide-y-reverse-transition')

// Javascript transitions
export const VExpandTransition = createJavascriptTransition('expand-transition', ExpandTransitionGenerator())
export const VExpandXTransition = createJavascriptTransition('expand-x-transition', ExpandTransitionGenerator('', true))

export const VDialogTransition = (props: {
  model: Ref
  // origin?: string,
  // leaveAbsolute?: boolean,
  // hideOnLeave?: boolean,
  appear?: boolean
}) => {
  return createJavascriptTransition('dialog-transition', dialogTransition())(props)
}
