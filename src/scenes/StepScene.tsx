import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Caption} from '../components/Caption';
import {HighlightBox} from '../components/HighlightBox';
import {StepBadge} from '../components/StepBadge';
import {VO_DELAY_SEC} from '../timing';
import {Lang, Step, pick} from '../types';

type Props = {
  step: Step;
  index: number;
  total: number;
  lang: Lang;
  durationInFrames: number;
  playbackRate: number;
};

export const StepScene: React.FC<Props> = ({step, index, total, lang, durationInFrames, playbackRate}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = interpolate(frame, [0, 10, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const src = staticFile(pick(step.media.src, lang));
  const highlights = step.highlights ? pick(step.highlights, lang) : [];
  const delayFrames = Math.round((step.highlightDelaySec ?? 0.6) * fps);

  // Slow zoom toward a point (images only). Highlights sit inside the zoomed layer so they stay aligned.
  let transform = 'none';
  let transformOrigin = '50% 50%';
  if (step.media.type === 'image' && step.media.zoom) {
    const {x, y, scale} = step.media.zoom;
    const s = interpolate(frame, [0, durationInFrames], [1, scale], {extrapolateRight: 'clamp'});
    transform = `scale(${s})`;
    transformOrigin = `${x}% ${y}%`;
  }

  const voPath = step.voiceover?.[lang];

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <AbsoluteFill style={{transform, transformOrigin, direction: 'ltr'}}>
        {step.media.type === 'image' ? (
          <Img src={src} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        ) : (
          <OffthreadVideo
            src={src}
            muted
            startFrom={Math.round((step.media.startSec ?? 0) * fps)}
            endAt={step.media.endSec !== undefined ? Math.round(step.media.endSec * fps) : undefined}
            playbackRate={playbackRate}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        )}
        {highlights.map((h, i) => (
          <HighlightBox key={i} h={h} delayFrames={delayFrames} spotlight={i === 0} />
        ))}
      </AbsoluteFill>

      <StepBadge index={index} total={total} lang={lang} />
      <Caption text={step.caption[lang]} lang={lang} position={step.captionPosition ?? 'bottom'} />

      {voPath ? (
        <Sequence from={Math.round(VO_DELAY_SEC * fps)}>
          <Audio src={staticFile(voPath)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
