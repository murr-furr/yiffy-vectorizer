import { useState, useEffect, useCallback } from 'react';
import { useImageTracer } from './hooks/useImageTracer';
import { defaultOptions, PRESETS } from './constants/options';
import { Upload, Sliders, Image as ImageIcon, Download, Copy, RefreshCw } from 'lucide-react';
import type { TraceOptions } from './worker/tracer.worker';
import { optimizeSvg } from './utils/svgo';

// Components (will be extracted later)
import { FileUpload } from './components/FileUpload';
import { ControlPanel } from './components/ControlPanel';
import { PreviewArea } from './components/PreviewArea';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [options, setOptions] = useState<TraceOptions>(defaultOptions);

  const { traceImage, isProcessing, svgOutput: rawSvgOutput } = useImageTracer();
  const [optimizedSvg, setOptimizedSvg] = useState<string | null>(null);

  useEffect(() => {
    if (rawSvgOutput) {
        // Optimize async to not block UI
        // We use setTimeout to push it to the end of the event loop to avoid blocking render
        // although here it is synchronous unless optimizeSvg is heavy.
        // For truly non-blocking we should put svgo in worker too, but it's fast enough for now.
        const timer = setTimeout(() => {
             const optimized = optimizeSvg(rawSvgOutput);
             setOptimizedSvg(optimized);
        }, 0);
        return () => clearTimeout(timer);
    } else {
        // Defer state update to avoid sync update in effect
        setTimeout(() => setOptimizedSvg(null), 0);
    }
  }, [rawSvgOutput]);

  const finalSvg = optimizedSvg || rawSvgOutput;

  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    // Defer state update
    setTimeout(() => setImageUrl(url), 0);

    // Load image data for tracing
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
      traceImage(imageData, options);
    }
  }, [imageData, options, traceImage]);

  // Auto-trace when image or options change (debounced could be better, but for now direct)
  useEffect(() => {
      // Debounce slightly to avoid too many worker calls
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
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="glass-panel flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-pink-500 p-2 rounded-lg">
                    <ImageIcon className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                    PNG to SVG Converter
                </h1>
            </div>
            <div className="text-sm text-white/60">
                Client-side • Privacy First • Fast
            </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Upload size={18} /> Import Image
                    </h2>
                    <FileUpload onFileSelect={setImageFile} />
                </div>

                <div className="glass-panel space-y-4">
                     <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Sliders size={18} /> Settings
                        </h2>
                        {isProcessing && <RefreshCw className="animate-spin text-pink-400" size={18}/>}
                     </div>

                     <ControlPanel
                        options={options}
                        onChange={setOptions}
                        onPresetChange={handlePresetChange}
                     />
                </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8">
                <div className="glass-panel h-[600px] flex flex-col">
                     <PreviewArea
                        originalImageUrl={imageUrl}
                        svgOutput={finalSvg}
                        isProcessing={isProcessing}
                     />
                </div>

                {/* Export Actions */}
                {finalSvg && (
                    <div className="mt-4 flex gap-4 justify-end">
                         <button
                            className="glass-panel hover:bg-white/10 flex items-center gap-2 px-6 py-3 transition-colors font-medium"
                            onClick={() => navigator.clipboard.writeText(finalSvg)}
                        >
                            <Copy size={18} /> Copy SVG
                         </button>
                         <button
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl px-6 py-3 shadow-lg flex items-center gap-2 font-medium transition-all transform hover:scale-105"
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
                            <Download size={18} /> Download SVG
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
