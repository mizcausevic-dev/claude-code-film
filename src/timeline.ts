export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Shot durations, in frames, before transition overlap is subtracted. */
export const SHOTS = [180, 140, 200, 190, 220, 230, 140] as const;
/** Overlap of each of the six transitions. */
export const TRANS = [20, 16, 18, 16, 20, 10] as const;

/** Absolute first frame of each shot on the finished timeline. */
export const STARTS: number[] = SHOTS.reduce<number[]>((acc, dur, i) => {
	if (i === 0) return [0];
	acc.push(acc[i - 1] + SHOTS[i - 1] - TRANS[i - 1]);
	return acc;
}, []);

/** 1200 frames at 60fps. Exactly twenty seconds. */
export const TOTAL =
	SHOTS.reduce((a, b) => a + b, 0) - TRANS.reduce((a, b) => a + b, 0);

export const CHAPTERS: {from: number; to: number; label: string}[] = [
	{from: 0, to: STARTS[1], label: '01 / Idea'},
	{from: STARTS[2], to: STARTS[3], label: '02 / Context'},
	{from: STARTS[3], to: STARTS[4], label: '03 / Plan'},
	{from: STARTS[4], to: STARTS[5], label: '04 / Edit'},
	{from: STARTS[5], to: STARTS[6], label: '05 / Shipped'},
];
