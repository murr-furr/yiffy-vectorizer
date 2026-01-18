# PNG to SVG Converter

A client-side PNG to SVG converter built with React, Vite, and ImageTracerJS.

## Features
- **Client-side only**: All processing happens in the browser using Web Workers.
- **ImageTracerJS**: High-quality image tracing.
- **SVGO Optimization**: Optimizes the generated SVG for smaller file size.
- **Preview & Compare**: Side-by-side comparison of original image and vector output.
- **Presets**: Quick settings for different styles (Sketch, Logo, etc.).

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Tech Stack
- React
- Vite
- Tailwind CSS (v4)
- Comlink (Web Workers)
- ImageTracerJS
- SVGO
