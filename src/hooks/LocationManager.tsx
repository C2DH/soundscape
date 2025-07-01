import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
const LocationManager = () => {
  const { itemId } = useParams()
  const location = useLocation()

  useEffect(() => {
    console.info('[LocationManager] Params changed:', itemId)
  }, [itemId])

  useEffect(() => {
    console.info('[LocationManager] Location changed:', location)
  }, [location])

  return null
}

export default LocationManager
