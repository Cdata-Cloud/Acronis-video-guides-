import {loadFont} from '@remotion/google-fonts/Heebo';

// Heebo covers Hebrew and Latin, so one font serves both language versions.
export const {fontFamily} = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['hebrew', 'latin'],
});
