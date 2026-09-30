import {interpolate, spring} from 'remotion';
import {EASE} from '../theme';

type Ease = (n: number) => number;

/** Eased 0 to 1 ramp between two absolute frames. */
export const ramp = (
	frame: number,
	from: number,
	to: number,
	easing: Ease = EASE.out,
): number =>
	interpolate(frame, [from, to], [0, 1], {
		easing,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** Eased value ramp between two absolute frames. */
export const seg = (
	frame: number,
	from: number,
	to: number,
	a: number,
	b: number,
	easing: Ease = EASE.out,
): number =>
	interpolate(frame, [from, to], [a, b], {
		easing,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** Fade in, hold, fade out. */
export const inOut = (
	frame: number,
	inStart: number,
	inEnd: number,
	outStart: number,
	outEnd: number,
): number =>
	interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** Settled spring for entrances. No overshoot wobble, just a firm arrival. */
export const pop = (
	frame: number,
	fps: number,
	delay = 0,
	damping = 26,
): number =>
	spring({
		frame: frame - delay,
		fps,
		config: {damping, mass: 0.7, stiffness: 140},
	});

/** Character count for a typewriter at a given chars-per-second rate. */
export const typed = (
	text: string,
	frame: number,
	start: number,
	cps: number,
	fps: number,
): string => {
	const n = Math.floor(Math.max(0, frame - start) * (cps / fps));
	return text.slice(0, Math.min(text.length, n));
};

export const commas = (n: number): string =>
	Math.round(n).toLocaleString('en-US');
