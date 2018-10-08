import features from './src/map/FeaturesMap'
import modules from './src/map/ModulesMap'
import components from './src/map/ComponentsMap'
import state from './src/factory/StoreFactory'
import router from './src/factory/RouterFactory'
export default {
  components,
  install (Vue, options) {
    const routerNode = (options && options.routerNode) ? options.routerNode : false
    state()
    router(features, modules, routerNode)
    Vue.prototype.$f = 'kkkkk mds men'
  }
}
