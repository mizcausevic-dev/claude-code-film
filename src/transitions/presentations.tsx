import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {
	TransitionPresentation,
	TransitionPresentationComponentProps,
} from '@remotion/transitions';
import {C, EASE} from '../theme';

type Empty = Record<string, never>;

/**
 * Shot 1 to 2. The hairline the developer just drew under their prompt becomes the
 * aperture: the machine world opens out of that single rule.
 */
const RuleExpandComp: React.FC<TransitionPresentationComponentProps<Empty>> = ({
	children,
	presentationProgress,
	presentationDirection,
}) => {
	const p = presentationProgress;

	if (presentationDirection === 'exiting') {
		// Scale up, never down. Scaling down would expose the composition edges.
		return (
			<AbsoluteFill style={{transform: `scale(${1 + p * 0.03})`}}>
				{children}
			</AbsoluteFill>
		);
	}

	const t = EASE.inOutSoft(p);
	// The rule in shot one sits at 54% height, so the band opens from there.
	const top = 54 * (1 - t);
	const bottom = 46 * (1 - t);
	const lip = Math.min(1, (1 - p) * 2.2);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `inset(${top}% 0% ${bottom}% 0%)`}}>
				{children}
			</AbsoluteFill>
			{/* The drawn rule splitting apart, carried into the new world. */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: `${top}%`,
					height: 2,
					backgroundColor: C.clay,
					opacity: lip,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: `${bottom}%`,
					height: 2,
					backgroundColor: C.clay,
					opacity: lip,
				}}
			/>
		</AbsoluteFill>
	);
};

export const ruleExpand = (): TransitionPresentation<Empty> => ({
	component: RuleExpandComp,
	props: {},
});

/**
 * Shot 3 to 4. A match cut: the flagged code block pushes toward camera while the
 * plan arrives from behind it, so the plan reads as coming out of that code.
 */
const BlockZoomComp: React.FC<TransitionPresentationComponentProps<Empty>> = ({
	children,
	presentationProgress,
	presentationDirection,
}) => {
	const p = EASE.outQuint(presentationProgress);

	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{transform: `scale(${1 + p * 0.34})`, opacity: 1 - p}}>
				{children}
			</AbsoluteFill>
		);
	}

	return (
		<AbsoluteFill
			style={{
				transform: `scale(${0.9 + p * 0.1})`,
				opacity: Math.min(1, p * 2.6),
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const blockZoom = (): TransitionPresentation<Empty> => ({
	component: BlockZoomComp,
	props: {},
});

/**
 * Shot 4 to 5. A raked blade wipe with a lit leading edge. The slant echoes the
 * diff gutter, and the edge gives the cut a physical direction.
 */
const BladeWipeComp: React.FC<TransitionPresentationComponentProps<Empty>> = ({
	children,
	presentationProgress,
	presentationDirection,
}) => {
	const p = EASE.inOutSoft(presentationProgress);

	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{transform: `translateX(${-p * 26}px)`}}>
				{children}
			</AbsoluteFill>
		);
	}

	const RAKE = 38;
	const a = p * (100 + RAKE);
	const blade = `polygon(0% 0%, ${a}% 0%, ${a - RAKE}% 100%, 0% 100%)`;
	const edge = `polygon(${a}% 0%, ${a + 1}% 0%, ${a - RAKE + 1}% 100%, ${a - RAKE}% 100%)`;

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: blade}}>{children}</AbsoluteFill>
			<AbsoluteFill
				style={{
					clipPath: edge,
					backgroundColor: C.clay,
					opacity: Math.min(1, p * 8) * Math.min(1, (1 - p) * 8),
				}}
			/>
		</AbsoluteFill>
	);
};

export const bladeWipe = (): TransitionPresentation<Empty> => ({
	component: BladeWipeComp,
	props: {},
});

/**
 * Shot 5 to 6. The passing test bar keeps travelling and becomes the wipe, carrying
 * its own glow from the machine world back out to paper.
 */
type BarProps = {color: string};

const BarWipeComp: React.FC<TransitionPresentationComponentProps<BarProps>> = ({
	children,
	presentationProgress,
	presentationDirection,
	passedProps,
}) => {
	const p = EASE.inOutSoft(presentationProgress);

	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{transform: `translateX(${-p * 40}px)`, opacity: 1 - p * 0.3}}>
				{children}
			</AbsoluteFill>
		);
	}

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `inset(0% ${(1 - p) * 100}% 0% 0%)`}}>
				{children}
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: `${p * 100}%`,
					width: 7,
					marginLeft: -4,
					backgroundColor: passedProps.color,
					boxShadow: `0 0 60px 14px ${passedProps.color}`,
					opacity: Math.min(1, p * 10) * Math.min(1, (1 - p) * 6),
				}}
			/>
		</AbsoluteFill>
	);
};

export const barWipe = (props: BarProps): TransitionPresentation<BarProps> => ({
	component: BarWipeComp,
	props,
});
