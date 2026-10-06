import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {brand} from './brand';
import {fontFamily} from './fonts';
import {Intro} from './scenes/Intro';
import {Outro} from './scenes/Outro';
import {StepScene} from './scenes/StepScene';
import {FPS, INTRO_SEC, OUTRO_SEC} from './timing';
import {GuideProps} from './types';

export const GuideVideo: React.FC<GuideProps> = ({spec, lang, timings}) => {
  const t = timings ?? spec.steps.map(() => ({frames: FPS * 4, playbackRate: 1}));
  return (
    <AbsoluteFill
      lang={lang}
      style={{
        backgroundColor: brand.colors.dark,
        color: brand.colors.text,
        fontFamily,
        direction: lang === 'he' ? 'rtl' : 'ltr',
      }}
    >
      {brand.music ? <Audio src={staticFile(brand.music)} volume={brand.musicVolume} loop /> : null}
      <Series>
        <Series.Sequence durationInFrames={INTRO_SEC * FPS}>
          <Intro title={spec.title[lang]} subtitle={spec.subtitle?.[lang]} />
        </Series.Sequence>
        {spec.steps.map((step, i) => (
          <Series.Sequence key={i} durationInFrames={t[i].frames}>
            <StepScene
              step={step}
              index={i}
              total={spec.steps.length}
              lang={lang}
              durationInFrames={t[i].frames}
              playbackRate={t[i].playbackRate}
            />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={OUTRO_SEC * FPS}>
          <Outro lang={lang} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
