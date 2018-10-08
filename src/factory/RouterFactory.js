import Vue from 'vue'
import router from '@/router'
const defaultComponent = () => {
  return Vue.component('vue-discover-default-component', {
    template: `
      <div>
        <h1>{{message}}</h1>
        <router-view></router-view>
      </div>
    `,
    props: {
      message: {default: null}
    }
  })
}
const mount = (feature, modules) => {
  if (feature.router === undefined) {
    console.error(
      '[Vue discover] RouterFactory: missing property "route" in',
      `"Features/${feature.namespace}/index.js"`)
    return false
  }
  let router = feature.router
  router['name'] = feature.name
  if (typeof router.component === 'string') {
    router.component = (router.component !== '$name') ? router.component : feature.name
    const component = modules.find(x => x.signature === router.component)
    if (component !== undefined) {
      router.component = require(`@/${component.path}`).default
    } else {
      console.error(
        '[Vue discover] RouterFactory: Signature of module',
        `"${router.component}"`, 'required in component router of',
        `"Features/${feature.namespace}/index.js"`,
        'was not found.')
      return false
    }
  }

  if (!router.component) {
    router.component = defaultComponent()
    router.redirect = '/'
  }
  return router
}
export default (features, modules) => {
  let _routes = features.reduce((routes, feature) => {
    const route = mount(feature, modules)
    if (feature.modules !== undefined) {
      route['children'] = feature.modules.reduce((children, nested) => {
        children.push(mount(nested, modules))
        return children
      }, [])
    }
    routes.push(route)
    return routes
  }, [])
  router.addRoutes(_routes)
}
