import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {Lang} from '../types';

export const Caption: React.FC<{text: string; lang: Lang; position: 'top' | 'bottom'}> = ({
  text, lang, position,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {damping: 200}});
  const offset = interpolate(enter, [0, 1], [position === 'bottom' ? 40 : -40, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        [position]: 56,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter,
        transform: `translateY(${offset}px)`,
      }}
    >
      <div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        style={{
          maxWidth: 1500,
          padding: '22px 40px',
          borderRadius: 18,
          background: 'rgba(14, 23, 38, 0.88)',
          borderInlineStart: `8px solid ${brand.colors.primary}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          fontSize: lang === 'he' ? 46 : 42,
          fontWeight: 500,
          lineHeight: 1.35,
          textAlign: 'start',
          unicodeBidi: 'plaintext',
        }}
      >
        {text}
      </div>
    </div>
  );
};
