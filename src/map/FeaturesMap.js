import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
const requireComponent = require.context('@/Features/', true, /index\.js$/)

export default requireComponent.keys().reduce((map, file) => {
  let component = requireComponent(file)
  if (component.default !== undefined) {
    component.default['namespace'] = upperFirst(camelCase(file)).split('IndexJs').join('')
    map.push(component.default)
  }
  return map
}, [])
