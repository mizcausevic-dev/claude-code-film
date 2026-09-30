import React from 'react';
import {C, EASE} from '../theme';
import {ramp, seg} from '../lib/anim';

type Props = {
	frame: number;
	/** Frame the row starts spinning. */
	start: number;
	/** Frame the row resolves. Omit to stay in progress. */
	done?: number;
	size?: number;
};

/**
 * One glyph, three states: hollow ring while queued, sweeping arc while the tool
 * runs, drawn check once it lands. Keeping it as a single element means the state
 * change reads as a morph rather than a swap.
 */
export const StatusGlyph: React.FC<Props> = ({frame, start, done, size = 26}) => {
	const r = 11;
	const circ = 2 * Math.PI * r;
	const resolved = done !== undefined && frame >= done;
	const settle = done === undefined ? 0 : ramp(frame, done, done + 12, EASE.outQuint);
	const check = done === undefined ? 0 : ramp(frame, done + 2, done + 16, EASE.outCubic);
	const spinning = frame >= start && !resolved;

	const ringColor = resolved
		? C.green
		: spinning
			? C.clay
			: C.inkLine;

	return (
		<svg
			width={size}
			height={size}
			viewBox="-14 -14 28 28"
			style={{flex: '0 0 auto', overflow: 'visible'}}
		>
			<circle
				r={r}
				fill="none"
				stroke={resolved ? C.greenDeep : C.inkLine}
				strokeWidth={2}
				opacity={0.9}
			/>
			{spinning ? (
				<circle
					r={r}
					fill="none"
					stroke={ringColor}
					strokeWidth={2}
					strokeLinecap="round"
					strokeDasharray={`${circ * 0.28} ${circ}`}
					transform={`rotate(${(frame - start) * 7.5})`}
				/>
			) : null}
			{resolved ? (
				<>
					<circle r={r} fill={C.green} opacity={settle * 0.16} />
					<path
						d="M -5.2 0.4 L -1.4 4.2 L 5.6 -3.4"
						fill="none"
						stroke={C.green}
						strokeWidth={2.4}
						strokeLinecap="round"
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - check}
					/>
				</>
			) : null}
			{!spinning && !resolved ? (
				<circle r={2.4} fill={C.inkLine} opacity={seg(frame, 0, 8, 0, 1)} />
			) : null}
		</svg>
	);
};
