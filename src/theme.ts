import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {continueRender, delayRender, Easing} from 'remotion';

// Two faces only, latin only. Every extra subset is a network request per render worker.
const serif = loadSerif('normal', {
	weights: ['400'],
	subsets: ['latin'],
	ignoreTooManyRequestsWarning: true,
});
const mono = loadMono('normal', {
	weights: ['400', '500'],
	subsets: ['latin'],
	ignoreTooManyRequestsWarning: true,
});

export const FONT = {
	serif: `${serif.fontFamily}, Georgia, serif`,
	mono: `${mono.fontFamily}, Consolas, monospace`,
};

// Glyphs must be resident before the first frame is captured, otherwise
// early shots render in the fallback stack.
const fontHandle = delayRender('google-fonts');
Promise.all([serif.waitUntilDone(), mono.waitUntilDone()])
	.then(() => continueRender(fontHandle))
	.catch(() => continueRender(fontHandle));

export const C = {
	cream: '#F0EEE6',
	creamDim: '#E4E0D3',
	paperLine: '#CBC5B4',
	bone: '#F7F5F0',
	ink: '#141413',
	inkPanel: '#1C1B18',
	inkRaise: '#232220',
	inkLine: '#302E29',
	clay: '#D97757',
	clayDeep: '#A84F30',
	slate: '#6B6963',
	mute: '#9B988F',
	green: '#83B06B',
	greenDeep: '#4A7C42',
	red: '#C4573E',
};

export const EASE = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	outQuint: Easing.bezier(0.22, 1, 0.36, 1),
	outCubic: Easing.bezier(0.33, 1, 0.68, 1),
	inOut: Easing.bezier(0.76, 0, 0.24, 1),
	inOutSoft: Easing.bezier(0.65, 0, 0.35, 1),
};

export const SAFE = 84;
export const TRACK_WIDE = '0.24em';
