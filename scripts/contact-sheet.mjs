// Renders a set of review frames from one bundle and one browser instance.
// Used to check composition and legibility before committing to a full render.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const FRAMES = process.argv[2]
	? process.argv[2].split(',').map(Number)
	: [70, 130, 168, 230, 292, 400, 460, 476, 560, 645, 658, 760, 830, 848, 960, 1040, 1066, 1170];

const outDir = path.resolve('out/sheet');
mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'ClaudeCodeFilm'});
const browser = await openBrowser('chrome');

for (const frame of FRAMES) {
	const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
	await renderStill({
		composition,
		serveUrl,
		output,
		frame,
		overwrite: true,
		puppeteerInstance: browser,
		scale: 0.6,
	});
	console.log(`frame ${frame}`);
}

await browser.close({silent: true});
