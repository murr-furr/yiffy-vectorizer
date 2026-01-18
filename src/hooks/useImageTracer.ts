import { useState } from 'react';
import * as Comlink from 'comlink';
import type { TraceOptions } from '../worker/tracer.worker';

// Worker instance
let workerInstance: Worker | null = null;
// Use Comlink.Remote to type the service
let tracerService: Comlink.Remote<{ trace: (imageData: ImageData, options: TraceOptions) => string }> | null = null;

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
  const [error, setError] = useState<string | null>(null);

  const traceImage = async (imageData: ImageData, options: TraceOptions) => {
    setIsProcessing(true);
    setError(null);
    try {
      const service = getTracerService();
      if (service) {
        const svg = await service.trace(imageData, options);
        setSvgOutput(svg);
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
  };

  return { traceImage, isProcessing, svgOutput, error };
};
