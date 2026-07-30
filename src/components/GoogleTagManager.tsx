import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    /** gtag pushes its own arguments object, not a typed event. */
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Reports client-side navigations to the tag loaded in index.html.
 *
 * This used to inject a second copy of gtag.js and call `config` again, so
 * every visit loaded the library twice and counted the landing page twice —
 * while the navigations that actually needed reporting, the ones this router
 * handles without a document load, were never sent at all.
 */
export function GoogleTagManager() {
  const location = useLocation()
  const landing = useRef(true)

  useEffect(() => {
    // The `config` call in index.html already reported the page we arrived on.
    if (landing.current) {
      landing.current = false
      return
    }

    window.gtag?.('event', 'page_view', {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location])

  return null
}
