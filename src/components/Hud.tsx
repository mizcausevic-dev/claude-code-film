import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, FONT, SAFE, TRACK_WIDE} from '../theme';
import {ramp, seg} from '../lib/anim';
import {CHAPTERS, STARTS, TOTAL} from '../timeline';
import {Starburst} from './Starburst';

const Layer: React.FC<{
	color: string;
	opacity: number;
	label: string;
	labelOpacity: number;
	rule: string;
}> = ({color, opacity, label, labelOpacity, rule}) => (
	<AbsoluteFill style={{opacity}}>
		<div
			style={{
				position: 'absolute',
				top: SAFE - 22,
				left: SAFE,
				display: 'flex',
				alignItems: 'center',
				gap: 12,
			}}
		>
			<Starburst size={17} color={color} />
			<div
				style={{
					fontFamily: FONT.mono,
					fontSize: 13,
					letterSpacing: TRACK_WIDE,
					textTransform: 'uppercase',
					color,
					fontWeight: 500,
				}}
			>
				Claude Code
			</div>
		</div>
		<div
			style={{
				position: 'absolute',
				top: SAFE - 22,
				right: SAFE,
				fontFamily: FONT.mono,
				fontSize: 13,
				letterSpacing: TRACK_WIDE,
				textTransform: 'uppercase',
				color,
				fontWeight: 500,
				opacity: labelOpacity,
			}}
		>
			{label}
		</div>
		<div
			style={{
				position: 'absolute',
				left: SAFE,
				right: SAFE,
				bottom: SAFE - 26,
				height: 1,
				backgroundColor: rule,
			}}
		/>
	</AbsoluteFill>
);

/**
 * Persistent frame furniture: mark, chapter, progress. It carries the film's
 * structure so individual shots do not have to explain themselves.
 */
export const Hud: React.FC = () => {
	const frame = useCurrentFrame();

	// 1 means light type over ink, 0 means dark type over cream.
	const tone = interpolate(
		frame,
		[STARTS[1] - 8, STARTS[1] + 12, STARTS[5] - 8, STARTS[5] + 12],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const live = seg(frame, 0, 24, 0, 1) * (1 - ramp(frame, STARTS[6] - 24, STARTS[6]));

	const chapter = CHAPTERS.find((c) => frame >= c.from && frame < c.to);
	// Chapter type hides across the title card, where it would fight the lockup.
	const chapterFade = chapter
		? Math.min(ramp(frame, chapter.from, chapter.from + 14), 1 - ramp(frame, chapter.to - 14, chapter.to))
		: 0;

	const progress = interpolate(frame, [0, TOTAL - 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: live, pointerEvents: 'none'}}>
			<Layer
				color={C.ink}
				opacity={1 - tone}
				label={chapter?.label ?? ''}
				labelOpacity={chapterFade}
				rule="rgba(20,20,19,0.16)"
			/>
			<Layer
				color={C.cream}
				opacity={tone}
				label={chapter?.label ?? ''}
				labelOpacity={chapterFade}
				rule="rgba(240,238,230,0.16)"
			/>
			<div
				style={{
					position: 'absolute',
					left: SAFE,
					bottom: SAFE - 26,
					height: 2,
					marginBottom: -0.5,
					width: `${progress * (100 - (SAFE * 2 * 100) / 1920)}%`,
					backgroundColor: C.clay,
					transformOrigin: 'left center',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					right: SAFE,
					bottom: SAFE - 56,
					fontFamily: FONT.mono,
					fontSize: 12,
					letterSpacing: TRACK_WIDE,
					color: tone > 0.5 ? 'rgba(240,238,230,0.42)' : 'rgba(20,20,19,0.38)',
					opacity: ramp(frame, 20, 44, EASE.out),
				}}
			>
				{String(Math.floor(frame / 60)).padStart(2, '0')} / 20 SEC
			</div>
		</AbsoluteFill>
	);
};
