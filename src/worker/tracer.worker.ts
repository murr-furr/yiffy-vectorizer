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
  viewMode?: 'fill' | 'outline';
}

export interface TraceResult {
  svg: string;
  palette: string[];
}

const tracer = {
  trace(imageData: ImageData, options: TraceOptions): TraceResult {
    try {
      // Cast to any because the type definition might be incomplete
      const IT = ImageTracer as any;

      // 1. Trace to data (intermediate representation)
      const tracedata = IT.imagedataToTracedata(imageData, options);

      // 2. Convert to SVG string
      let svgString = IT.getsvgstring(tracedata, options);

      // 3. Extract Palette
      // tracedata.palette is array of {r, g, b, a}
      const palette = tracedata.palette.map((c: {r: number, g: number, b: number, a: number}) =>
        `rgb(${c.r},${c.g},${c.b})`
      );

      // 4. Handle Outline Mode
      if (options.viewMode === 'outline') {
        // Regex to find fill="rgb(...)" and change to fill="none" stroke="rgb(...)"
        svgString = svgString.replace(
            /fill="rgb\((\d+),(\d+),(\d+)\)"/g,
            'fill="none" stroke="rgb($1,$2,$3)" stroke-width="2"'
        );
        // Also handle rgba if present
        svgString = svgString.replace(
            /fill="rgba\((\d+),(\d+),(\d+),(\d+)\)"/g,
            'fill="none" stroke="rgba($1,$2,$3,$4)" stroke-width="2"'
        );
      }

      return { svg: svgString, palette };
    } catch (error) {
      console.error("Tracing failed:", error);
      throw error;
    }
  }
};

Comlink.expose(tracer);
