/**
 * Post-build script: reads Vite's dist output, inlines CSS and JS,
 * injects window.__GAME_DATA__, and writes a single HTML file (dist/game.html).
 *
 * Run after `npm run build`. Game data is read from src/data/devGameData.js.
 * To ship a different game, replace that module or add a JSON path option.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(dirname(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Load game data (same shape as dev; can be swapped for full game data)
const { devGameData } = await import(join(rootDir, 'src', 'data', 'devGameData.js'));

const htmlPath = join(distDir, 'index.html');
let html = readFileSync(htmlPath, 'utf-8');

// Extract asset paths: /assets/xxx.js and /assets/xxx.css
const scriptMatch = html.match(/src="(\/assets\/[^"]+\.js)"/);
const styleMatch = html.match(/href="(\/assets\/[^"]+\.css)"/);

if (!scriptMatch || !styleMatch) {
  console.error('Could not find script or stylesheet in dist/index.html');
  process.exit(1);
}

const scriptPath = join(distDir, scriptMatch[1].replace(/^\//, ''));
const stylePath = join(distDir, styleMatch[1].replace(/^\//, ''));

const jsContent = readFileSync(scriptPath, 'utf-8');
const cssContent = readFileSync(stylePath, 'utf-8');

// Escape for embedding in HTML: </script> in JSON would break the parser
const gameDataJson = JSON.stringify(devGameData).replace(/<\/script/gi, '<\\/script');

const pageTitle = devGameData.meta?.title && devGameData.meta?.subtitle
  ? `${devGameData.meta.title} — ${devGameData.meta.subtitle}`
  : 'FMV Dating Sim';

const singleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Quicksand:wght@300;400;500;600&family=Nanum+Myeongjo:wght@400;700&display=swap" rel="stylesheet" />
  <style>${cssContent}</style>
</head>
<body>
  <div id="root"></div>
  <script>window.__GAME_DATA__ = ${gameDataJson};</script>
  <script type="module">${jsContent}</script>
</body>
</html>
`;

const outPath = join(distDir, 'game.html');
writeFileSync(outPath, singleHtml, 'utf-8');
console.log('Single-file build written to dist/game.html');
