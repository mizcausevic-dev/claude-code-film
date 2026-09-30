import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {fade} from '@remotion/transitions/fade';
import {C} from './theme';
import {HEIGHT, SHOTS, TRANS, WIDTH} from './timeline';
import {Hud} from './components/Hud';
import {bladeWipe, barWipe, blockZoom, ruleExpand} from './transitions/presentations';
import {S1Idea} from './shots/S1Idea';
import {S2Title} from './shots/S2Title';
import {S3Context} from './shots/S3Context';
import {S4Plan} from './shots/S4Plan';
import {S5Edit} from './shots/S5Edit';
import {S6Shipped} from './shots/S6Shipped';
import {S7End} from './shots/S7End';

const wipeEase = Easing.bezier(0.65, 0, 0.35, 1);

export const Film: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.ink}}>
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={SHOTS[0]}>
				<S1Idea />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={ruleExpand()}
				timing={linearTiming({durationInFrames: TRANS[0]})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[1]}>
				<S2Title />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={clockWipe({width: WIDTH, height: HEIGHT})}
				timing={linearTiming({durationInFrames: TRANS[1], easing: wipeEase})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[2]}>
				<S3Context />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={blockZoom()}
				timing={linearTiming({durationInFrames: TRANS[2]})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[3]}>
				<S4Plan />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={bladeWipe()}
				timing={linearTiming({durationInFrames: TRANS[3]})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[4]}>
				<S5Edit />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={barWipe({color: C.green})}
				timing={linearTiming({durationInFrames: TRANS[4]})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[5]}>
				<S6Shipped />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				presentation={fade()}
				timing={linearTiming({durationInFrames: TRANS[5]})}
			/>

			<TransitionSeries.Sequence durationInFrames={SHOTS[6]}>
				<S7End />
			</TransitionSeries.Sequence>
		</TransitionSeries>

		<Hud />
	</AbsoluteFill>
);
