export type Lang = 'he' | 'en';
export const LANGS: Lang[] = ['he', 'en'];

export type Bi<T = string> = {he: T; en: T};
/** A value that is either shared by both languages or given per language. */
export type MaybeBi<T> = T | Bi<T>;

export type Highlight = {
  x: number; // percent of frame width (from the left edge, in both languages)
  y: number;
  w: number;
  h: number;
  shape?: 'box' | 'circle';
};

export type ImageMedia = {
  type: 'image';
  src: MaybeBi<string>;
  zoom?: {x: number; y: number; scale: number};
};
export type VideoMedia = {
  type: 'video';
  src: MaybeBi<string>;
  startSec?: number;
  endSec?: number;
};

export type Step = {
  media: ImageMedia | VideoMedia;
  caption: Bi;
  narration?: Bi;
  voiceover?: Partial<Bi>;
  highlights?: MaybeBi<Highlight[]>;
  highlightDelaySec?: number;
  captionPosition?: 'top' | 'bottom';
  minSec?: number;
};

export type GuideSpec = {
  id: string;
  title: Bi;
  subtitle?: Bi;
  steps: Step[];
};

export type StepTiming = {frames: number; playbackRate: number};

export type GuideProps = {
  spec: GuideSpec;
  lang: Lang;
  /** Filled in by calculateMetadata in Root.tsx. */
  timings?: StepTiming[];
};

const isBi = <T,>(v: MaybeBi<T>): v is Bi<T> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && 'he' in v && 'en' in v;

export const pick = <T,>(v: MaybeBi<T>, lang: Lang): T => (isBi(v) ? v[lang] : v);
