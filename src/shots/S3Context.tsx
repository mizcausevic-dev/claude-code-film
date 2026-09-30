import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ink} from '../components/Backdrop';
import {Panel} from '../components/Panel';
import {CodeLine, Gutter, type Line} from '../components/Code';
import {Kicker, Mono} from '../components/Type';
import {C, EASE, FONT, SAFE} from '../theme';
import {commas, pop, ramp, seg} from '../lib/anim';

const TREE: {label: string; depth: number; dir: boolean}[] = [
	{label: 'src', depth: 0, dir: true},
	{label: 'api', depth: 1, dir: true},
	{label: 'checkout/route.ts', depth: 2, dir: false},
	{label: 'orders/create.ts', depth: 2, dir: false},
	{label: 'middleware', depth: 1, dir: true},
	{label: 'auth.ts', depth: 2, dir: false},
	{label: 'lib/db.ts', depth: 1, dir: false},
	{label: 'tests', depth: 0, dir: true},
	{label: 'checkout.test.ts', depth: 1, dir: false},
];

const BLANK: Line = [[' ', 'base']];

const CODE: Line[] = [
	[
		['export ', 'kw'],
		['async ', 'kw'],
		['function ', 'kw'],
		['POST', 'fn'],
		['(', 'pun'],
		['req', 'base'],
		[': ', 'pun'],
		['Request', 'type'],
		[') {', 'pun'],
	],
	[
		['  const ', 'kw'],
		['body', 'base'],
		[' = ', 'pun'],
		['await ', 'kw'],
		['req', 'base'],
		['.', 'pun'],
		['json', 'fn'],
		['();', 'pun'],
	],
	[
		['  const ', 'kw'],
		['user', 'base'],
		[' = ', 'pun'],
		['await ', 'kw'],
		['auth', 'fn'],
		['(req);', 'pun'],
	],
	BLANK,
	[['  // TODO: throttle abusive clients', 'com']],
	BLANK,
	[
		['  const ', 'kw'],
		['order', 'base'],
		[' = ', 'pun'],
		['await ', 'kw'],
		['createOrder', 'fn'],
		['(user', 'base'],
		['.', 'pun'],
		['id', 'base'],
		[', body', 'base'],
		['.', 'pun'],
		['items', 'base'],
		[');', 'pun'],
	],
	[
		['  await ', 'kw'],
		['charge', 'fn'],
		['(order);', 'pun'],
	],
	[
		['  return ', 'kw'],
		['Response', 'type'],
		['.', 'pun'],
		['json', 'fn'],
		['({ ', 'pun'],
		['ok', 'base'],
		[': ', 'pun'],
		['true', 'num'],
		[', ', 'pun'],
		['id', 'base'],
		[': order', 'base'],
		['.', 'pun'],
		['id ', 'base'],
		['});', 'pun'],
	],
	[['}', 'pun']],
];

const ROW_H = 39;
const PAD = 34;
const FLAG = 4;
const SCAN_FROM = 44;
const SCAN_TO = 150;

/**
 * Shot 03. Context. Claude Code reads before it writes, so this shot is a scan:
 * a lit band travels the file, lines brighten as they are read, and the one line
 * that matters gets called out. No edits yet.
 */
