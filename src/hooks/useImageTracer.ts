import { useState, useCallback } from 'react';
import * as Comlink from 'comlink';
import type { TraceOptions, TraceResult } from '../worker/tracer.worker';

// Worker instance
let workerInstance: Worker | null = null;
// Use Comlink.Remote to type the service
let tracerService: Comlink.Remote<{ trace: (imageData: ImageData, options: TraceOptions) => TraceResult }> | null = null;

const getTracerService = () => {
  if (!workerInstance) {
    workerInstance = new Worker(new URL('../worker/tracer.worker.ts', import.meta.url), {
      type: 'module',
    });
    tracerService = Comlink.wrap(workerInstance);
  }
  return tracerService;
};

export const useImageTracer = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const traceImage = useCallback(async (imageData: ImageData, options: TraceOptions) => {
    setIsProcessing(true);
    setError(null);
    try {
      const service = getTracerService();
      if (service) {
        // Ensure options match the type expected by the worker
        const result = await service.trace(imageData, options);
        setSvgOutput(result.svg);
        setPalette(result.palette || []);
      }
    } catch (err: unknown) {
      console.error("Worker error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to trace image");
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { traceImage, isProcessing, svgOutput, palette, error };
};
