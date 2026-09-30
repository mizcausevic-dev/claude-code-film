import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, HEIGHT, TOTAL, WIDTH} from './timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="ClaudeCodeFilm"
			component={Film}
			durationInFrames={TOTAL}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
	</>
);
