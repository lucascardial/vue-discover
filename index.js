/* eslint-disable */
import features from './src/map/FeaturesMap'
import modules from './src/map/ModulesMap'
import components from './src/map/ComponentsMap'
import state from './src/factory/StoreFactory'
import router from './src/factory/RouterFactory'
import nav from './src/factory/NavigationStructFactory'

export default {
  components,
  install (Vue, options) {
    state()
    router(features, modules, (options && options.routes) || null)
    Vue.prototype.$_nav = nav(features, (options && options.navigation) || [])
  }
}
