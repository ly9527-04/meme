/* ═══════════════════════════════════════════════════════
   生成 SVG 占位图 — 无依赖，直接运行
   node gen-placeholders.js
   ═══════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');

const templates = [
  { id: 'fushu',    name: '背手负鼠',      bg: '#6b5b4f', emoji: '🐭' },
  { id: 'haland',   name: '哈兰德',         bg: '#3a7cc3', emoji: '⚽' },
  { id: 'gazi',     name: '嘎子',           bg: '#c0392b', emoji: '🥤' },
  { id: 'huangyx',  name: '黄银勋',         bg: '#2c3e50', emoji: '💼' },
  { id: 'xiaomayun',name: '小马云·范小勤',  bg: '#8b6914', emoji: '✒️' },
  { id: 'luha',     name: '鹿哈',           bg: '#8e44ad', emoji: '🎤' },
  { id: 'tomcat',   name: '汤姆猫',         bg: '#5d8aa8', emoji: '🐱' },
  { id: 'fushu2',   name: '背手负鼠2',      bg: '#8f9779', emoji: '🐭' },
  { id: 'gazi2',    name: '嘎子·玉米',      bg: '#d35400', emoji: '🌽' },
  { id: 'haland2',  name: '哈兰德·布欧',    bg: '#e91e90', emoji: '👹' },
];

const W = 600, H = 450;
const imgDir = path.join(__dirname, 'img');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

templates.forEach(t => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect x="0" y="0" width="${W}" height="40" fill="rgba(255,255,255,0.06)"/>
  <rect x="0" y="85" width="${W}" height="40" fill="rgba(255,255,255,0.04)"/>
  <rect x="0" y="170" width="${W}" height="40" fill="rgba(255,255,255,0.06)"/>
  <rect x="0" y="255" width="${W}" height="40" fill="rgba(255,255,255,0.04)"/>
  <rect x="0" y="340" width="${W}" height="40" fill="rgba(255,255,255,0.06)"/>
  <rect x="0" y="425" width="${W}" height="25" fill="rgba(255,255,255,0.04)"/>
  <text x="${W/2}" y="${H/2 - 10}" text-anchor="middle" font-size="160" filter="drop-shadow(0 8px 20px rgba(0,0,0,0.5))">${t.emoji}</text>
  <text x="${W/2}" y="${H - 55}" text-anchor="middle" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.85)" font-family="sans-serif">${t.name}</text>
  <text x="${W/2}" y="${H - 22}" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.35)" font-family="sans-serif">← 替换为真实照片</text>
</svg>`;

  fs.writeFileSync(path.join(imgDir, t.id + '.svg'), svg);
  console.log('✓', t.id + '.svg');
});

// 也生成 PNG 版本：用最小 SVG 转 data URL 的思路，直接让浏览器处理
// 同时生成一个 HTML 页面方便浏览所有模板
let galleryHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>模板预览</title>
<style>body{background:#111;color:#fff;font-family:sans-serif;padding:20px;display:flex;flex-wrap:wrap;gap:16px}
.card{background:#1a1a2e;border-radius:12px;overflow:hidden;width:280px}
.card img{width:100%;display:block}
.card p{padding:10px;margin:0;font-size:14px;color:#ccc}
</style></head><body>`;

templates.forEach(t => {
  galleryHTML += `<div class="card">
  <img src="img/${t.id}.svg" alt="${t.name}">
  <p>📌 ${t.name} <span style="color:#888">— ${t.id}.svg</span></p>
</div>`;
});

galleryHTML += '</body></html>';
fs.writeFileSync(path.join(__dirname, 'img', 'preview.html'), galleryHTML);

console.log('\n✅ 10个占位图 + 预览页面 全部生成完毕！');
console.log('📂 位置: img/ 文件夹');
console.log('👀 打开 img/preview.html 查看所有模板');
console.log('\n⚠️ 用真实照片替换 img/ 中的 SVG 文件即可。');
