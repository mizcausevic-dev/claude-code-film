import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ink} from '../components/Backdrop';
import {Starburst} from '../components/Starburst';
import {C, EASE, FONT} from '../theme';
import {pop, ramp, seg, typed} from '../lib/anim';

const SUB = 'agentic coding, in your terminal';

/**
 * Shot 02. The title card. The mark blooms spoke by spoke, the wordmark tracks in
 * from wide letterspacing, and the subtitle types. Two and a third seconds, no more.
 */
export const S2Title: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const markScale = 0.86 + pop(frame, fps, 0, 22) * 0.14;
	const wordIn = ramp(frame, 22, 56, EASE.outQuint);
	const track = seg(frame, 22, 74, 0.2, 0.005, EASE.outQuint);

	return (
		<Ink>
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						transform: `scale(${markScale})`,
						marginBottom: 46,
						filter: 'drop-shadow(0 0 44px rgba(217,119,87,0.32))',
					}}
				>
					<Starburst
						size={166}
						color={C.clay}
						frame={frame}
						stagger={2.0}
						growFrames={16}
						rotate={seg(frame, 0, 140, -16, 8, EASE.out)}
					/>
				</div>

				<div
					style={{
						fontFamily: FONT.serif,
						fontSize: 108,
						lineHeight: 1,
						color: C.cream,
						letterSpacing: `${track}em`,
						opacity: wordIn,
						transform: `translateY(${(1 - wordIn) * 20}px)`,
						// Wide tracking pads the right edge, so nudge the block back to centre.
						marginRight: `-${track}em`,
					}}
				>
					Claude Code
				</div>

				<div
					style={{
						marginTop: 34,
						width: 300 * ramp(frame, 62, 88, EASE.outQuint),
						height: 1,
						backgroundColor: 'rgba(240,238,230,0.28)',
					}}
				/>

				<div
					style={{
						marginTop: 26,
						fontFamily: FONT.mono,
						fontSize: 19,
						letterSpacing: '0.18em',
						color: C.clay,
						textTransform: 'uppercase',
						minHeight: 24,
					}}
				>
					{typed(SUB, frame, 74, 42, fps)}
				</div>
			</AbsoluteFill>
		</Ink>
	);
};
