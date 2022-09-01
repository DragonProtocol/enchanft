import React from 'react'
import { useLocation } from 'react-router-dom'

import analytics from '../utils/analytics'

export const useGAPageView = (category = 'wl') => {
  const location = useLocation()

  React.useEffect(() => {
    const currentPath = location.pathname + location.search
    analytics.sendPageview(currentPath)
  }, [location])
}

export const useGAEvent = (category = 'wl') => {
  const eventTracker = (action = 'default action', value: number | undefined = undefined) => {
    analytics.sendEvent({ category, action, value })
  }
  return eventTracker
}
