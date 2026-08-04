export interface ZoneColor {
  id: string;
  label: string;
  hex: string;
  bg: string;
  border: string;
  ring: string;
  textColor: string;
}

export const PREDEFINED_ZONE_COLORS: ZoneColor[] = [
  {
    id: 'red',
    label: 'Red',
    hex: '#EF4444',
    bg: 'bg-red-500',
    border: 'border-red-500',
    ring: 'ring-red-500',
    textColor: 'text-red-500'
  },
  {
    id: 'orange',
    label: 'Orange',
    hex: '#F97316',
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
    textColor: 'text-orange-500'
  },
  {
    id: 'yellow',
    label: 'Yellow',
    hex: '#EAB308',
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    ring: 'ring-yellow-500',
    textColor: 'text-yellow-500'
  },
  {
    id: 'green',
    label: 'Green',
    hex: '#22C55E',
    bg: 'bg-green-500',
    border: 'border-green-500',
    ring: 'ring-green-500',
    textColor: 'text-green-500'
  },
  {
    id: 'blue',
    label: 'Blue',
    hex: '#3B82F6',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    textColor: 'text-blue-500'
  },
  {
    id: 'purple',
    label: 'Purple',
    hex: '#A855F7',
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
    textColor: 'text-purple-500'
  },
  {
    id: 'pink',
    label: 'Pink',
    hex: '#EC4899',
    bg: 'bg-pink-500',
    border: 'border-pink-500',
    ring: 'ring-pink-500',
    textColor: 'text-pink-500'
  },
  {
    id: 'gray',
    label: 'Gray',
    hex: '#6B7280',
    bg: 'bg-gray-500',
    border: 'border-gray-500',
    ring: 'ring-gray-500',
    textColor: 'text-gray-500'
  }
];

export const getZoneColorById = (colorId: string): ZoneColor | undefined => {
  return PREDEFINED_ZONE_COLORS.find(c => c.id === colorId);
};

export const getZoneColorByHex = (hex: string): ZoneColor | undefined => {
  return PREDEFINED_ZONE_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
};

export const isCustomColor = (colorValue: string): boolean => {
  return colorValue.startsWith('#') && !PREDEFINED_ZONE_COLORS.some(c => c.hex.toLowerCase() === colorValue.toLowerCase());
};

export const getColorDisplay = (colorValue: string): { bg: string; border: string; hex: string; label: string } => {
  // Check if it's a predefined color ID
  const predefinedColor = getZoneColorById(colorValue);
  if (predefinedColor) {
    return {
      bg: predefinedColor.bg,
      border: predefinedColor.border,
      hex: predefinedColor.hex,
      label: predefinedColor.label
    };
  }
  
  // Check if it's a predefined color hex
  const predefinedByHex = getZoneColorByHex(colorValue);
  if (predefinedByHex) {
    return {
      bg: predefinedByHex.bg,
      border: predefinedByHex.border,
      hex: predefinedByHex.hex,
      label: predefinedByHex.label
    };
  }
  
  // Custom color
  return {
    bg: '',
    border: '',
    hex: colorValue,
    label: 'Custom'
  };
};
