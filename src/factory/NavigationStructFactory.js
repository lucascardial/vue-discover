/* eslint-disable no-new */
export default (features, options) => {

  let appNav = features.reduce((nav, feature) => {
    if (feature.nav) {
      feature.nav['to'] = feature.name
      feature.nav['children'] = (!feature.modules) ? null
        : feature.modules.reduce((_navs, sub) => {
          if (sub.nav) {
            sub.nav['to'] = sub.name
            _navs.push(sub.nav)
          }
          return _navs
        }, [])
      nav.push(feature.nav)
    }
    return nav
  }, [])

  return appNav.reduce((result, nav) => {
    if (nav.group && options.groups) {

      let group = options.groups.find(x => x.name === nav.group)
      if (group !== undefined && group !== null) {
        let _group = result.find(x => x.label === group.label)
        if (_group) {
          _group['children'].push(nav)
          console.log('nav', result)
        } else {
          group['children'] = [nav]
          result.push(group)
        }
      } else {
        console.warn('[Vue Discover] Navigation Factory: the group', nav.group,
          'in nav', nav.label, ', dont exist')
        result.push(nav)
      }
    } else {
      result.push(nav)
    }
    return result
  }, [])
}
