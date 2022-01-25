import type { Ref } from '@uni-store/core'
import type { InjectionKey } from '@uni-component/core'

interface BreadcrumbsContext {
  color: Ref<string | undefined>
  disabled: Ref<boolean>
}

export const VBreadcrumbsSymbol: InjectionKey<BreadcrumbsContext> = Symbol.for('vuetify:breadcrumbs')
