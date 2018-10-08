import features from './src/map/FeaturesMap'
import modules from './src/map/ModulesMap'
import components from './src/map/ComponentsMap'
import state from './src/factory/StoreFactory'
import router from './src/factory/RouterFactory'
import nav from './src/factory/NavigationStructFactory'

export default {
  components,
  install (Vue, options) {
    const navGroups = (options && options.navGroups) ? options.navGroups : []
    state()
    router(features, modules)
    Vue.prototype.$_nav = nav(features, navGroups)
  }
}
