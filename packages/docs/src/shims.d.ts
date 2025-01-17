declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-header-sections' {
  import type MarkdownIt from 'markdown-it'

  const MarkdownItHeaderSections: MarkdownIt.PluginSimple
  export default MarkdownItHeaderSections
}

declare module 'markdown-it-attrs' {
  import type MarkdownIt from 'markdown-it'

  const MarkdownItAttrs: MarkdownIt.PluginWithOptions<{
    leftDelimiter?: string
    rightDelimiter?: string
    allowedAttributes?: string[]
  }>
  export default MarkdownItAttrs
}

declare module 'markdown-it-link-attributes' {
  import type MarkdownIt from 'markdown-it'

  interface Config {
    pattern?: string
    attrs: Record<string, string>
  }

  const MarkdownItLinkAttributes: MarkdownIt.PluginWithOptions<Config | Config[]>
  export default MarkdownItLinkAttributes
}

declare module 'cosmicjs' {
  interface Cosmic {
    bucket (params: {
      slug: string
      read_key: string
      write_key?: string
    }): Bucket
  }
  interface Bucket {
    getObject<T>(params: Record<string, any>): Promise<{ object: T }>
    getObjects<T>(params: Record<string, any>): Promise<{ objects: T[] }>
  }
  export default function Cosmic (): Cosmic
}

declare module 'virtual:pwa-register' {
  export function registerSW (params: { immediate?: boolean }): void
}

declare module 'virtual:examples' {
  import type { Component } from 'vue'

  export function getExample (name: string): Promise<{
    component: Component
    source: string
  }>
}
