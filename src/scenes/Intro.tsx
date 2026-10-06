import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

export const Intro: React.FC<{title: string; subtitle?: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const logo = spring({frame, fps, config: {damping: 200}});
  const text = spring({frame: frame - 8, fps, config: {damping: 200}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        opacity: out,
        background: `radial-gradient(circle at 50% 40%, ${brand.colors.primary}55, ${brand.colors.dark} 70%)`,
      }}
    >
      <Img src={staticFile(brand.logo)} style={{height: 120, opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`}} />
      <div style={{textAlign: 'center', opacity: text, transform: `translateY(${(1 - text) * 30}px)`}}>
        <div style={{fontSize: 84, fontWeight: 700, unicodeBidi: 'plaintext'}}>{title}</div>
        {subtitle ? <div style={{fontSize: 40, opacity: 0.8, marginTop: 16, unicodeBidi: 'plaintext'}}>{subtitle}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
