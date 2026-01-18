/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import ImageTracer from 'imagetracerjs';

export interface TraceOptions {
  ltres?: number;
  qtres?: number;
  pathomit?: number;
  rightangleenhance?: boolean;
  colorsampling?: number; // 0: disabled, 1: random, 2: deterministic
  numberofcolors?: number;
  mincolorratio?: number;
  colorquantcycles?: number;
  layering?: number;
  strokewidth?: number;
  linefilter?: boolean;
  scale?: number;
  roundcoords?: number;
  viewbox?: boolean;
  desc?: boolean;
  lcpr?: number;
  qcpr?: number;
  blurradius?: number;
  blurdelta?: number;
}

const tracer = {
  trace(imageData: ImageData, options: TraceOptions): string {
    try {
      // imagetracerjs expects an object with these properties
      // Note: imagetracerjs might be mutating the options object or global state,
      // so it's safer to run it in a worker.

      const svgString = ImageTracer.imagedataToSVG(imageData, options);
      return svgString;
    } catch (error) {
      console.error("Tracing failed:", error);
      throw error;
    }
  }
};

Comlink.expose(tracer);
