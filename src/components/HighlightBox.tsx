import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {Highlight} from '../types';

/**
 * Animated highlight. Coordinates are percent of the frame and always measured from the
 * left edge (the screenshot doesn't mirror in RTL), so we use `left`, not inset-inline.
 */
export const HighlightBox: React.FC<{h: Highlight; delayFrames: number; spotlight: boolean}> = ({
  h, delayFrames, spotlight,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - delayFrames;
  const appear = spring({frame: local, fps, config: {damping: 14, stiffness: 120}});
  const pulse = local > fps ? 1 + 0.03 * Math.sin(((local - fps) / fps) * Math.PI * 2) : 1;
  const dim = interpolate(local, [0, 12], [0, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: `${h.x}%`,
        top: `${h.y}%`,
        width: `${h.w}%`,
        height: `${h.h}%`,
        borderRadius: h.shape === 'circle' ? '50%' : 14,
        border: `6px solid ${brand.colors.accent}`,
        boxShadow: spotlight
          ? `0 0 0 9999px rgba(0,0,0,${dim}), 0 0 24px ${brand.colors.accent}`
          : `0 0 24px ${brand.colors.accent}`,
        opacity: Math.min(1, appear * 1.5),
        transform: `scale(${(1.25 - 0.25 * appear) * pulse})`,
        pointerEvents: 'none',
      }}
    />
  );
};
