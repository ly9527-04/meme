/* ═══════════════════════════════════════════════════════
   表情包工坊 — 多图层 Canvas 引擎
   ═══════════════════════════════════════════════════════ */

// ── 全局状态 ──────────────────────────────────────────
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 525;

let currentTemplate = null;
let customImage = null;
const templateImages = {}; // 预加载的模板图片缓存

// 文字层: { id, text, x, y, size, color, stroke, rotation, bold, fontSize }
let textLayers = [];
let selectedLayerId = null;
let draggedLayerId = null;
let dragStart = { x: 0, y: 0 };

// ── 模板库 ────────────────────────────────────────────
const templates = [
  // 经典
  { name: '思考熊猫',  bg: '#1a1a2e', emoji: '🐼', cat: '经典' },
  { name: '震惊猫',    bg: '#4a0e4e', emoji: '😱', cat: '经典' },
  { name: '狗头',      bg: '#3d2b1f', emoji: '🐶', cat: '经典' },
  { name: '哭泣',      bg: '#1a3a5c', emoji: '😭', cat: '经典' },
  { name: '得意',      bg: '#1e3d1e', emoji: '😏', cat: '经典' },
  { name: '愤怒红',    bg: '#5c1a1a', emoji: '😠', cat: '经典' },
  // 动物
  { name: '猫',        bg: '#f4a460', emoji: '🐱', cat: '动物' },
  { name: '兔',        bg: '#ffb6c1', emoji: '🐰', cat: '动物' },
  { name: '蛙',        bg: '#90ee90', emoji: '🐸', cat: '动物' },
  { name: '狐狸',      bg: '#ff8c00', emoji: '🦊', cat: '动物' },
  // 手势
  { name: '点赞',      bg: '#4169e1', emoji: '👍', cat: '手势' },
  { name: 'OK',        bg: '#ffd700', emoji: '👌', cat: '手势' },
  { name: '拳头',      bg: '#8b0000', emoji: '👊', cat: '手势' },
  { name: '合十',      bg: '#dda0dd', emoji: '🙏', cat: '手势' },
  // 搞笑
  { name: '笑哭',      bg: '#ff6347', emoji: '😂', cat: '搞笑' },
  { name: '斜眼',      bg: '#9370db', emoji: '😒', cat: '搞笑' },
  { name: '翻白眼',    bg: '#20b2aa', emoji: '🙄', cat: '搞笑' },
  { name: '捂脸',      bg: '#cd853f', emoji: '🤦', cat: '搞笑' },
  // 暗黑
  { name: '骷髅',      bg: '#000000', emoji: '💀', cat: '暗黑' },
  { name: '小丑',      bg: '#2f1b3d', emoji: '🤡', cat: '暗黑' },
  { name: '幽灵',      bg: '#1a1a3a', emoji: '👻', cat: '暗黑' },
  { name: '恶魔',      bg: '#4a0a0a', emoji: '👿', cat: '暗黑' },
  // 🔥 2026热门人物（图片模板）
  { name: '背手负鼠',  bg: '#6b5b4f', emoji: '🐭', cat: '🔥热门', img: 'img/fushu.svg' },
  { name: '哈兰德',    bg: '#3a7cc3', emoji: '⚽', cat: '🔥热门', img: 'img/haland.svg' },
  { name: '嘎子',      bg: '#c0392b', emoji: '🥤', cat: '🔥热门', img: 'img/gazi.svg' },
  { name: '黄银勋',    bg: '#2c3e50', emoji: '💼', cat: '🔥热门', img: 'img/huangyx.svg' },
  { name: '小马云',    bg: '#8b6914', emoji: '✒️', cat: '🔥热门', img: 'img/xiaomayun.svg' },
  { name: '鹿哈',      bg: '#8e44ad', emoji: '🎤', cat: '🔥热门', img: 'img/luha.svg' },
  { name: '汤姆猫',    bg: '#5d8aa8', emoji: '🐱', cat: '🔥热门', img: 'img/tomcat.svg' },
  { name: '负鼠淡定',  bg: '#8f9779', emoji: '🐭', cat: '🔥热门', img: 'img/fushu2.svg' },
  { name: '嘎子玉米',  bg: '#d35400', emoji: '🌽', cat: '🔥热门', img: 'img/gazi2.svg' },
  { name: '魔人布欧',  bg: '#e91e90', emoji: '👹', cat: '🔥热门', img: 'img/haland2.svg' },
];

