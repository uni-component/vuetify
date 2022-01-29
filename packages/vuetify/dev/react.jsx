///// <reference types="@uni-component/react/platform" />
import { h, getRootInstance } from '@uni-component/core'
import '@uni-component/react'
import ReactDOM from 'react-dom'

import App from './App'
import vuetify from './vuetify'

const rootInstance = getRootInstance()

window.appInstance = rootInstance

console.log('rootInstance', rootInstance)
console.log('vuetify', vuetify)

ReactDOM.render(<App />, document.getElementById('app'))
