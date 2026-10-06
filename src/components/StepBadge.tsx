import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {Lang} from '../types';

export const StepBadge: React.FC<{index: number; total: number; lang: Lang}> = ({index, total, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const label = lang === 'he' ? `שלב ${index + 1} מתוך ${total}` : `Step ${index + 1} of ${total}`;
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        insetInlineStart: 48,
        padding: '10px 26px',
        borderRadius: 999,
        background: brand.colors.primary,
        fontSize: 32,
        fontWeight: 700,
        opacity: s,
        transform: `scale(${0.8 + 0.2 * s})`,
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      }}
    >
      {label}
    </div>
  );
};