const categories = ['全部', '🔥热门', '经典', '动物', '手势', '搞笑', '暗黑'];
let activeCategory = '全部';

// ── 初始化模板侧边栏 ─────────────────────────────────
function buildCategoryTabs() {
  const container = document.getElementById('categoryTabs');
  container.innerHTML = categories.map(c =>
    `<button class="cat-tab${c === activeCategory ? ' active' : ''}" onclick="setCategory('${c}')">${c}</button>`
  ).join('');
}

function setCategory(cat) {
  activeCategory = cat;
  buildCategoryTabs();
  filterTemplates();
}

function filterTemplates() {
  const search = document.getElementById('searchTpl').value.toLowerCase();
  const grid = document.getElementById('templateGrid');
  const filtered = templates.filter(t =>
    (activeCategory === '全部' || t.cat === activeCategory) &&
    (!search || t.name.includes(search) || t.cat.includes(search))
  );

  grid.innerHTML = filtered.map((tpl, i) => {
    const idx = templates.indexOf(tpl);
    return `
      <div class="template-item${currentTemplate === tpl ? ' selected' : ''}"
           style="background:${tpl.bg}"
           onclick="selectTemplate(${idx})">
        <span>${tpl.emoji}</span>
        <span class="tpl-label">${tpl.name}</span>
      </div>`;
  }).join('');
}

function selectTemplate(index) {
  currentTemplate = templates[index];
  customImage = null;
  document.getElementById('imageUpload').value = '';
  refreshTemplateSelection();
  renderMeme();
}

function refreshTemplateSelection() {
  document.querySelectorAll('.template-item').forEach(el => el.classList.remove('selected'));
  if (currentTemplate) {
    const idx = templates.indexOf(currentTemplate);
    const items = document.querySelectorAll('.template-item');
    if (items[idx]) items[idx].classList.add('selected');
  }
}

// ── 侧边栏开关 ───────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('hidden');
}

// ── 文字层管理 ───────────────────────────────────────
function addTextLayer(text = '双击编辑文字') {
  const layer = {
    id: Date.now(),
    text,
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 48,
    color: '#ffffff',
    stroke: '#000000',
    rotation: 0,
    bold: true,
  };
  textLayers.push(layer);
  selectedLayerId = layer.id;
  refreshLayersList();
  refreshLayerProps();
  renderMeme();
}

function selectLayer(id) {
  selectedLayerId = id;
  refreshLayersList();
  refreshLayerProps();
}

function deleteSelectedLayer() {
  textLayers = textLayers.filter(l => l.id !== selectedLayerId);
  selectedLayerId = textLayers.length > 0 ? textLayers[textLayers.length - 1].id : null;
  refreshLayersList();
  refreshLayerProps();
  renderMeme();
}

function refreshLayersList() {
  const container = document.getElementById('layersList');
  container.innerHTML = textLayers.map(l =>
    `<div class="layer-chip${l.id === selectedLayerId ? ' active' : ''}"
          onclick="selectLayer(${l.id})">${l.text.slice(0, 8)}</div>`
  ).join('');
}

function refreshLayerProps() {
  const panel = document.getElementById('layerProps');
  const layer = textLayers.find(l => l.id === selectedLayerId);

  if (!layer) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'block';
  document.getElementById('propText').value = layer.text;
  document.getElementById('propSize').value = layer.size;
  document.getElementById('sizeVal').textContent = layer.size + 'px';
  document.getElementById('propColor').value = layer.color;
  document.getElementById('propStroke').value = layer.stroke;
  document.getElementById('propRotation').value = layer.rotation;
  document.getElementById('rotVal').textContent = layer.rotation + '°';
  document.getElementById('propBold').checked = layer.bold;
}

