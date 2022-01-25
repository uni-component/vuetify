import {h} from '@uni-component/core'
import Playground from './Playground'
// @ts-ignore
import PlaygroundNested from './Playground.nested.vue'

export default function () {
  return (
    <div>
      <Playground></Playground>
      {/* <PlaygroundNested></PlaygroundNested> */}
    </div>
  )
}
