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
      <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
        <ImageIcon size={64} />
        <p>No image loaded. Upload an image to start.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden rounded-lg bg-black/10 flex flex-col">
       {/* Toolbar */}
       <div className="absolute top-4 right-4 z-20 flex bg-black/40 backdrop-blur-md rounded-lg p-1">
           {/* Can add zoom controls later */}
       </div>

       <div
         ref={containerRef}
         className="relative w-full h-full cursor-col-resize select-none flex items-center justify-center p-4"
       >
         {/* Container to center and contain the images */}
         <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">

            {/* Background (SVG) */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full">
               {isProcessing ? (
                   <div className="flex flex-col items-center justify-center text-pink-300">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                        <span className="text-sm font-medium animate-pulse">Tracing...</span>
                   </div>
               ) : svgOutput ? (
                 <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                    // Inline styles for nested elements like & > svg are not supported in React style prop.
                    // Instead, we can add a class or rely on global CSS.
                    // For now, removing the invalid style object.
                 />
               ) : null}
            </div>

            {/* Foreground (Original Image) - Clipped */}
            <div
                className="absolute inset-0 overflow-hidden flex items-center justify-center w-full h-full pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <div className="w-full h-full flex items-center justify-center relative">
                    <img
                        src={originalImageUrl}
                        className="max-w-full max-h-full object-contain"
                        alt="Original"
                        style={{ width: 'auto', height: 'auto' }} // Ensure aspect ratio is preserved
                    />
                    {/* We need to ensure the SVG and IMG align perfectly.
                        This is tricky because IMG `object-fit: contain` centers it.
                        We need the SVG to behave exactly the same.
                        ImageTracer returns an SVG with width/height attributes matching the image.
                        If we put them in a flex center container they should overlap perfectly if they have same aspect ratio.
                    */}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-col-resize z-10 hover:bg-white shadow-xl"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg text-pink-500">
                    <Columns size={16} />
                </div>
            </div>
         </div>
       </div>

       {/* Labels */}
       <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
            Original
       </div>
       <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
            Vector
       </div>
    </div>
  );
};
