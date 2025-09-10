import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useStore } from '../store.ts'

const LocationManager = () => {
  const { pathname } = useLocation()
  const setCurrentParamItemId = useStore((state) => state.setCurrentParamItemId)

  useEffect(() => {
    console.info('[LocationManager] Location changed:', pathname)
    setCurrentParamItemId(pathname)
  }, [pathname])

  return null
}

export default LocationManager
