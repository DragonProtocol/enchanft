import ReactGA from "react-ga"

import { logIsProd } from './index'

const TRACKING_ID = "UA-225058754-1"


// Enable debug mode on the local development environment
const isDev = !logIsProd
ReactGA.initialize(TRACKING_ID, { debug: isDev })

function sendEvent(payload: ReactGA.EventArgs) {
  ReactGA.event(payload)
}

function sendPageview(path: string) {
  ReactGA.set({ page: path })
  ReactGA.pageview(path)
}

export default {
  sendEvent,
  sendPageview,
}
