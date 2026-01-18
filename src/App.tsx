import { useState, useEffect, useCallback } from 'react';
import { useImageTracer } from './hooks/useImageTracer';
import { defaultOptions, PRESETS } from './constants/options';
import { Upload, Sliders, Image as ImageIcon, Download, Copy, RefreshCw } from 'lucide-react';
import type { TraceOptions } from './worker/tracer.worker';
import { optimizeSvg } from './utils/svgo';

// Components
import { FileUpload } from './components/FileUpload';
import { ControlPanel } from './components/ControlPanel';
import { PreviewArea } from './components/PreviewArea';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [options, setOptions] = useState<TraceOptions>(defaultOptions);

  const { traceImage, isProcessing, svgOutput: rawSvgOutput, palette } = useImageTracer();
  const [optimizedSvg, setOptimizedSvg] = useState<string | null>(null);

  useEffect(() => {
    if (rawSvgOutput) {
        // Optimize async to not block UI
        const timer = setTimeout(() => {
             const optimized = optimizeSvg(rawSvgOutput);
             setOptimizedSvg(optimized);
        }, 0);
        return () => clearTimeout(timer);
    } else {
        setTimeout(() => setOptimizedSvg(null), 0);
    }
  }, [rawSvgOutput]);

  const finalSvg = optimizedSvg || rawSvgOutput;

  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setTimeout(() => setImageUrl(url), 0);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setImageData(ctx.getImageData(0, 0, img.width, img.height));
      }
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleTrace = useCallback(() => {
    if (imageData) {
      setOptimizedSvg(null); // Fix stale flash: Clear old optimized output when starting new trace
      traceImage(imageData, options);
    }
  }, [imageData, options, traceImage]);

  useEffect(() => {
      const timer = setTimeout(() => {
          if (imageData) {
              handleTrace();
          }
      }, 500);
      return () => clearTimeout(timer);
  }, [imageData, options, handleTrace]);

  const handlePresetChange = (presetName: string) => {
      if (presetName in PRESETS) {
          setOptions(PRESETS[presetName as keyof typeof PRESETS]);
      }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 font-sans bg-zinc-50 text-zinc-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded-lg">
                    <ImageIcon className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                        PNG to SVG
                    </h1>
                    <p className="text-xs text-zinc-500 font-medium">Vector Converter</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                <span className="hidden md:inline">Client-side processing</span>
                <span className="hidden md:inline">•</span>
                <span>Privacy First</span>
            </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Sidebar Controls - Reordered for Mobile: Below preview on mobile usually, but here we keep sidebar logic */}
            {/* On mobile, we might want preview first? Standard pattern is input -> settings -> output.
                Let's keep the order but ensure it stacks correctly.
            */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                <div className="panel p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <Upload size={16} /> Import
                    </h2>
                    <FileUpload onFileSelect={setImageFile} />
                </div>

                <div className="panel p-5 space-y-4">
                     <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                            <Sliders size={16} /> Configuration
                        </h2>
                        {isProcessing && <RefreshCw className="animate-spin text-zinc-400" size={16}/>}
                     </div>

                     <ControlPanel
                        options={options}
                        onChange={setOptions}
                        onPresetChange={handlePresetChange}
                        palette={palette}
                     />
                </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                <div className="panel p-1 h-[500px] md:h-[600px] flex flex-col bg-zinc-100/50">
                     <PreviewArea
                        originalImageUrl={imageUrl}
                        svgOutput={finalSvg}
                        isProcessing={isProcessing}
                     />
                </div>

                {/* Export Actions */}
                {finalSvg && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
                         <button
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium transition-colors shadow-sm"
                            onClick={() => navigator.clipboard.writeText(finalSvg)}
                        >
                            <Copy size={16} /> Copy Code
                         </button>
                         <button
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors shadow-sm"
                            onClick={() => {
                                const blob = new Blob([finalSvg], {type: 'image/svg+xml'});
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'vectorized.svg';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                         >
                            <Download size={16} /> Download SVG
                         </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