function updateSelectedLayer() {
  const layer = textLayers.find(l => l.id === selectedLayerId);
  if (!layer) return;

  layer.text = document.getElementById('propText').value;
  layer.size = parseInt(document.getElementById('propSize').value);
  layer.color = document.getElementById('propColor').value;
  layer.stroke = document.getElementById('propStroke').value;
  layer.rotation = parseInt(document.getElementById('propRotation').value);
  layer.bold = document.getElementById('propBold').checked;

  document.getElementById('sizeVal').textContent = layer.size + 'px';
  document.getElementById('rotVal').textContent = layer.rotation + '°';
  refreshLayersList();
  renderMeme();
}

// ── Canvas 渲染 ───────────────────────────────────────
function renderMeme() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 画底图
  if (customImage) {
    const scale = Math.max(w / customImage.width, h / customImage.height);
    const sw = customImage.width * scale;
    const sh = customImage.height * scale;
    ctx.drawImage(customImage, (w - sw) / 2, (h - sh) / 2, sw, sh);
  } else if (currentTemplate) {
    // 🔥 如果有图片模板，用图片作底
    if (currentTemplate.img && templateImages[currentTemplate.img]) {
      const tplImg = templateImages[currentTemplate.img];
      const scale = Math.max(w / tplImg.width, h / tplImg.height);
      const sw = tplImg.width * scale;
      const sh = tplImg.height * scale;
      ctx.drawImage(tplImg, (w - sw) / 2, (h - sh) / 2, sw, sh);

      // 暗角让文字更显眼
      const vignette = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.85);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    } else {
      // 纯色背景 + emoji
      ctx.fillStyle = currentTemplate.bg;
      ctx.fillRect(0, 0, w, h);

      const glowGrad = ctx.createRadialGradient(w/2, h/2, h*0.1, w/2, h/2, h*0.7);
      glowGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      glowGrad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      const vignette = ctx.createRadialGradient(w/2, h/2, h*0.35, w/2, h/2, h*0.85);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;
      ctx.font = '220px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentTemplate.emoji, w / 2, h / 2 - 10);
      ctx.restore();
    }
  } else {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);
  }

  // 画所有文字层
  for (const layer of textLayers) {
    drawTextLayer(layer);
  }
}

