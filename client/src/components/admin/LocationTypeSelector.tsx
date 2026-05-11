import { LocationType } from "../../types/accessibility.types";

interface LocationTypeSelectorProps {
  selectedType: LocationType | null;
  onSelect: (type: LocationType) => void;
}

const locationOptions = [
  {
    value: LocationType.BUILDING,
    label: "Edificio",
    icon: "🏢",
  },
  {
    value: LocationType.RAMP,
    label: "Rampa",
    icon: "♿",
  },
  {
    value: LocationType.STAIRS,
    label: "Escaleras",
    icon: "🪜",
  },
  {
    value: LocationType.BATHROOM,
    label: "Baño",
    icon: "🚻",
  },
  {
    value: LocationType.CAFETERIA,
    label: "Cafetería",
    icon: "🍽️",
  },
  {
    value: LocationType.ELEVATOR,
    label: "Ascensor",
    icon: "🛗",
  },
  {
    value: LocationType.WALKWAY,
    label: "Sendero",
    icon: "🛣️",
  },
];

export default function LocationTypeSelector({
  selectedType,
  onSelect,
}: LocationTypeSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Tipo de zona
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {locationOptions.map((option) => {
          const isSelected = selectedType === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`
                flex flex-col items-center justify-center
                rounded-3xl p-4 transition-all border-2
                shadow-sm active:scale-95
                ${
                  isSelected
                    ? "bg-blue-600 border-blue-700 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                }
              `}
            >
              <span className="text-3xl mb-2">{option.icon}</span>

              <span className="font-medium text-sm text-center">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}