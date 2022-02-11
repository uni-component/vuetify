import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import viteSSR from 'vite-ssr/plugin.js'
import { loadEnv, defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = file => path.resolve(__dirname, file)

const vuetifyPackage = fs.readFileSync('./package.json', 'utf-8')

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    root: resolve('dev'),
    server: {
      port: process.env.PORT,
      strictPort: !!process.env.PORT,
    },
    build: {
      minify: false,
    },
    resolve: {
      dedupe: ['vue', '@vue/reactivity', '@vue/runtime-core', '@vue/shared', 'react', 'react-dom'],
      alias: [
        { find: /^vuetify$/, replacement: resolve('./src/entry-bundler.ts') },
        { find: /^vuetify\/(.*)/, replacement: resolve('./$1') },
        { find: /^@\/(.*)/, replacement: resolve('./src/$1')}
      ]
    },
    plugins: [
      react({
        jsxRuntime: 'classic',
        babel: {
          plugins: [
            [
              '@babel/plugin-transform-react-jsx',
              {
                'throwIfNamespace': false,
                'runtime': 'classic',
                'pragma': 'h',
                'pragmaFrag': 'Fragment'
              }
            ]
          ]
        }
      }),
      vue(),
      // vueJsx({ optimize: true, enableObjectSlots: true }),
      // viteSSR(),
    ],
    define: {
      __VUETIFY_VERSION__: JSON.stringify(vuetifyPackage.version),
      'process.env.BABEL_TYPES_8_BREAKING': 'false',
    }
  }
})
