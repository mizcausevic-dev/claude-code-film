import React from 'react';
import {C, EASE} from '../theme';
import {ramp} from '../lib/anim';

const SPOKES = 12;
// Blades overlap at the hub, which fuses into a solid centre the way the real
// mark reads. Uniform reach: alternating lengths turned it into a sparkle.
const HUB = 16;
const TIP = 94;
const BASE_W = 9.2;
const TIP_W = 3.2;

type Props = {
	size: number;
	color?: string;
	/** 0 to 1. Spokes extend from the hub as this climbs. */
	progress?: number;
	rotate?: number;
	/** Frames of delay between adjacent spokes when animating in. */
	frame?: number;
	stagger?: number;
	growFrames?: number;
	opacity?: number;
};

export const Starburst: React.FC<Props> = ({
	size,
	color = C.clay,
	progress,
	rotate = 0,
	frame,
	stagger = 2.2,
	growFrames = 14,
	opacity = 1,
}) => {
	// Spokes are drawn in an interleaved order so the mark blooms rather than sweeps.
	const order = [0, 6, 3, 9, 1, 7, 4, 10, 2, 8, 5, 11];

	return (
		<svg
			width={size}
			height={size}
			viewBox="-100 -100 200 200"
			style={{overflow: 'visible', opacity}}
		>
			<g transform={`rotate(${rotate})`}>
				{Array.from({length: SPOKES}).map((_, i) => {
					const step = order.indexOf(i);
					const p =
						progress !== undefined
							? progress
							: frame === undefined
								? 1
								: ramp(
										frame,
										step * stagger,
										step * stagger + growFrames,
										EASE.outQuint,
									);

					const reach = HUB + (TIP - HUB) * p;

					return (
						<path
							key={i}
							transform={`rotate(${(360 / SPOKES) * i})`}
							d={`M ${-BASE_W} 0 L ${-TIP_W} ${-reach} Q 0 ${-reach - 2.4} ${TIP_W} ${-reach} L ${BASE_W} 0 Z`}
							fill={color}
						/>
					);
				})}
			</g>
		</svg>
	);
};
