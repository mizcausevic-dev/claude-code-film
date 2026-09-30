import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ink} from '../components/Backdrop';
import {StatusGlyph} from '../components/StatusGlyph';
import {Chip, Kicker, Mono} from '../components/Type';
import {C, EASE, FONT, SAFE} from '../theme';
import {pop, ramp, seg} from '../lib/anim';

type Step = {
	label: string;
	tool: string;
	appear: number;
	start: number;
	done?: number;
};

const STEPS: Step[] = [
	{label: 'Read src/api/checkout/route.ts', tool: 'Read', appear: 8, start: 16, done: 52},
	{label: 'Write middleware/rateLimit.ts', tool: 'Write', appear: 20, start: 54, done: 96},
	{label: 'Wire the limiter into POST', tool: 'Edit', appear: 32, start: 98, done: 142},
	{label: 'Run the checkout test suite', tool: 'Bash', appear: 44, start: 144},
];

const ROW_H = 104;

/**
 * Shot 04. The plan. Claude Code states the work before doing it, so the audience
 * gets a contract they can check against. Rows resolve one at a time; the last one
 * is still running when we cut, which is what hands the film into the diff.
 */
export const S4Plan: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<Ink>
			<AbsoluteFill>
				<div style={{position: 'absolute', left: SAFE + 44, top: 268, width: 1080}}>
					<div style={{opacity: ramp(frame, 0, 14)}}>
						<Kicker color={C.clay}>Plan</Kicker>
						<div
							style={{
								marginTop: 18,
								fontFamily: FONT.serif,
								fontSize: 44,
								color: 'rgba(240,238,230,0.58)',
								letterSpacing: '0.005em',
							}}
						>
							add per-user rate limiting to the checkout API
						</div>
					</div>

					<div
						style={{
							marginTop: 34,
							height: 1,
							backgroundColor: C.inkLine,
							transform: `scaleX(${ramp(frame, 10, 34, EASE.outQuint)})`,
							transformOrigin: 'left center',
						}}
					/>

					<div style={{marginTop: 18}}>
						{STEPS.map((step, i) => {
							const enter = pop(frame, fps, step.appear, 24);
							const resolved = step.done !== undefined && frame >= step.done;
							const strike =
								step.done === undefined
									? 0
									: ramp(frame, step.done + 2, step.done + 16, EASE.outQuint);
							const active = frame >= step.start && !resolved;

							return (
								<div
									key={step.label}
									style={{
										display: 'flex',
										alignItems: 'center',
										height: ROW_H,
										gap: 24,
										opacity: enter * (resolved ? 0.52 : 1),
										transform: `translateX(${(1 - enter) * -26}px)`,
									}}
								>
									<Mono
										size={15}
										color={active ? C.clay : resolved ? C.greenDeep : C.slate}
										style={{width: 30, letterSpacing: '0.1em'}}
									>
										{`0${i + 1}`}
									</Mono>
									<StatusGlyph
										frame={frame}
										start={step.start}
										done={step.done}
										size={28}
									/>
									<div style={{position: 'relative'}}>
										<Mono
											size={30}
											color={active ? C.cream : resolved ? C.mute : C.slate}
											style={{letterSpacing: '0.005em'}}
										>
											{step.label}
										</Mono>
										<div
											style={{
												position: 'absolute',
												left: 0,
												right: 0,
												top: '52%',
												height: 1,
												backgroundColor: C.mute,
												transform: `scaleX(${strike})`,
												transformOrigin: 'left center',
											}}
										/>
									</div>
									{active ? (
										<div
											style={{
												marginLeft: 'auto',
												opacity: ramp(frame, step.start, step.start + 10),
											}}
										>
											<Chip color={C.clay}>running</Chip>
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>

				{/* Tool calls, in the order they fire. */}
				<div style={{position: 'absolute', right: SAFE, top: 268, width: 360}}>
					<div style={{opacity: ramp(frame, 20, 40), textAlign: 'right'}}>
						<Kicker color={C.slate}>Tool calls</Kicker>
					</div>
					<div
						style={{
							marginTop: 28,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-end',
							gap: 14,
						}}
					>
						{STEPS.map((step) => {
							const enter = pop(frame, fps, step.start, 26);
							const settled = ramp(frame, step.start + 14, step.start + 30);
							return (
								<div
									key={step.tool}
									style={{
										opacity: enter * (0.45 + 0.55 * (1 - settled * 0.55)),
										transform: `translateX(${(1 - enter) * 30}px)`,
									}}
								>
									<Chip
										color={C.cream}
										bg={C.inkRaise}
										border={C.inkLine}
										size={15}
										style={{
											padding: '9px 16px 8px',
											letterSpacing: '0.14em',
										}}
									>
										{step.tool}
									</Chip>
								</div>
							);
						})}
					</div>

					<div
						style={{
							marginTop: 44,
							textAlign: 'right',
							opacity: ramp(frame, 150, 176),
						}}
					>
						<Mono size={15} color={C.slate} style={{letterSpacing: '0.1em'}}>
							{`${Math.round(seg(frame, 16, 176, 0, 3))} / 4 done`}
						</Mono>
					</div>
				</div>
			</AbsoluteFill>
		</Ink>
	);
};
