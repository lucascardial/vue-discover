export default (features, groups) => {
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
      if (nav.group) {
        let group = groups.find(x => x.label === nav.group)
        if (group !== undefined && group !== null) {
          group['children'] = nav
          result.push(group)
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
  