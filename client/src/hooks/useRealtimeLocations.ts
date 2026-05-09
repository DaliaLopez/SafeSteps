// Hook de Supabase Realtime para zonas
// Por ahora solo estructura — sin suscripción activa
// Cuando se implemente websockets, aquí va la lógica de supabase.channel(...)

import { useEffect } from 'react'
import { supabase } from '../config/supabase' // ajusta la ruta a tu config

export const useRealtimeLocations = (onUpdate: () => void) => {
  useEffect(() => {
    // TODO: activar suscripción cuando se implemente Realtime
    // const channel = supabase
    //   .channel('locations-changes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, () => {
    //     onUpdate()
    //   })
    //   .subscribe()
    //
    // return () => { supabase.removeChannel(channel) }

    // Sin lógica activa por ahora
    void onUpdate
  }, [])
}