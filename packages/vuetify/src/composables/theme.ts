// Utilities
import { computed, inject, provide, ref, watch } from '@uni-component/core'
import {
  colorToInt,
  colorToRGB,
  createRange,
  darken,
  getCurrentInstance,
  getLuma,
  // IN_BROWSER,
  intToHex,
  lighten,
  mergeDeep,
  propsFactory,
} from '@/util'
import { APCAcontrast } from '@/util/color/APCA'

// Types
import type { getRootInstance, InjectionKey, Ref } from '@uni-component/core'
// import type { HeadClient } from '@vueuse/head'

type App = ReturnType<typeof getRootInstance>

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

interface BaseColors {
  background: string
  surface: string
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
}

interface OnColors {
  'on-background': string
  'on-surface': string
  'on-primary': string
  'on-secondary': string
  'on-success': string
  'on-warning': string
  'on-error': string
  'on-info': string
}

export interface Colors extends BaseColors, OnColors {
  [key: string]: string
}

interface InternalThemeDefinition {
  dark: boolean
  colors: Colors
  variables: Record<string, string | number>
}

interface VariationsOptions {
  colors: string[]
  lighten: number
  darken: number
}

interface InternalThemeOptions {
  isDisabled: boolean
  defaultTheme: string
  variations: VariationsOptions
  themes: Record<string, InternalThemeDefinition>
}

export type ThemeDefinition = DeepPartial<InternalThemeDefinition>

export type ThemeOptions = false | {
  defaultTheme?: string
  variations?: false | VariationsOptions
  themes?: Record<string, ThemeDefinition>
}

export interface ThemeInstance {
  isDisabled: boolean
  themes: Ref<Record<string, InternalThemeDefinition>>
  current: Ref<string>
  themeClasses: Ref<string | undefined>
  setTheme: (key: string, theme: InternalThemeDefinition) => void
  getTheme: (key: string) => InternalThemeDefinition
  styles: Ref<string>
}

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol.for('vuetify:theme')

export const makeThemeProps = propsFactory({
  theme: String,
}, 'theme')

const defaultThemeOptions: ThemeOptions = {
  defaultTheme: 'light',
  variations: { colors: [], lighten: 0, darken: 0 },
  themes: {
    light: {
      dark: false,
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-variant': '#424242',
        'on-surface-variant': '#EEEEEE',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
      variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'kbd-background-color': '#212529',
        'kbd-color': '#FFFFFF',
        'code-background-color': '#C2C2C2',
      },
    },
    dark: {
      dark: true,
      colors: {
        background: '#121212',
        surface: '#212121',
        'surface-variant': '#BDBDBD',
        'on-surface-variant': '#424242',
        primary: '#BB86FC',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC5',
        'secondary-darken-1': '#03DAC5',
        error: '#CF6679',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
      variables: {
        'border-color': '#FFFFFF',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.10,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.16,
        'dragged-opacity': 0.08,
        'kbd-background-color': '#212529',
        'kbd-color': '#FFFFFF',
        'code-background-color': '#B7B7B7',
      },
    },
  },
}

const parseThemeOptions = (options: ThemeOptions = defaultThemeOptions): InternalThemeOptions => {
  if (!options) return { ...defaultThemeOptions, isDisabled: true } as InternalThemeOptions

  const themes = Object.entries(options.themes ?? {}).reduce((obj, [key, theme]) => {
    const defaultTheme = theme.dark ? defaultThemeOptions.themes?.dark : defaultThemeOptions.themes?.light
    obj[key] = mergeDeep(defaultTheme, theme)
    return obj
  }, {} as Record<string, ThemeDefinition>)

  return mergeDeep(
    defaultThemeOptions,
    { ...options, themes },
  ) as InternalThemeOptions
}

