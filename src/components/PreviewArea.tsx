import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Columns, Image as ImageIcon } from 'lucide-react';

interface PreviewAreaProps {
  originalImageUrl: string | null;
  svgOutput: string | null;
  isProcessing: boolean;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ originalImageUrl, svgOutput, isProcessing }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, x)));
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  if (!originalImageUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
        <div className="bg-white p-4 rounded-full border border-zinc-100 shadow-sm">
             <ImageIcon size={48} className="text-zinc-300" />
        </div>
        <p className="font-medium text-zinc-500">No image loaded</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden rounded-lg bg-white border border-zinc-200 flex flex-col shadow-inner">

       <div
         ref={containerRef}
         className="relative w-full h-full cursor-col-resize select-none flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiNmM2YzZjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] bg-repeat"
       >
         {/* Container to center and contain the images */}
         <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center p-4">

            {/* Background (SVG) */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full p-4 svg-preview-container">
               {isProcessing ? (
                   <div className="flex flex-col items-center justify-center z-50 bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg border border-zinc-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mb-3"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Processing</span>
                   </div>
               ) : svgOutput ? (
                 <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                 />
               ) : null}
            </div>

            {/* Foreground (Original Image) - Clipped */}
            <div
                className="absolute inset-0 overflow-hidden flex items-center justify-center w-full h-full pointer-events-none p-4"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                 {/* White background behind original image to match transparency if needed,
                     but usually we want to see transparency checkerboard.
                     If the original image has transparency, it will show the checkerboard from the parent container.
                 */}
                <div className="w-full h-full flex items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiNmM2YzZjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] bg-repeat">
                    <img
                        src={originalImageUrl}
                        className="max-w-full max-h-full object-contain"
                        alt="Original"
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md border border-zinc-100 text-zinc-900">
                    <Columns size={14} />
                </div>
            </div>
         </div>
       </div>

       {/* Labels */}
       <div className="absolute bottom-3 left-3 z-10 bg-white/90 text-zinc-900 border border-zinc-200 shadow-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Original
       </div>
       <div className="absolute bottom-3 right-3 z-10 bg-white/90 text-zinc-900 border border-zinc-200 shadow-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Vector
       </div>
    </div>
  );
};
