import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import state from '@/store/index.js'

const requireStore = require.context('@/Features/', true, /\.feature\.js$/)

export default () => {
  const modules = requireStore.keys().reduce((modules, fileName) => {
    const file = requireStore(fileName)
    if (file !== undefined || file.default !== undefined) {
      let path = fileName.split('store/').join('')
        .split('./').join('')
        .split('.feature.js').join('')
        .split('/')
      let namespace = upperFirst(camelCase(path[0]))
      if (!(`${namespace}` in modules)) {
        modules[namespace] = {
          namespaced: true
        }
        modules[namespace][path[1]] = file.default || file
      } else {
        modules[namespace][path[1]] = file.default || file
      }
      return modules
    }
  }, {})

  Object.entries(modules).forEach((module) => {
    state.registerModule(module[0], module[1])
  })

  return modules
}
