import React from 'react';
import {C, FONT} from '../theme';

/** Hand tokenised rather than parsed. Twelve lines of code do not need a lexer. */
export const TOKEN = {
	base: '#B8B4AA',
	kw: C.clay,
	str: '#8FB98A',
	num: '#C9A86A',
	com: '#6A6862',
	pun: '#7C7970',
	fn: '#DCD3AC',
	type: '#A79BC0',
	dim: '#4E4C47',
} as const;

export type Tok = [text: string, kind: keyof typeof TOKEN];
export type Line = Tok[];

export const CodeLine: React.FC<{
	line: Line;
	size?: number;
	opacity?: number;
	/** Overrides every token colour, for lines the film needs to call out. */
	tint?: string;
	style?: React.CSSProperties;
}> = ({line, size = 21, opacity = 1, tint, style}) => (
	<div
		style={{
			fontFamily: FONT.mono,
			fontSize: size,
			lineHeight: 1.62,
			whiteSpace: 'pre',
			opacity,
			...style,
		}}
	>
		{line.map(([text, kind], i) => (
			<span key={i} style={{color: tint ?? TOKEN[kind]}}>
				{text}
			</span>
		))}
	</div>
);

export const Gutter: React.FC<{
	n: number;
	size?: number;
	color?: string;
	width?: number;
}> = ({n, size = 21, color = TOKEN.dim, width = 44}) => (
	<span
		style={{
			fontFamily: FONT.mono,
			fontSize: size,
			color,
			width,
			display: 'inline-block',
			textAlign: 'right',
			paddingRight: 18,
			flex: '0 0 auto',
		}}
	>
		{n}
	</span>
);
