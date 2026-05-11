import api from './api'

export interface Location {
  id: string
  name: string
  type: string
  description?: string
}

export interface CreateLocationPayload {
  name: string
  type: string
  description?: string
  boundary: string
}

export const getLocationsService = async (): Promise<Location[]> => {
  const { data } = await api.get<Location[]>('/locations')
  return data
}

export const createLocationService = async (
  payload: CreateLocationPayload
): Promise<Location> => {
  const { data } = await api.post<Location>('/locations', payload)
  return data
}

export const deleteLocationService = async (id: string): Promise<void> => {
  await api.delete(`/locations/${id}`)
}
