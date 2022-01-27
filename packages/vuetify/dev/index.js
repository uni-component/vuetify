import '@uni-component/vue'

import '@mdi/font/css/materialdesignicons.css'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'

import viteSSR from 'vite-ssr/vue'
import { createHead } from '@vueuse/head'
import App from './App'
import vuetify from './vuetify'
import { routes } from './router'

import { getRootInstance } from '@uni-component/core'

// library.add(fas)

export default viteSSR(App, { routes }, ({ app }) => {
  const head = createHead()

  const rootInstance = getRootInstance()

  app.mixin({
    computed: {
      $uniRootInstance () {
        return rootInstance
      },
      $vuetify () {
        return vuetify
      },
    },
  })

  app.use(head)
  // app.use(vuetify)
  // app.component('FontAwesomeIcon', FontAwesomeIcon)

  return { head }
})