// Composables
// app: App,
export function createTheme (app: App, options?: ThemeOptions): ThemeInstance {
  // todo use @uni-component rootInstance
  // const head = app._context.provides.usehead as HeadClient | undefined
  const head = undefined
  const parsedOptions = parseThemeOptions(options)
  const styleEl = ref<HTMLStyleElement>()
  const current = ref(parsedOptions.defaultTheme)
  const themes = ref(parsedOptions.themes)
  const variations = ref(parsedOptions.variations)

  const computedThemes = computed(() => {
    return Object.entries(themes.value).reduce((obj, [name, original]) => {
      const theme: InternalThemeDefinition = {
        ...original,
        colors: {
          ...original.colors,
          ...(parsedOptions.variations.colors ?? []).reduce((obj, color) => {
            return { ...obj, ...genColorVariations(color, original.colors[color]!) }
          }, {}),
        },
      }

      for (const color of Object.keys(theme.colors)) {
        if (/on-[a-z]/.test(color) || theme.colors[`on-${color}`]) continue

        const onColor = `on-${color}` as keyof OnColors
        const colorVal = colorToInt(theme.colors[color]!)

        const blackContrast = Math.abs(APCAcontrast(0, colorVal))
        const whiteContrast = Math.abs(APCAcontrast(0xffffff, colorVal))

        // TODO: warn about poor color selections
        // const contrastAsText = Math.abs(APCAcontrast(colorVal, colorToInt(theme.colors.background)))
        // const minContrast = Math.max(blackContrast, whiteContrast)
        // if (minContrast < 60) {
        //   consoleInfo(`${key} theme color ${color} has poor contrast (${minContrast.toFixed()}%)`)
        // } else if (contrastAsText < 60 && !['background', 'surface'].includes(color)) {
        //   consoleInfo(`${key} theme color ${color} has poor contrast as text (${contrastAsText.toFixed()}%)`)
        // }

        // Prefer white text if both have an acceptable contrast ratio
        theme.colors[onColor] = whiteContrast > Math.min(blackContrast, 50) ? '#fff' : '#000'
      }

      obj[name] = theme

      return obj
    }, {} as Record<string, InternalThemeDefinition>)
  })

  function genColorVariations (name: string, color: string) {
    const obj: Record<string, string> = {}
    for (const variation of (['lighten', 'darken'] as const)) {
      const fn = variation === 'lighten' ? lighten : darken
      for (const amount of createRange(variations.value[variation], 1)) {
        obj[`${name}-${variation}-${amount}`] = intToHex(fn(colorToInt(color), amount))
      }
    }

    return obj
  }

  const styles = computed(() => {
    const lines = []

    for (const themeName of Object.keys(computedThemes.value)) {
      const variables = computedThemes.value[themeName].variables

      lines.push(...createCssClass(`.v-theme--${themeName}`, [
        ...genCssVariables(themeName),
        ...Object.keys(variables).map(key => {
          const value = variables[key]
          const color = typeof value === 'string' && value.startsWith('#') ? colorToRGB(value) : undefined
          const rgb = color ? `${color.r}, ${color.g}, ${color.b}` : undefined

          return `--v-${key}: ${rgb ?? value}`
        }),
      ]))
    }

    const colors = new Set(Object.values(computedThemes.value).flatMap(theme => Object.keys(theme.colors)))
    for (const key of colors) {
      if (/on-[a-z]/.test(key)) {
        lines.push(...createCssClass(`.${key}`, [`color: rgb(var(--v-theme-${key})) !important`]))
      } else {
        lines.push(
          ...createCssClass(`.bg-${key}`, [
            `--v-theme-overlay-multiplier: var(--v-theme-${key}-overlay-multiplier)`,
            `background: rgb(var(--v-theme-${key})) !important`,
            `color: rgb(var(--v-theme-on-${key})) !important`,
          ]),
          ...createCssClass(`.text-${key}`, [`color: rgb(var(--v-theme-${key})) !important`]),
          ...createCssClass(`.border-${key}`, [`--v-border-color: var(--v-theme-${key})`]),
        )
      }
    }

    return lines.map((str, i) => i === 0 ? str : `    ${str}`).join('')
  })

  function genCssVariables (name: string) {
    const theme = computedThemes.value[name]

    if (!theme) throw new Error(`Could not find theme ${name}`)

    const lightOverlay = theme.dark ? 2 : 1
    const darkOverlay = theme.dark ? 1 : 2

    const variables: string[] = []
    for (const [key, value] of Object.entries(theme.colors)) {
      const rgb = colorToRGB(value!)
      variables.push(`--v-theme-${key}: ${rgb.r},${rgb.g},${rgb.b}`)
      if (!key.startsWith('on-')) {
        variables.push(`--v-theme-${key}-overlay-multiplier: ${getLuma(value) > 0.18 ? lightOverlay : darkOverlay}`)
      }
    }

    return variables
  }

  function createCssClass (selector: string, content: string[]) {
    return [
      `${selector} {\n`,
      ...content.map(line => `  ${line};\n`),
      '}\n',
    ]
  }

  if (head) {
    // head.addHeadObjs(computed(() => ({
    //   style: [{
    //     children: styles.value,
    //     type: 'text/css',
    //     id: 'vuetify-theme-stylesheet',
    //   }],
    // })))

    // if (IN_BROWSER) {
    //   watchEffect(() => head.updateDOM())
    // }
  } else {
    watch(themes, updateStyles, { deep: true, immediate: true })

    function updateStyles () {
      if (parsedOptions.isDisabled) return

      genStyleElement()

      if (styleEl.value) styleEl.value.innerHTML = styles.value
    }

    function genStyleElement () {
      if (typeof document === 'undefined' || styleEl.value) return

      const el = document.createElement('style')
      el.type = 'text/css'
      el.id = 'vuetify-theme-stylesheet'

      styleEl.value = el
      document.head.appendChild(styleEl.value)
    }
  }

  return {
    isDisabled: parsedOptions.isDisabled,
    themes: computedThemes,
    setTheme: (key: string, theme: InternalThemeDefinition) => themes.value[key] = theme,
    getTheme: (key: string) => computedThemes.value[key],
    current,
    themeClasses: computed(() => parsedOptions.isDisabled ? undefined : `v-theme--${current.value}`),
    styles,
  }
}

export function provideTheme (props: { theme?: string }) {
  getCurrentInstance('provideTheme')

  const theme = inject(ThemeSymbol, null)

  if (!theme) throw new Error('Could not find Vuetify theme injection')

  const current = computed<string>(() => {
    return props.theme ?? theme?.current.value
  })

  const themeClasses = computed(() => theme.isDisabled ? undefined : `v-theme--${current.value}`)

  const newTheme: ThemeInstance = {
    ...theme,
    current,
    themeClasses,
  }

  provide(ThemeSymbol, newTheme)

  return newTheme
}

export function useTheme () {
  getCurrentInstance('useTheme')

  const theme = inject(ThemeSymbol, null)

  if (!theme) throw new Error('Could not find Vuetify theme injection')

  return theme
}
