import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
const requireComponent = require.context('@/Features/', true, /index\.js$/)

export default requireComponent.keys().reduce((map, file) => {
  let component = requireComponent(file)
  if (component.default !== undefined) {
    component.default['namespace'] = upperFirst(camelCase(file)).split('IndexJs').join('')
    map.push(component.default)
  }
  return map
}, [])
