import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {Lang} from '../types';

export const Outro: React.FC<{lang: Lang}> = ({lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 36,
        background: `radial-gradient(circle at 50% 60%, ${brand.colors.primary}44, ${brand.colors.dark} 70%)`,
        opacity: s,
      }}
    >
      <div style={{fontSize: 60, fontWeight: 700, textAlign: 'center', maxWidth: 1500, unicodeBidi: 'plaintext'}}>
        {brand.supportLine[lang]}
      </div>
      {brand.supportContact ? <div style={{fontSize: 40, opacity: 0.85}}>{brand.supportContact}</div> : null}
      <Img src={staticFile(brand.logo)} style={{height: 100, marginTop: 20}} />
    </AbsoluteFill>
  );
};
