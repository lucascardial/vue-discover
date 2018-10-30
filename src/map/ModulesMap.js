/* eslint-disable no-new */
const requireComponent = require.context('@/Modules/', true, /\.vue$/)

export default requireComponent.keys().reduce((map, file) => {
  let config = requireComponent(file)
  if (config.default !== undefined) {
    map.push({
      signature: config.default.signature,
      module: config.default
    })
  }
  return map
}, [])
