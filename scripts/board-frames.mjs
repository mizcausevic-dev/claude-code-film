// Renders one representative frame per shot for the review board.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const PICKS = [120, 236, 430, 600, 780, 1020, 1180];

const outDir = path.resolve('out/board');
mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'ClaudeCodeFilm'});
const browser = await openBrowser('chrome');

for (const [i, frame] of PICKS.entries()) {
	await renderStill({
		composition,
		serveUrl,
		output: path.join(outDir, `shot-${i + 1}.jpg`),
		frame,
		imageFormat: 'jpeg',
		jpegQuality: 82,
		scale: 0.5,
		overwrite: true,
		puppeteerInstance: browser,
	});
	console.log(`shot ${i + 1} @ ${frame}`);
}

await browser.close({silent: true});
