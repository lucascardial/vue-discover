/* eslint-disable no-new */
import Vue from 'vue'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'

const requireComponent = require.context('@/components', true, /\.vue$/)

requireComponent.keys().forEach(file => {
  const componentConfig = requireComponent(file)

  const componentName = upperFirst(
    camelCase(file.replace(/^\.\//, '')).replace(/\.\w+$/, '')
  )

  Vue.component(componentConfig.default.name || componentName, componentConfig.default || componentConfig)
})

export default new Vue()