function drawTextLayer(layer) {
  ctx.save();

  const x = layer.x;
  const y = layer.y;
  const fontWeight = layer.bold ? '900' : '500';
  const fontSize = layer.size;

  // 移动到图层位置 + 旋转
  ctx.translate(x, y);
  ctx.rotate((layer.rotation * Math.PI) / 180);

  const lines = layer.text.split('\n');
  const lineHeight = fontSize * 1.3;

  // 提前计算总高度用于垂直居中
  const totalH = lines.length * lineHeight;

  ctx.font = `${fontWeight} ${fontSize}px "PingFang SC", "Microsoft YaHei", "Impact", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const strokeW = fontSize * 0.14;

  for (let i = 0; i < lines.length; i++) {
    const ly = (i - (lines.length - 1) / 2) * lineHeight;

    if (layer.stroke && layer.stroke !== 'transparent') {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = layer.stroke;
      ctx.lineJoin = 'round';
      ctx.strokeText(lines[i], 0, ly);
    }

    ctx.fillStyle = layer.color;
    ctx.fillText(lines[i], 0, ly);
  }

  ctx.restore();
}

// ── 拖拽文字层 ────────────────────────────────────────
canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  // 从最上层开始检查
  for (let i = textLayers.length - 1; i >= 0; i--) {
    const l = textLayers[i];
    const ctxTemp = document.createElement('canvas').getContext('2d');
    ctxTemp.font = `${l.bold ? '900' : '500'} ${l.size}px "PingFang SC", sans-serif`;
    const tw = ctxTemp.measureText(l.text).width;
    const th = l.size * 1.3;

    // 检查点击是否在文字范围内
    const dx = mx - l.x;
    const dy = my - l.y;
    // 考虑旋转的包围盒
    const dist = Math.sqrt(dx * dx + dy * dy);
    const halfW = tw / 2 + l.size * 0.3;
    const halfH = th / 2 + l.size * 0.2;

    if (Math.abs(dx) < halfW && Math.abs(dy) < halfH) {
      draggedLayerId = l.id;
      selectedLayerId = l.id;
      dragStart = { x: mx - l.x, y: my - l.y };
      refreshLayersList();
      refreshLayerProps();
      canvas.style.cursor = 'grabbing';
      return;
    }
  }
  // 没点到文字 → 取消选择
  selectedLayerId = null;
  refreshLayersList();
  refreshLayerProps();
});

canvas.addEventListener('mousemove', function(e) {
  if (!draggedLayerId) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  const layer = textLayers.find(l => l.id === draggedLayerId);
  if (layer) {
    layer.x = mx - dragStart.x;
    layer.y = my - dragStart.y;
    renderMeme();
  }
});

canvas.addEventListener('mouseup', function() {
  draggedLayerId = null;
  canvas.style.cursor = 'default';
});

// 双击添加文字
canvas.addEventListener('dblclick', function(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  addTextLayer('双击编辑');
  const layer = textLayers[textLayers.length - 1];
  layer.x = mx;
  layer.y = my;
  renderMeme();
});

// 触屏拖拽
canvas.addEventListener('touchstart', function(e) {
  if (e.touches.length === 1) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.touches[0].clientX - rect.left) * scaleX;
    const my = (e.touches[0].clientY - rect.top) * scaleY;

    for (let i = textLayers.length - 1; i >= 0; i--) {
      const l = textLayers[i];
      const dx = mx - l.x, dy = my - l.y;
      if (Math.abs(dx) < l.size * 3 && Math.abs(dy) < l.size * 1.5) {
        draggedLayerId = l.id;
        selectedLayerId = l.id;
        dragStart = { x: mx - l.x, y: my - l.y };
        refreshLayersList(); refreshLayerProps();
        return;
      }
    }
  }
}, { passive: true });

canvas.addEventListener('touchmove', function(e) {
  if (!draggedLayerId || !e.touches[0]) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.touches[0].clientX - rect.left) * scaleX;
  const my = (e.touches[0].clientY - rect.top) * scaleY;
  const layer = textLayers.find(l => l.id === draggedLayerId);
  if (layer) { layer.x = mx - dragStart.x; layer.y = my - dragStart.y; renderMeme(); }
}, { passive: false });

canvas.addEventListener('touchend', () => { draggedLayerId = null; });

// ── 自定义图片 ────────────────────────────────────────
document.getElementById('imageUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      customImage = img;
      currentTemplate = null;
      refreshTemplateSelection();
      renderMeme();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// ── 下载 ────────────────────────────────────────────────
function downloadMeme() {
  const link = document.createElement('a');
  link.download = 'meme-' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── 重置 ────────────────────────────────────────────────
function resetAll() {
  textLayers = [];
  selectedLayerId = null;
  customImage = null;
  currentTemplate = templates[0];
  document.getElementById('imageUpload').value = '';
  refreshLayersList();
  refreshLayerProps();
  refreshTemplateSelection();
  renderMeme();
}

// ── 键盘快捷键 ────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedLayerId && document.activeElement === document.body) {
      deleteSelectedLayer();
    }
  }
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    downloadMeme();
  }
});

// ── 预加载模板图片 ────────────────────────────────────
function preloadTemplateImages() {
  templates.forEach(tpl => {
    if (tpl.img && !templateImages[tpl.img]) {
      const img = new Image();
      img.onload = () => { templateImages[tpl.img] = img; renderMeme(); };
      img.onerror = () => console.warn('模板图片加载失败:', tpl.img);
      img.src = tpl.img;
    }
  });
}

// ── 启动 ────────────────────────────────────────────────
preloadTemplateImages();
buildCategoryTabs();
filterTemplates();
selectTemplate(0);
addTextLayer('上方文字');
textLayers[0].y = canvas.height * 0.2;
textLayers[0].size = 56;
addTextLayer('下方文字');
textLayers[1].y = canvas.height * 0.82;
textLayers[1].size = 56;
renderMeme();
refreshLayersList();
