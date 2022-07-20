import React from 'react'
import { useLocation } from 'react-router-dom'

import analytics from '../utils/analytics'

export const useGAPageView = (category = 'NFT Handler') => {
  const location = useLocation()

  React.useEffect(() => {
    const currentPath = location.pathname + location.search
    analytics.sendPageview(currentPath)
  }, [location])
}

export const useGAEvent = (category = 'NFT Handler') => {
  const eventTracker = (action = 'default action') => {
    analytics.sendEvent({ category, action })
  }
  return eventTracker
}
