declare module 'jsvectormap' {
  interface JsVectorMapOptions {
    selector?: HTMLElement | string;
    map?: string;
    backgroundColor?: string;
    zoomButtons?: boolean;
    regionStyle?: Record<string, unknown>;
    markers?: unknown[];
    selectedRegions?: string[];
    regionStyleSelected?: Record<string, unknown>;
    [key: string]: unknown;
  }

  class JsVectorMap {
    constructor(options: JsVectorMapOptions);
    destroy(): void;
  }

  export default JsVectorMap;
}

declare module 'jsvectormap/dist/jsvectormap.css';
declare module 'jsvectormap/dist/maps/world-merc.js';
