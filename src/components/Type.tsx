import React from 'react';
import {C, FONT, TRACK_WIDE} from '../theme';

/** Small all caps monospace label. The film's connective tissue. */
export const Kicker: React.FC<{
	children: React.ReactNode;
	color?: string;
	size?: number;
	style?: React.CSSProperties;
}> = ({children, color = C.clay, size = 14, style}) => (
	<div
		style={{
			fontFamily: FONT.mono,
			fontSize: size,
			letterSpacing: TRACK_WIDE,
			textTransform: 'uppercase',
			color,
			fontWeight: 500,
			...style,
		}}
	>
		{children}
	</div>
);

export const Mono: React.FC<{
	children: React.ReactNode;
	size?: number;
	color?: string;
	style?: React.CSSProperties;
}> = ({children, size = 20, color = C.mute, style}) => (
	<div
		style={{
			fontFamily: FONT.mono,
			fontSize: size,
			color,
			whiteSpace: 'pre',
			...style,
		}}
	>
		{children}
	</div>
);

/** Blinking terminal caret. Two frame phases so it reads at 60fps. */
export const Caret: React.FC<{
	frame: number;
	height: number;
	width?: number;
	color?: string;
	solid?: boolean;
}> = ({frame, height, width = 3, color = C.clay, solid = false}) => (
	<span
		style={{
			display: 'inline-block',
			width,
			height,
			backgroundColor: color,
			opacity: solid ? 1 : frame % 44 < 26 ? 1 : 0.12,
			verticalAlign: 'text-bottom',
			marginLeft: 4,
			borderRadius: 1,
		}}
	/>
);

/** Rounded status pill. */
export const Chip: React.FC<{
	children: React.ReactNode;
	color?: string;
	bg?: string;
	border?: string;
	size?: number;
	style?: React.CSSProperties;
}> = ({children, color = C.clay, bg, border, size = 13, style}) => (
	<div
		style={{
			fontFamily: FONT.mono,
			fontSize: size,
			letterSpacing: '0.1em',
			textTransform: 'uppercase',
			color,
			backgroundColor: bg ?? 'transparent',
			border: `1px solid ${border ?? color}`,
			borderRadius: 999,
			padding: '5px 12px 5px 13px',
			lineHeight: 1,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);
