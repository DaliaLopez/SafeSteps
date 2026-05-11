// Hook de Supabase Realtime para zonas
// Por ahora solo estructura — sin suscripción activa
// Cuando se implemente websockets, aquí va la lógica de supabase.channel(...)

import { useEffect } from 'react'

export const useRealtimeLocations = (onUpdate: () => void) => {
  useEffect(() => {
    // TODO: suscripción realtime (ej. Supabase) cuando exista config en el cliente
    void onUpdate
  }, [onUpdate])
}