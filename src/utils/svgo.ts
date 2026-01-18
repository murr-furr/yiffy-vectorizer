// src/utils/svgo.ts
import { optimize } from 'svgo/browser';

export const optimizeSvg = (svgString: string): string => {
  try {
    const result = optimize(svgString, {
      plugins: [
        {
          name: 'preset-default',
          // preset-default usually includes removeViewBox, but in this specific environment
          // or version it seems we should rely on defaults or configure it separately if needed.
          // Since we want to KEEP the viewBox, we ideally want removeViewBox: false.
          // If the warning says "not part of preset-default", it means it's not in the list
          // to be overridden.
        },
        'removeDimensions',
      ],
    });
    return result.data;
  } catch (e) {
    console.error('SVGO optimization failed:', e);
    return svgString;
  }
};
