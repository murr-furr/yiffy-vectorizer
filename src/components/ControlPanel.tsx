import React from 'react';
import type { TraceOptions } from '../worker/tracer.worker';
import { PRESETS } from '../constants/options';

interface ControlPanelProps {
  options: TraceOptions;
  onChange: (options: TraceOptions) => void;
  onPresetChange: (preset: string) => void;
}

interface SliderProps {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-white/70">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value ?? min}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, onChange, onPresetChange }) => {
  const updateOption = (key: keyof TraceOptions, value: number | boolean) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">

      {/* Presets */}
      <div className="space-y-2">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Preset</label>
          <select
            className="glass-input w-full p-2"
            onChange={(e) => onPresetChange(e.target.value)}
          >
              <option value="default" className="text-black">Default</option>
              {Object.keys(PRESETS).filter(k => k !== 'default').map(key => (
                  <option key={key} value={key} className="text-black">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
              ))}
          </select>
      </div>

      {/* Colors */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Colors</label>
        <Slider
          label="Number of Colors"
          value={options.numberofcolors}
          min={2}
          max={64}
          step={1}
          onChange={(v: number) => updateOption('numberofcolors', v)}
        />
        <Slider
          label="Min Color Ratio"
          value={options.mincolorratio}
          min={0}
          max={10}
          step={1}
          onChange={(v: number) => updateOption('mincolorratio', v)}
        />
      </div>

      {/* Detail / Precision */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Detail</label>
        <Slider
          label="Blur Radius (Noise Reduction)"
          value={options.blurradius}
          min={0}
          max={5}
          step={0.1}
          onChange={(v: number) => updateOption('blurradius', v)}
        />
        <Slider
          label="Path Omit (Small Details)"
          value={options.pathomit}
          min={0}
          max={50}
          step={1}
          onChange={(v: number) => updateOption('pathomit', v)}
        />
      </div>

      {/* Curves */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Lines & Curves</label>
        <Slider
          label="Linear Threshold (Straightness)"
          value={options.ltres}
          min={0}
          max={1}
          step={0.05}
          onChange={(v: number) => updateOption('ltres', v)}
        />
        <Slider
          label="Quadratic Threshold (Curviness)"
          value={options.qtres}
          min={0}
          max={1}
          step={0.05}
          onChange={(v: number) => updateOption('qtres', v)}
        />
         <Slider
          label="Round Coordinates"
          value={options.roundcoords}
          min={0}
          max={3}
          step={1}
          onChange={(v: number) => updateOption('roundcoords', v)}
        />
      </div>
    </div>
  );
};
