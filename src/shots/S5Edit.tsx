import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ink} from '../components/Backdrop';
import {Panel} from '../components/Panel';
import {CodeLine, Gutter, type Line} from '../components/Code';
import {Chip, Kicker, Mono} from '../components/Type';
import {C, EASE, FONT, SAFE} from '../theme';
import {pop, ramp, seg} from '../lib/anim';

type Kind = 'ctx' | 'del' | 'add';
type Row = {kind: Kind; n: number; line: Line};

const ROWS: Row[] = [
	{
		kind: 'ctx',
		n: 42,
		line: [
			['  const ', 'kw'],
			['user', 'base'],
			[' = ', 'pun'],
			['await ', 'kw'],
			['auth', 'fn'],
			['(req);', 'pun'],
		],
	},
	{kind: 'del', n: 43, line: [['  // TODO: throttle abusive clients', 'com']]},
	{
		kind: 'add',
		n: 43,
		line: [
			['  const ', 'kw'],
			['gate', 'base'],
			[' = ', 'pun'],
			['rateLimit', 'fn'],
			['(user', 'base'],
			['.', 'pun'],
			['id', 'base'],
			[');', 'pun'],
		],
	},
	{
		kind: 'add',
		n: 44,
		line: [
			['  if ', 'kw'],
			['(!gate', 'base'],
			['.', 'pun'],
			['ok', 'base'],
			[') {', 'pun'],
		],
	},
	{
		kind: 'add',
		n: 45,
		line: [
			['    return ', 'kw'],
			['Response', 'type'],
			['.', 'pun'],
			['json', 'fn'],
			['(', 'pun'],
		],
	},
	{
		kind: 'add',
		n: 46,
		line: [
			['      { ', 'pun'],
			['error', 'base'],
			[': ', 'pun'],
			["'rate_limited'", 'str'],
			[' },', 'pun'],
		],
	},
	{
		kind: 'add',
		n: 47,
		line: [
			['      { ', 'pun'],
			['status', 'base'],
			[': ', 'pun'],
			['429', 'num'],
			[', ', 'pun'],
			['headers', 'base'],
			[': gate', 'base'],
			['.', 'pun'],
			['headers', 'base'],
			[' },', 'pun'],
		],
	},
	{kind: 'add', n: 48, line: [['    );', 'pun']]},
	{kind: 'add', n: 49, line: [['  }', 'pun']]},
	{
		kind: 'ctx',
		n: 50,
		line: [
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
	},
];

const ROW_H = 40;
const DEL_OUT = 30;
const ADD_FROM = 44;
const ADD_STEP = 10;
const DOTS = 18;

/**
 * Shot 05. The edit. The stale comment collapses out, the new guard clause is laid
 * in line by line, and the suite runs. The growing bar at the bottom becomes the
 * wipe into the result, so verification literally carries us out of the machine.
 */
export const S5Edit: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	let addIndex = -1;
	const addStart = (i: number) => ADD_FROM + i * ADD_STEP;

	const added = Math.round(seg(frame, ADD_FROM, addStart(6) + 12, 0, 7));
	const removed = frame >= DEL_OUT + 14 ? 1 : 0;

	const dotsShown = Math.floor(seg(frame, 124, 150, 0, DOTS));
	const passIn = pop(frame, fps, 154, 22);
	const sweep = ramp(frame, 202, 220, EASE.inOutSoft);

	return (
		<Ink>
			<AbsoluteFill>
				<div style={{position: 'absolute', left: SAFE, top: 232, width: 1250}}>
					<Panel
						title="src/api/checkout/route.ts"
						badge={
							<Mono size={15} color={C.mute}>
								<span style={{color: C.green}}>{`+${added}`}</span>
								{'  '}
								<span style={{color: C.red}}>{`-${removed}`}</span>
							</Mono>
						}
						bodyStyle={{padding: '22px 0'}}
						style={{opacity: ramp(frame, 0, 18, EASE.out)}}
					>
						{ROWS.map((row, i) => {
							if (row.kind === 'add') addIndex += 1;
							const myAdd = addIndex;

							const collapse =
								row.kind === 'del' ? ramp(frame, DEL_OUT, DEL_OUT + 20, EASE.inOutSoft) : 0;
							const reveal =
								row.kind === 'add'
									? ramp(frame, addStart(myAdd) + 3, addStart(myAdd) + 15, EASE.outQuint)
									: 1;
							// The row opens height first, then the text wipes into it.
							const open =
								row.kind === 'add'
									? ramp(frame, addStart(myAdd) - 5, addStart(myAdd) + 5, EASE.outQuint)
									: 1;

							const bg =
								row.kind === 'add'
									? `rgba(131,176,107,${0.1 * reveal})`
									: row.kind === 'del'
										? `rgba(196,87,62,${0.13 * (1 - collapse)})`
										: 'transparent';

							return (
								<div
									key={`${row.kind}-${i}`}
									style={{
										height: ROW_H * (row.kind === 'del' ? 1 - collapse : open),
										overflow: 'hidden',
										backgroundColor: bg,
										display: 'flex',
										alignItems: 'center',
										paddingLeft: 18,
										opacity: row.kind === 'del' ? 1 - collapse : 1,
										transform:
											row.kind === 'del' ? `translateX(${-collapse * 34}px)` : 'none',
									}}
								>
									<span
										style={{
											fontFamily: FONT.mono,
											fontSize: 21,
											width: 26,
											flex: '0 0 auto',
											color:
												row.kind === 'add'
													? C.green
													: row.kind === 'del'
														? C.red
														: 'transparent',
										}}
									>
										{row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : ' '}
									</span>
									<Gutter n={row.n} size={23} width={52} color={row.kind === 'ctx' ? '#3F3D38' : '#5C5951'} />
									<div
										style={{
											clipPath: `inset(0% ${(1 - reveal) * 100}% 0% 0%)`,
											transform: `translateX(${(1 - reveal) * -14}px)`,
										}}
									>
										<CodeLine line={row.line} size={23} opacity={row.kind === 'ctx' ? 0.42 : 1} />
									</div>
								</div>
							);
						})}
					</Panel>
				</div>

				{/* The file Claude Code created, summarised rather than spelled out. */}
				<div style={{position: 'absolute', left: 1380, top: 232, width: 456}}>
					<Panel
						title="middleware/rateLimit.ts"
						badge={<Chip color={C.green} border="rgba(131,176,107,0.4)">new</Chip>}
						bodyStyle={{padding: 26}}
						style={{
							opacity: ramp(frame, 56, 78, EASE.out),
							transform: `translateY(${seg(frame, 56, 84, 22, 0, EASE.outQuint)}px)`,
						}}
					>
						{[0.9, 0.58, 0.74, 0.42, 0.82, 0.5, 0.66, 0.34].map((w, i) => (
							<div
								key={i}
								style={{
									height: 7,
									borderRadius: 999,
									marginBottom: 15,
									width: `${w * 100}%`,
									backgroundColor: i % 3 === 0 ? 'rgba(217,119,87,0.5)' : 'rgba(240,238,230,0.16)',
									transform: `scaleX(${ramp(frame, 70 + i * 5, 88 + i * 5, EASE.outQuint)})`,
									transformOrigin: 'left center',
								}}
							/>
						))}
						<div
							style={{
								marginTop: 22,
								display: 'flex',
								alignItems: 'baseline',
								gap: 10,
								opacity: ramp(frame, 104, 124),
							}}
						>
							<div
								style={{
									fontFamily: FONT.mono,
									fontSize: 46,
									color: C.green,
									lineHeight: 1,
								}}
							>
								+38
							</div>
							<Mono size={14} color={C.slate} style={{letterSpacing: '0.18em'}}>
								LINES
							</Mono>
						</div>
					</Panel>
				</div>

				{/* Verification strip. */}
				<div
					style={{
						position: 'absolute',
						left: SAFE,
						right: SAFE,
						top: 790,
						opacity: ramp(frame, 118, 136, EASE.out),
					}}
				>
					<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
						<Kicker color={C.slate} size={13}>
							Verify
						</Kicker>
						<Mono size={19} color={C.cream}>
							$ npm test
						</Mono>
						<div style={{display: 'flex', gap: 7, marginLeft: 10}}>
							{Array.from({length: DOTS}).map((_, i) => (
								<div
									key={i}
									style={{
										width: 9,
										height: 9,
										borderRadius: 999,
										backgroundColor: i < dotsShown ? C.green : 'rgba(240,238,230,0.12)',
									}}
								/>
							))}
						</div>
						<div
							style={{
								marginLeft: 'auto',
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								opacity: passIn,
								transform: `translateY(${(1 - passIn) * 12}px)`,
							}}
						>
							<Mono size={24} color={C.green}>
								{'\u2713 18 passed'}
							</Mono>
							<Mono size={17} color={C.slate}>
								1.24s
							</Mono>
						</div>
					</div>
					<div
						style={{
							marginTop: 20,
							height: 3,
							backgroundColor: 'rgba(240,238,230,0.08)',
							position: 'relative',
						}}
					>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								backgroundColor: C.green,
								transform: `scaleX(${Math.max(ramp(frame, 124, 156), sweep)})`,
								transformOrigin: 'left center',
								boxShadow: sweep > 0 ? `0 0 40px 8px rgba(131,176,107,0.5)` : 'none',
							}}
						/>
					</div>
				</div>
			</AbsoluteFill>
		</Ink>
	);
};
