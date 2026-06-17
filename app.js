/* ═══════════════════════════════════════════════════════
   表情包生成器 - Canvas 引擎
   ═══════════════════════════════════════════════════════ */

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// ── 模板库 ─────────────────────────────────────────────
const templates = [
  { name: '经典熊猫', bg: '#2d3436', emoji: '🐼', fg: '#fff' },
  { name: '震惊猫',   bg: '#6c5ce7', emoji: '😱', fg: '#fff' },
  { name: '狗狗',     bg: '#fd79a8', emoji: '🐶', fg: '#fff' },
  { name: '哭泣',     bg: '#0984e3', emoji: '😭', fg: '#fff' },
  { name: '傲慢',     bg: '#00b894', emoji: '😏', fg: '#fff' },
  { name: '愤怒',     bg: '#d63031', emoji: '😠', fg: '#fff' },
  { name: '疑问',     bg: '#e17055', emoji: '🤔', fg: '#fff' },
  { name: '开心',     bg: '#fdcb6e', emoji: '😄', fg: '#2d3436' },
  { name: '酷',       bg: '#636e72', emoji: '😎', fg: '#fff' },
];

let currentTemplate = templates[0];
let customImage = null;

// ── 初始化模板选择器 ──────────────────────────────────
function initTemplates() {
  const grid = document.getElementById('templateGrid');
  templates.forEach((tpl, i) => {
    const div = document.createElement('div');
    div.className = 'template-item' + (i === 0 ? ' selected' : '');
    div.style.background = tpl.bg;
    div.innerHTML = `<span style="font-size:2.5rem;">${tpl.emoji}</span><span class="tpl-name">${tpl.name}</span>`;
    div.onclick = () => selectTemplate(i, div);
    grid.appendChild(div);
  });
}

function selectTemplate(index, el) {
  currentTemplate = templates[index];
  customImage = null;
  document.querySelectorAll('.template-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('imageUpload').value = '';
  renderMeme();
}

// ── 上传图片 ───────────────────────────────────────────
document.getElementById('imageUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      customImage = img;
      document.querySelectorAll('.template-item').forEach(d => d.classList.remove('selected'));
      renderMeme();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// ── Canvas 渲染 ────────────────────────────────────────
function renderMeme() {
  const w = canvas.width;
  const h = canvas.height;

  // 清空
  ctx.clearRect(0, 0, w, h);

  if (customImage) {
    // 用户自定义图片：填充
    const scale = Math.max(w / customImage.width, h / customImage.height);
    const sw = customImage.width * scale;
    const sh = customImage.height * scale;
    const sx = (w - sw) / 2;
    const sy = (h - sh) / 2;
    ctx.drawImage(customImage, sx, sy, sw, sh);
  } else {
    // 模板：纯色背景 + emoji
    ctx.fillStyle = currentTemplate.bg;
    ctx.fillRect(0, 0, w, h);

    // 画一些装饰元素
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.arc(x, y, 40 + Math.random() * 60, 0, Math.PI * 2);
      ctx.fill();
    }

    // 大 emoji
    ctx.font = '120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentTemplate.emoji, w / 2, h / 2);
  }

  // 文字
  const topText = document.getElementById('topText').value.trim().toUpperCase();
  const bottomText = document.getElementById('bottomText').value.trim().toUpperCase();

  if (topText) drawMemeText(topText, h * 0.15);
  if (bottomText) drawMemeText(bottomText, h * 0.88);
}

// ── 经典表情包字体效果 ────────────────────────────────
function drawMemeText(text, y) {
  const w = canvas.width;

  // 自适应字号
  let fontSize = 56;
  ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", "Impact", sans-serif`;
  while (ctx.measureText(text).width > w - 40 && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", "Impact", sans-serif`;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 黑色描边
  ctx.lineWidth = fontSize * 0.16;
  ctx.strokeStyle = '#000';
  ctx.lineJoin = 'round';
  ctx.strokeText(text, w / 2, y);

  // 白色填充
  ctx.fillStyle = '#fff';
  ctx.fillText(text, w / 2, y);
}

// ── 下载 ────────────────────────────────────────────────
function downloadMeme() {
  const link = document.createElement('a');
  link.download = 'meme-' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── 重置 ────────────────────────────────────────────────
function resetAll() {
  document.getElementById('topText').value = '';
  document.getElementById('bottomText').value = '';
  customImage = null;
  document.getElementById('imageUpload').value = '';
  renderMeme();
}

// ── 启动 ────────────────────────────────────────────────
initTemplates();
renderMeme();
