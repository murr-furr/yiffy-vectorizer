import React from 'react';

interface PaletteDisplayProps {
  colors: string[];
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ colors }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Detected Palette ({colors.length})
      </label>
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-50 rounded-lg border border-zinc-200">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="w-6 h-6 rounded-full border border-zinc-200 shadow-sm"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
