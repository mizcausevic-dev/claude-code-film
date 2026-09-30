import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';

/** Static fractal-noise tooth. Time independent, so it costs nothing per frame. */
const Grain: React.FC<{opacity: number}> = ({opacity}) => (
	<AbsoluteFill style={{opacity, mixBlendMode: 'multiply'}}>
		<svg width="100%" height="100%">
			<filter id="grain">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.85"
					numOctaves={3}
					stitchTiles="stitch"
				/>
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>
	</AbsoluteFill>
);

/** Cream paper. Used for the human bookends of the film. */
export const Paper: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{backgroundColor: C.cream}}>
		<Grain opacity={0.09} />
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 90% at 50% 40%, rgba(255,255,255,0.55), rgba(20,20,19,0.08) 100%)`,
			}}
		/>
		{children}
	</AbsoluteFill>
);

/** Ink. Used for everything happening inside the machine. */
export const Ink: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{backgroundColor: C.ink}}>
		<AbsoluteFill
			style={{
				opacity: 0.5,
				backgroundImage: `linear-gradient(rgba(240,238,230,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(240,238,230,0.045) 1px, transparent 1px)`,
				backgroundSize: '48px 48px',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `radial-gradient(110% 80% at 50% 45%, rgba(217,119,87,0.07), rgba(0,0,0,0.5) 100%)`,
			}}
		/>
		{children}
	</AbsoluteFill>
);
