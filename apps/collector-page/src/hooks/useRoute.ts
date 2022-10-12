/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:08:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 11:06:59
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { matchRoutes, useLocation } from 'react-router-dom'
import { CutomRouteObject, permissionRoutes, RouteKeys, routes as routeAry } from '../route/routes'

function useRoute() {
  const location = useLocation()
  const [routeKey, setRouteKey] = useState<RouteKeys>(RouteKeys.noMatch)
  useEffect(() => {
    const match = matchRoutes([...permissionRoutes, ...routeAry], location)
    if (!match) {
      setRouteKey(RouteKeys.noMatch)
    } else {
      const { key } = match[0].route as CutomRouteObject
      setRouteKey(key || RouteKeys.noMatch)
    }
  }, [location])
  return { routeKey }
}

export default useRoute
