import React from 'react';
import {C, FONT} from '../theme';

/** Editor and terminal surfaces share one chrome so the film feels like one system. */
export const Panel: React.FC<{
	title?: string;
	badge?: React.ReactNode;
	children: React.ReactNode;
	style?: React.CSSProperties;
	bodyStyle?: React.CSSProperties;
	tone?: 'ink' | 'paper';
}> = ({title, badge, children, style, bodyStyle, tone = 'ink'}) => {
	const dark = tone === 'ink';
	return (
		<div
			style={{
				borderRadius: 16,
				overflow: 'hidden',
				backgroundColor: dark ? C.inkPanel : C.bone,
				border: `1px solid ${dark ? C.inkLine : C.paperLine}`,
				boxShadow: dark
					? '0 40px 90px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
					: '0 30px 70px rgba(20,20,19,0.14)',
				display: 'flex',
				flexDirection: 'column',
				...style,
			}}
		>
			{title === undefined ? null : (
				<div
					style={{
						height: 46,
						flex: '0 0 auto',
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						padding: '0 18px',
						borderBottom: `1px solid ${dark ? C.inkLine : C.paperLine}`,
						backgroundColor: dark ? C.inkRaise : C.creamDim,
					}}
				>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: 999,
							backgroundColor: C.clay,
							flex: '0 0 auto',
						}}
					/>
					<div
						style={{
							fontFamily: FONT.mono,
							fontSize: 15,
							color: dark ? C.mute : C.slate,
							letterSpacing: '0.03em',
						}}
					>
						{title}
					</div>
					<div style={{marginLeft: 'auto'}}>{badge}</div>
				</div>
			)}
			<div style={{flex: 1, minHeight: 0, ...bodyStyle}}>{children}</div>
		</div>
	);
};
