import type { Ref } from '@uni-store/core'
import type { InjectionKey } from '@uni-component/core'
import type { Density } from '@/composables/density'

export interface TimelineInstance {
  density: Ref<Density>
  lineColor: Ref<string>
}

export const VTimelineSymbol: InjectionKey<TimelineInstance> = Symbol.for('vuetify:timeline')
