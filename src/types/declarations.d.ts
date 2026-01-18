declare module 'imagetracerjs' {
    export interface OptionPresets {
        default: Options;
        posterized1: Options;
        posterized2: Options;
        curvy: Options;
        sharp: Options;
        detailed: Options;
        smoothed: Options;
        grayscale: Options;
        fixedpalette: Options;
        randomsampling1: Options;
        randomsampling2: Options;
        artistic1: Options;
        artistic2: Options;
        artistic3: Options;
        artistic4: Options;
        posterized3: Options;
    }

    export interface Options {
        corsenabled?: boolean;
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        rightangleenhance?: boolean;
        colorsampling?: number;
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

    export function imageToSVG(
        url_or_data: string,
        callback: (svgstr: string) => void,
        options?: Options
    ): void;

    export function imagedataToSVG(
        imagedata: ImageData,
        options?: Options
    ): string;

    export function appendSVGString(
        svgstr: string,
        parentid: string
    ): void;
}

declare module 'svgo' {
    export function optimize(svgString: string, config?: unknown): { data: string };
}

declare module 'svgo/dist/svgo.browser.js' {
    export function optimize(svgString: string, config?: unknown): { data: string };
}

declare module 'svgo/browser' {
    export function optimize(svgString: string, config?: unknown): { data: string };
}
