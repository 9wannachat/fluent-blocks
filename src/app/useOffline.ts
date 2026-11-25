import { useEffect, useState } from 'react'

export function useOffline() {
  const [offlineReady, setOfflineReady] = useState(false)
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (import.meta.env.DEV || !('serviceWorker' in navigator)) return
    const hadController = Boolean(navigator.serviceWorker.controller)
    let registration: ServiceWorkerRegistration | undefined
    let installing: ServiceWorker | null = null
    let disposed = false

    function inspect() {
      if (navigator.serviceWorker.controller) setWaiting(registration?.waiting ?? null)
    }
    function watch() {
      installing?.removeEventListener('statechange', inspect)
      installing = registration?.installing ?? null
      installing?.addEventListener('statechange', inspect)
      inspect()
    }
    function claim() {
      if (!hadController && navigator.serviceWorker.controller) setOfflineReady(true)
    }
    function check() {
      if (document.visibilityState === 'visible' && navigator.onLine) void registration?.update().catch(() => {})
    }

    navigator.serviceWorker.addEventListener('controllerchange', claim)
    document.addEventListener('visibilitychange', check)
    void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((result) => {
        if (disposed) return
        registration = result
        registration.addEventListener('updatefound', watch)
        watch()
        claim()
      })
      .catch(() => { if (!disposed) setError(true) })

    return () => {
      disposed = true
      registration?.removeEventListener('updatefound', watch)
      installing?.removeEventListener('statechange', inspect)
      navigator.serviceWorker.removeEventListener('controllerchange', claim)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  function update() {
    if (!waiting || updating) return
    setUpdating(true)
    const controller = navigator.serviceWorker.controller
    const reload = () => {
      if (navigator.serviceWorker.controller === controller) return
      window.clearTimeout(timeout)
      navigator.serviceWorker.removeEventListener('controllerchange', reload)
      window.location.reload()
    }
    const timeout = window.setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', reload)
      setUpdating(false)
      setError(true)
    }, 8000)
    navigator.serviceWorker.addEventListener('controllerchange', reload)
    waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  return { offlineReady, dismissReady: () => setOfflineReady(false), waiting, updating, update, error }
}
