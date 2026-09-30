import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Backdrop';
import {Caret, Kicker, Mono} from '../components/Type';
import {Starburst} from '../components/Starburst';
import {C, EASE, FONT, SAFE} from '../theme';
import {ramp, seg, typed} from '../lib/anim';

const PROMPT = 'add per-user rate limiting to the checkout API';
const BLOCK_TOP = 410;
const BLOCK_LEFT = SAFE + 44;
const BLOCK_WIDTH = 1240;

/**
 * Shot 01. The idea. Human intent is set in serif on paper; everything the machine
 * does later is monospace on ink. That split carries the whole film.
 */
export const S1Idea: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const shown = typed(PROMPT, frame, 16, 36, fps);
	const typingDone = 16 + (PROMPT.length / 36) * fps;
	const complete = frame >= typingDone;

	const barGrow = ramp(frame, 4, 26, EASE.outQuint);
	const ruleDraw = ramp(frame, typingDone - 2, typingDone + 28, EASE.outQuint);
	// The rule thickens and warms at the end of the shot. The transition opens from it.
	const ruleHeat = ramp(frame, 146, 176, EASE.inOutSoft);

	return (
		<Paper>
			<AbsoluteFill>
				{/* The mark, oversized and cropped. Holds the right half of the frame
				    before there is anything in it. */}
				<div
					style={{
						position: 'absolute',
						top: 60,
						right: -400,
						opacity: 0.055 * ramp(frame, 0, 60, EASE.out),
					}}
				>
					<Starburst
						size={980}
						color={C.ink}
						rotate={seg(frame, 0, 180, -6, 6, EASE.inOutSoft)}
					/>
				</div>

				<div
					style={{
						position: 'absolute',
						top: BLOCK_TOP,
						left: BLOCK_LEFT,
						width: BLOCK_WIDTH,
					}}
				>
					<div
						style={{
							position: 'absolute',
							left: -44,
							top: 2,
							width: 3,
							height: 128 * barGrow,
							backgroundColor: C.clay,
							transformOrigin: 'top center',
						}}
					/>

					<div style={{opacity: ramp(frame, 0, 16, EASE.out)}}>
						<Kicker color={C.clay}>You</Kicker>
					</div>

					<div
						style={{
							marginTop: 22,
							fontFamily: FONT.serif,
							fontSize: 72,
							lineHeight: 1.16,
							color: C.ink,
							minHeight: 86,
						}}
					>
						{shown}
						<Caret frame={frame} height={58} width={4} solid={!complete} />
					</div>
				</div>

				{/* The rule the next shot will open out of. */}
				<div
					style={{
						position: 'absolute',
						top: 582,
						left: BLOCK_LEFT,
						width: BLOCK_WIDTH * ruleDraw,
						height: 1 + ruleHeat * 2,
						backgroundColor: ruleHeat > 0.02 ? C.clay : C.paperLine,
						opacity: 0.35 + ruleHeat * 0.65,
					}}
				/>

				<div
					style={{
						position: 'absolute',
						top: 620,
						left: BLOCK_LEFT,
						width: BLOCK_WIDTH,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						opacity: ramp(frame, 112, 136, EASE.out),
					}}
				>
					<Starburst
						size={19}
						color={C.ink}
						rotate={seg(frame, 112, 180, -20, 34, EASE.out)}
					/>
					<Mono size={17} color={C.slate} style={{letterSpacing: '0.04em'}}>
						handed to claude code
					</Mono>
					<div
						style={{
							marginLeft: 'auto',
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							transform: `translateY(${seg(frame, 112, 140, 10, 0)}px)`,
						}}
					>
						<Mono size={15} color={C.mute}>
							return
						</Mono>
						<div
							style={{
								width: 26,
								height: 26,
								borderRadius: 6,
								border: `1px solid ${C.paperLine}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT.mono,
								fontSize: 14,
								color: C.slate,
							}}
						>
							{'\u21B5'}
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</Paper>
	);
};
