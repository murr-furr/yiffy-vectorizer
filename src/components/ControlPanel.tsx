import React from 'react';
import type { TraceOptions } from '../worker/tracer.worker';
import { PRESETS } from '../constants/options';
import { PaletteDisplay } from './PaletteDisplay';

interface ControlPanelProps {
  options: TraceOptions;
  onChange: (options: TraceOptions) => void;
  onPresetChange: (preset: string) => void;
  palette: string[];
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
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-medium text-zinc-600">
      <span>{label}</span>
      <span className="font-mono text-zinc-400">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value ?? min}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-zinc-900 bg-zinc-200 h-1.5 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, onChange, onPresetChange, palette }) => {
  const updateOption = (key: keyof TraceOptions, value: number | boolean | string) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">

      {/* View Mode */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tracing Mode</label>
        <div className="flex bg-zinc-200 rounded-lg p-1">
           {['fill', 'outline'].map(mode => (
               <button
                  key={mode}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${options.viewMode === mode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  onClick={() => updateOption('viewMode', mode)}
               >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
               </button>
           ))}
        </div>
      </div>

      <div className="h-px bg-zinc-100 my-4" />

      {/* Presets */}
      <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preset</label>
          <select
            className="input-field w-full p-2.5 text-sm bg-zinc-50 hover:bg-white cursor-pointer"
            onChange={(e) => onPresetChange(e.target.value)}
          >
              <option value="default">Default</option>
              {Object.keys(PRESETS).filter(k => k !== 'default').map(key => (
                  <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
              ))}
          </select>
      </div>

      <div className="h-px bg-zinc-100 my-4" />

      {/* Colors */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Color Palette</label>

        <PaletteDisplay colors={palette} />

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

      <div className="h-px bg-zinc-100 my-4" />

      {/* Detail / Precision */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Detail & Noise</label>
        <Slider
          label="Blur Radius"
          value={options.blurradius}
          min={0}
          max={5}
          step={0.1}
          onChange={(v: number) => updateOption('blurradius', v)}
        />
        <Slider
          label="Detail Threshold (Path Omit)"
          value={options.pathomit}
          min={0}
          max={50}
          step={1}
          onChange={(v: number) => updateOption('pathomit', v)}
        />
      </div>

      <div className="h-px bg-zinc-100 my-4" />

      {/* Curves */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lines & Curves</label>
        <Slider
          label="Straightness (Linear)"
          value={options.ltres}
          min={0}
          max={1}
          step={0.05}
          onChange={(v: number) => updateOption('ltres', v)}
        />
        <Slider
          label="Curviness (Quadratic)"
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
