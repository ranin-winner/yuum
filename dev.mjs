// tools/dev.mjs
import { spawn } from 'child_process';

const STORE = 'yuumuk.myshopify.com'; // тут постав правильний myshopify-домен, у тебе зараз yuumuk ✅
const HOST  = 'http://127.0.0.1:9292';

const CMD = `shopify theme dev --store ${STORE} --host 127.0.0.1 --port 9292`;

// Головне: stdin = 'inherit', щоб CLI бачив інтерактивний термінал
const child = spawn(CMD, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'], // [stdin, stdout, stderr]
});

let printed = false;

function maybePrintLinks(text) {
  if (printed) return;

  // 1) https://.../?preview_theme_id=187484275062
  let m = text.match(/preview_theme_id=(\d+)/);
  // 2) https://.../admin/themes/187484275062/editor
  if (!m) m = text.match(/admin\/themes\/(\d+)\/editor/);

  if (m) {
    const THEME_ID = m[1];
    const localPreview = `${HOST}/?preview_theme_id=${THEME_ID}`;
    const localEditor  = `${HOST}/admin/themes/${THEME_ID}/editor`;

    console.log('\n──────────────────────────────────────────');
    console.log('Local preview links (через CLI proxy):');
    console.log('  Preview: ', localPreview);
    console.log('  Editor:  ', localEditor);
    console.log('──────────────────────────────────────────\n');

    printed = true;
  }
}

child.stdout.on('data', (buf) => {
  const text = buf.toString();
  process.stdout.write(text);
  maybePrintLinks(text);
});

child.stderr.on('data', (buf) => {
  const text = buf.toString();
  process.stderr.write(text);
  maybePrintLinks(text);
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
