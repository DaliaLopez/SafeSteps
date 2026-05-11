import type { Dispatch, SetStateAction } from 'react'

const ZONE_TYPES = [
  { value: 'building',  label: 'Edificio'   },
  { value: 'ramp',      label: 'Rampa'      },
  { value: 'stairs',    label: 'Escaleras'  },
  { value: 'bathroom',  label: 'Baño'       },
  { value: 'cafeteria', label: 'Cafetería'  },
  { value: 'elevator',  label: 'Elevador'   },
  { value: 'hallway',   label: 'Pasillo'    },
]

interface ZoneFormFieldsProps {
  zoneType: string
  setZoneType: Dispatch<SetStateAction<string>>
  description: string
  setDescription: Dispatch<SetStateAction<string>>
}

export const ZoneFormFields = ({
  zoneType,
  setZoneType,
  description,
  setDescription,
}: ZoneFormFieldsProps) => {
  return (
    <>
      {/* Tipo */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Tipo</h2>
        <div className="flex flex-col gap-2">
          {ZONE_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer border transition ${
                zoneType === t.value
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="zoneType"
                value={t.value}
                checked={zoneType === t.value}
                onChange={() => setZoneType(t.value)}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Descripción</h2>
        <textarea
          placeholder="Describe el punto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
        />
      </div>
    </>
  )
}