export const defaultOptions = {
  ltres: 1,
  qtres: 1,
  pathomit: 8,
  rightangleenhance: false,
  colorsampling: 2, // Deterministic
  numberofcolors: 16,
  mincolorratio: 0,
  colorquantcycles: 3,
  layering: 0,
  strokewidth: 1,
  linefilter: false,
  scale: 1,
  roundcoords: 1,
  viewbox: true,
  desc: false,
  lcpr: 0,
  qcpr: 0,
  blurradius: 0,
  blurdelta: 20,
  viewMode: 'fill' as 'fill' | 'outline'
};

export const PRESETS = {
  default: { ...defaultOptions },
  posterized: {
    ...defaultOptions,
    numberofcolors: 4,
    blurradius: 5,
    blurdelta: 20
  },
  curvy: {
    ...defaultOptions,
    ltres: 0.1,
    qtres: 0.1,
    pathomit: 0,
    roundcoords: 2
  },
  sharp: {
    ...defaultOptions,
    ltres: 0,
    qtres: 0,
    pathomit: 0,
    roundcoords: 0
  },
  detailed: {
    ...defaultOptions,
    numberofcolors: 64,
    pathomit: 0,
    ltres: 0.5,
    qtres: 0.5,
  },
  sketch: {
      ...defaultOptions,
      numberofcolors: 2,
      blurradius: 0,
      pathomit: 1,
      ltres: 0.1,
      qtres: 0.1,
      colorsampling: 1 // random sampling can help sketch look
  }
};
