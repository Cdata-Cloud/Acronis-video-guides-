import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds, getVideoMetadata} from '@remotion/media-utils';
import {guides} from './guides';
import {GuideVideo} from './GuideVideo';
import {GuideProps, LANGS, Lang, Step, StepTiming, pick} from './types';
import {
  DEFAULT_MIN_SEC, FPS, HEIGHT, INTRO_SEC, MIN_PLAYBACK_RATE, OUTRO_SEC,
  VO_DELAY_SEC, VO_PAD_SEC, WIDTH,
} from './timing';

const stepTiming = async (step: Step, lang: Lang): Promise<StepTiming> => {
  const voPath = step.voiceover?.[lang];
  const voSec = voPath
    ? VO_DELAY_SEC + (await getAudioDurationInSeconds(staticFile(voPath))) + VO_PAD_SEC
    : 0;

  let clipSec = 0;
  if (step.media.type === 'video') {
    const {durationInSeconds} = await getVideoMetadata(staticFile(pick(step.media.src, lang)));
    const start = step.media.startSec ?? 0;
    const end = Math.min(step.media.endSec ?? durationInSeconds, durationInSeconds);
    clipSec = Math.max(0, end - start);
  }

  const sec = Math.max(voSec, clipSec, step.minSec ?? DEFAULT_MIN_SEC);
  // If the voiceover outlasts the recording, slow the recording down so it fills the step.
  const playbackRate = clipSec > 0 ? Math.max(MIN_PLAYBACK_RATE, Math.min(1, clipSec / sec)) : 1;
  return {frames: Math.ceil(sec * FPS), playbackRate};
};

const calculateMetadata: CalculateMetadataFunction<GuideProps> = async ({props}) => {
  const timings = await Promise.all(props.spec.steps.map((s) => stepTiming(s, props.lang)));
  const stepsFrames = timings.reduce((a, t) => a + t.frames, 0);
  return {
    durationInFrames: (INTRO_SEC + OUTRO_SEC) * FPS + stepsFrames,
    props: {...props, timings},
  };
};

export const RemotionRoot: React.FC = () => (
  <>
    {guides.flatMap((spec) =>
      LANGS.map((lang) => (
        <Composition
          key={`${spec.id}-${lang}`}
          id={`${spec.id}-${lang}`}
          component={GuideVideo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={FPS * 10}
          defaultProps={{spec, lang} as GuideProps}
          calculateMetadata={calculateMetadata}
        />
      )),
    )}
  </>
);