export const S3Context: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scanY = seg(
		frame,
		SCAN_FROM,
		SCAN_TO,
		-12,
		CODE.length * ROW_H + 10,
		EASE.inOutSoft,
	);
	const scanLive = ramp(frame, SCAN_FROM, SCAN_FROM + 8) * (1 - ramp(frame, SCAN_TO - 6, SCAN_TO + 8));
	const flagIn = ramp(frame, 112, 136, EASE.outQuint);
	const boxIn = ramp(frame, 162, 188, EASE.outQuint);

	return (
		<Ink>
			<AbsoluteFill>
				{/* Workspace */}
				<div style={{position: 'absolute', left: SAFE, top: 284, width: 486}}>
					<div style={{opacity: ramp(frame, 0, 14)}}>
						<Kicker color={C.clay}>Workspace</Kicker>
					</div>
					<div style={{marginTop: 26}}>
						{TREE.map((node, i) => {
							const appear = pop(frame, fps, 6 + i * 3.4, 24);
							const readAt = 40 + i * 7;
							const read = ramp(frame, readAt, readAt + 12, EASE.outQuint);
							return (
								<div
									key={node.label}
									style={{
										display: 'flex',
										alignItems: 'center',
										height: 44,
										paddingLeft: node.depth * 26,
										opacity: appear * (node.dir ? 0.82 : 1),
										transform: `translateX(${(1 - appear) * -16}px)`,
									}}
								>
									<div
										style={{
											width: 5,
											height: 5,
											borderRadius: 999,
											marginRight: 13,
											backgroundColor: node.dir
												? 'rgba(240,238,230,0.22)'
												: read > 0.5
													? C.clay
													: 'rgba(240,238,230,0.3)',
										}}
									/>
									<Mono
										size={21}
										color={node.dir ? C.mute : read > 0.5 ? C.cream : C.slate}
										style={{letterSpacing: '0.01em'}}
									>
										{node.label}
										{node.dir ? '/' : ''}
									</Mono>
									{node.dir ? null : (
										<div
											style={{
												marginLeft: 'auto',
												fontFamily: FONT.mono,
												fontSize: 11,
												letterSpacing: '0.2em',
												color: C.clay,
												opacity: read * 0.85,
											}}
										>
											READ
										</div>
									)}
								</div>
							);
						})}
					</div>

					<div
						style={{
							marginTop: 30,
							paddingTop: 22,
							borderTop: `1px solid ${C.inkLine}`,
							opacity: ramp(frame, 56, 76),
						}}
					>
						<Mono size={17} color={C.mute}>
							{`${commas(seg(frame, 56, 132, 0, 14))} files  ·  ${commas(
								seg(frame, 56, 150, 0, 2318),
							)} lines`}
						</Mono>
					</div>
				</div>

				{/* File under inspection */}
				<div style={{position: 'absolute', left: 616, top: 252, width: 1220}}>
					<Panel
						title="src/api/checkout/route.ts"
						bodyStyle={{padding: `${PAD}px 0`, position: 'relative', overflow: 'hidden'}}
						style={{height: 528, opacity: ramp(frame, 4, 24, EASE.out)}}
					>
						{CODE.map((line, i) => {
							const center = i * ROW_H + ROW_H / 2;
							const boost = Math.max(0, 1 - Math.abs(center - scanY) / 62) * scanLive;
							const passed = ramp(scanY, center - 6, center + 6);
							const isFlag = i === FLAG;
							const op = Math.min(
								1,
								0.26 + passed * 0.36 + boost * 0.4 + (isFlag ? flagIn * 0.38 : 0),
							);

							return (
								<div
									key={i}
									style={{
										display: 'flex',
										alignItems: 'center',
										height: ROW_H,
										position: 'relative',
										paddingLeft: 22,
									}}
								>
									{isFlag ? (
										<div
											style={{
												position: 'absolute',
												left: 0,
												top: 0,
												bottom: 0,
												width: 3,
												backgroundColor: C.clay,
												transform: `scaleY(${flagIn})`,
											}}
										/>
									) : null}
									<Gutter n={41 + i} size={24} width={56} />
									<CodeLine
										line={line}
										size={24}
										opacity={op}
										tint={isFlag && flagIn > 0.4 ? C.clay : undefined}
									/>
									{isFlag ? (
										<div
											style={{
												marginLeft: 22,
												fontFamily: FONT.mono,
												fontSize: 12,
												letterSpacing: '0.16em',
												textTransform: 'uppercase',
												color: C.ink,
												backgroundColor: C.clay,
												borderRadius: 4,
												padding: '4px 9px 3px',
												opacity: flagIn,
												transform: `translateX(${(1 - flagIn) * -12}px)`,
											}}
										>
											no limiter
										</div>
									) : null}
								</div>
							);
						})}

						{/* The read head. */}
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: PAD + scanY,
								height: 2,
								backgroundColor: C.clay,
								opacity: scanLive * 0.9,
								boxShadow: `0 0 34px 10px rgba(217,119,87,0.4)`,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: PAD + scanY - 54,
								height: 54,
								background:
									'linear-gradient(to bottom, rgba(217,119,87,0) 0%, rgba(217,119,87,0.12) 100%)',
								opacity: scanLive,
							}}
						/>

						{/* Match cut target for the next transition. */}
						<div
							style={{
								position: 'absolute',
								left: 12,
								right: 12,
								top: PAD + FLAG * ROW_H - 7,
								height: ROW_H + 14,
								border: `1px solid ${C.clay}`,
								borderRadius: 8,
								opacity: boxIn * 0.75,
								transform: `scale(${1 + boxIn * 0.02})`,
							}}
						/>
					</Panel>
				</div>
			</AbsoluteFill>
		</Ink>
	);
};
