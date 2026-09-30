import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Backdrop';
import {Starburst} from '../components/Starburst';
import {C, EASE, FONT} from '../theme';
import {pop, ramp, seg} from '../lib/anim';

/**
 * Shot 07. End card. The five chapter names return as one line, so the structure the
 * HUD has been counting off is stated once, plainly, at the end.
 */
export const S7End: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = pop(frame, fps, 0, 26);

	return (
		<Paper>
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						marginBottom: 40,
						transform: `scale(${0.9 + enter * 0.1})`,
						opacity: ramp(frame, 0, 18),
					}}
				>
					<Starburst
						size={104}
						color={C.ink}
						rotate={seg(frame, 0, 140, -8, 10, EASE.out)}
					/>
				</div>

				<div
					style={{
						fontFamily: FONT.serif,
						fontSize: 118,
						lineHeight: 1,
						color: C.ink,
						opacity: ramp(frame, 6, 28, EASE.out),
						transform: `translateY(${(1 - enter) * 16}px)`,
					}}
				>
					Claude Code
				</div>

				<div
					style={{
						marginTop: 36,
						width: 460 * ramp(frame, 24, 54, EASE.outQuint),
						height: 1,
						backgroundColor: C.clay,
					}}
				/>

				<div
					style={{
						marginTop: 30,
						fontFamily: FONT.mono,
						fontSize: 15,
						letterSpacing: '0.34em',
						textTransform: 'uppercase',
						color: C.slate,
						opacity: ramp(frame, 40, 66, EASE.out),
					}}
				>
					Idea · Context · Plan · Edit · Shipped
				</div>

				<div
					style={{
						position: 'absolute',
						bottom: 128,
						fontFamily: FONT.mono,
						fontSize: 13,
						letterSpacing: '0.42em',
						textTransform: 'uppercase',
						color: C.mute,
						opacity: ramp(frame, 66, 94, EASE.out),
					}}
				>
					Anthropic
				</div>
			</AbsoluteFill>
		</Paper>
	);
};
