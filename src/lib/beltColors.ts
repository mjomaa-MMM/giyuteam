export const BELT_COLORS = ['white', 'orange', 'blue', 'yellow', 'green', 'brown', 'black'] as const;

export type BeltColor = typeof BELT_COLORS[number];

export const getBeltColorClasses = (color: string | null | undefined): { border: string; bg: string; text: string } => {
  const normalizedColor = (color || 'white').toLowerCase();
  
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    white: { border: 'border-gray-300', bg: 'bg-gray-100', text: 'text-gray-800' },
    orange: { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-white' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-white' },
    yellow: { border: 'border-yellow-400', bg: 'bg-yellow-400', text: 'text-gray-900' },
    green: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-white' },
    brown: { border: 'border-amber-700', bg: 'bg-amber-700', text: 'text-white' },
    black: { border: 'border-gray-900', bg: 'bg-gray-900', text: 'text-white' },
  };

  return colorMap[normalizedColor] || colorMap.white;
};
