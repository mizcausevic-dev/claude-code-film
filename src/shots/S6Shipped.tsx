import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Backdrop';
import {Panel} from '../components/Panel';
import {Caret, Chip, Kicker, Mono} from '../components/Type';
import {C, EASE, FONT, SAFE} from '../theme';
import {commas, pop, ramp, seg, typed} from '../lib/anim';

type TermLine = {text: string; at: number; tone: 'cmd' | 'out' | 'ok'};

const TERM: TermLine[] = [
	{text: '$ git add -A', at: 14, tone: 'cmd'},
	{text: '$ git commit -m "add per-user rate limiting"', at: 34, tone: 'cmd'},
	{text: '  [main a1f39c2] 2 files changed, +45 -1', at: 74, tone: 'out'},
	{text: '$ npm run deploy', at: 96, tone: 'cmd'},
	{text: '  building ... uploading ... routing', at: 122, tone: 'out'},
	{text: '  \u2713 live in 11s', at: 150, tone: 'ok'},
];

const CHART_W = 780;
const CHART_H = 236;
const CEIL = 30;
const MAX_Y = 58;

// One minute of request volume for a single user: a steady floor with two abuse spikes.
const SERIES = Array.from({length: 56}, (_, i) => {
	const t = i / 55;
	const floor = 13 + Math.sin(t * 9.2) * 3.4 + Math.sin(t * 24) * 1.6;
	const spikes =
		30 * Math.exp(-((t - 0.44) ** 2) / 0.0022) + 24 * Math.exp(-((t - 0.79) ** 2) / 0.0016);
	return floor + spikes;
});

const toPath = (values: number[]): string =>
	values
		.map((v, i) => {
			const x = (i / (values.length - 1)) * CHART_W;
			const y = CHART_H - (Math.min(v, MAX_Y) / MAX_Y) * CHART_H;
			return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
		})
		.join(' ');

const BEFORE = toPath(SERIES);
const AFTER = toPath(SERIES.map((v) => Math.min(v, CEIL)));

/**
 * Shot 06. The result. Back on paper, because this is the part the human owns again.
 * The chart is the whole argument in one image: the same traffic, clipped at the
 * limit instead of running away with the service.
 */
