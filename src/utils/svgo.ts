// src/utils/svgo.ts
import { optimize } from 'svgo/browser';

export const optimizeSvg = (svgString: string): string => {
  try {
    const result = optimize(svgString, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        } as unknown,
        'removeDimensions',
      ],
    });
    return result.data;
  } catch (e) {
    console.error('SVGO optimization failed:', e);
    return svgString;
  }
};
