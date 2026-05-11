import { useState, useEffect, useCallback } from 'react'
import {
  getLocationsService,
  createLocationService,
  deleteLocationService,
  type Location,
  type CreateLocationPayload,
} from '../services/locations.service'
import { useRealtimeLocations } from './useRealtimeLocations'

export interface LatLng {
  lat: number
  lng: number
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLocations = useCallback(async () => {
    try {
      const data = await getLocationsService()
      setLocations(data)
    } catch (err) {
      console.error('Error fetching locations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useRealtimeLocations(fetchLocations)

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const createLocation = async (
    name: string,
    type: string,
    points: LatLng[],
    description?: string
  ): Promise<boolean> => {
    try {
      const coordinates = [
        [...points.map((p) => [p.lng, p.lat]), [points[0].lng, points[0].lat]],
      ]
      const boundary = JSON.stringify({ type: 'Polygon', coordinates })

      const payload: CreateLocationPayload = { name, type, description, boundary }
      const newLocation = await createLocationService(payload)
      setLocations((prev) => [...prev, newLocation])
      return true
    } catch (err) {
      console.error('Error creating location:', err)
      return false
    }
  }

  const deleteLocation = async (id: string): Promise<void> => {
    try {
      await deleteLocationService(id)
      setLocations((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error('Error deleting location:', err)
    }
  }

  return { locations, loading, fetchLocations, createLocation, deleteLocation }
}