export const S6Shipped: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const head = pop(frame, fps, 2, 24);
	const beforeDraw = ramp(frame, 96, 146, EASE.outCubic);
	const ceilDraw = ramp(frame, 130, 156, EASE.outQuint);
	const afterDraw = ramp(frame, 150, 200, EASE.outCubic);

	return (
		<Paper>
			<AbsoluteFill>
				<div style={{position: 'absolute', left: SAFE, top: 152, opacity: head}}>
					<Kicker color={C.clay}>Result</Kicker>
					<div
						style={{
							marginTop: 16,
							fontFamily: FONT.serif,
							fontSize: 82,
							lineHeight: 1,
							color: C.ink,
							transform: `translateY(${(1 - head) * 22}px)`,
						}}
					>
						Rate limiting, live.
					</div>
				</div>

				{/* What shipped. */}
				<div style={{position: 'absolute', left: SAFE, top: 348, width: 800}}>
					<Panel
						title="zsh"
						bodyStyle={{padding: '22px 26px'}}
						style={{
							height: 404,
							opacity: ramp(frame, 8, 30, EASE.out),
							transform: `translateY(${seg(frame, 8, 40, 24, 0, EASE.outQuint)}px)`,
						}}
					>
						{TERM.map((l) => {
							const text = typed(l.text, frame, l.at, 64, fps);
							const active = frame >= l.at && text.length < l.text.length;
							return (
								<div key={l.text} style={{height: 50, display: 'flex', alignItems: 'center'}}>
									<Mono
										size={19}
										color={l.tone === 'cmd' ? C.cream : l.tone === 'ok' ? C.green : C.mute}
									>
										{text}
									</Mono>
									{active ? <Caret frame={frame} height={20} width={9} solid /> : null}
								</div>
							);
						})}
					</Panel>
				</div>

				{/* What changed. */}
				<div style={{position: 'absolute', left: 940, top: 348, width: 896}}>
					<Panel
						tone="paper"
						title="requests per user  ·  last 60s"
						badge={<Chip color={C.clayDeep} border="rgba(168,79,48,0.35)">live</Chip>}
						bodyStyle={{padding: '30px 32px 22px'}}
						style={{
							height: 404,
							opacity: ramp(frame, 74, 96, EASE.out),
							transform: `translateY(${seg(frame, 74, 106, 24, 0, EASE.outQuint)}px)`,
						}}
					>
						<svg width={CHART_W} height={CHART_H} style={{overflow: 'visible'}}>
							{[0, 0.5, 1].map((g) => (
								<line
									key={g}
									x1={0}
									x2={CHART_W}
									y1={CHART_H * g}
									y2={CHART_H * g}
									stroke={C.paperLine}
									strokeWidth={1}
									opacity={0.6}
								/>
							))}

							<defs>
								<clipPath id="reveal-before">
									<rect x={0} y={-40} width={CHART_W * beforeDraw} height={CHART_H + 80} />
								</clipPath>
							</defs>

							{/* Unlimited traffic, for contrast. */}
							<path
								d={BEFORE}
								fill="none"
								stroke={C.red}
								strokeWidth={2}
								strokeDasharray="5 6"
								opacity={0.55}
								clipPath="url(#reveal-before)"
							/>

							{/* The ceiling. */}
							<line
								x1={0}
								x2={CHART_W * ceilDraw}
								y1={CHART_H - (CEIL / MAX_Y) * CHART_H}
								y2={CHART_H - (CEIL / MAX_Y) * CHART_H}
								stroke={C.ink}
								strokeWidth={1.5}
								strokeDasharray="2 7"
							/>
							<text
								x={6}
								y={CHART_H - (CEIL / MAX_Y) * CHART_H - 12}
								textAnchor="start"
								style={{
									fontFamily: FONT.mono,
									fontSize: 14,
									letterSpacing: '0.12em',
									fill: C.ink,
									opacity: ceilDraw,
								}}
							>
								LIMIT 30 / MIN
							</text>

							{/* Traffic under the limiter. */}
							<path
								d={AFTER}
								fill="none"
								stroke={C.clayDeep}
								strokeWidth={3.4}
								strokeLinejoin="round"
								strokeLinecap="round"
								pathLength={1}
								strokeDasharray={1}
								strokeDashoffset={1 - afterDraw}
							/>
						</svg>

						<div style={{display: 'flex', gap: 26, marginTop: 14}}>
							<Mono size={13} color={C.red} style={{letterSpacing: '0.14em', opacity: 0.8}}>
								{'--- UNLIMITED'}
							</Mono>
							<Mono size={13} color={C.clayDeep} style={{letterSpacing: '0.14em'}}>
								{'\u2014 THROTTLED'}
							</Mono>
						</div>
					</Panel>
				</div>

				{/* Two numbers, rolling. */}
				<div
					style={{
						position: 'absolute',
						left: SAFE,
						top: 800,
						display: 'flex',
						gap: 90,
						opacity: ramp(frame, 158, 182, EASE.out),
					}}
				>
					{[
						{
							label: '429s served',
							value: commas(seg(frame, 158, 216, 0, 1204)),
							unit: '',
						},
						{
							label: 'p95 checkout latency',
							value: commas(seg(frame, 158, 216, 340, 81)),
							unit: ' ms',
						},
					].map((stat) => (
						<div key={stat.label}>
							<Kicker color={C.slate} size={13}>
								{stat.label}
							</Kicker>
							<div
								style={{
									marginTop: 12,
									fontFamily: FONT.mono,
									fontSize: 52,
									color: C.ink,
									lineHeight: 1,
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{stat.value}
								<span style={{fontSize: 24, color: C.slate}}>{stat.unit}</span>
							</div>
						</div>
					))}
				</div>
			</AbsoluteFill>
		</Paper>
	);
};
