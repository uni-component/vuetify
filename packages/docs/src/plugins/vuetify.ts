import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// @ts-expect-error
import { components, createVuetify, directives } from 'vuetify'

import type { VuetifyPlugin } from '@/types'

export const useVuetify: VuetifyPlugin = ({ app }) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#1867c0',
            'on-background': '#333333',
            secondary: '#5CBBF6',
            tertiary: '#E57373',
            accent: '#005CAF',
          },
        },
      },
    },
  })
  app.use(vuetify)
}
