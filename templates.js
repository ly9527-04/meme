/* ═══════════════════════════════════════════════════════
   2026年热门梗图人物模板配置
   图片放 img/ 文件夹，命名对应 id
   ═══════════════════════════════════════════════════════ */

const hotTemplates = [
  {
    id: 'fushu',
    name: '背手负鼠',
    cat: '动物',
    emoji: '🐭',
    bg: '#6b5b4f',
    img: 'img/fushu.png',
    tags: ['2026顶流', '打工人', '窝囊优雅'],
  },
  {
    id: 'haland',
    name: '哈兰德·汤姆哈',
    cat: '明星',
    emoji: '⚽',
    bg: '#3a7cc3',
    img: 'img/haland.png',
    tags: ['曼城', '汤姆猫', '魔人布欧'],
  },
  {
    id: 'gazi',
    name: '嘎子·谢孟伟',
    cat: '网红',
    emoji: '🥤',
    bg: '#e74c3c',
    img: 'img/gazi.png',
    tags: ['我Chovy', '可乐', '抽象'],
  },
  {
    id: 'huangyx',
    name: '黄银勋',
    cat: '网红',
    emoji: '💼',
    bg: '#2c3e50',
    img: 'img/huangyx.png',
    tags: ['山寨黄仁勋', '皮衣', '豆汁'],
  },
  {
    id: 'xiaomayun',
    name: '小马云·范小勤',
    cat: '网红',
    emoji: '✒️',
    bg: '#8b4513',
    img: 'img/xiaomayun.png',
    tags: ['书法', '直播', '抽象'],
  },
  {
    id: 'luha',
    name: '鹿哈',
    cat: '网红',
    emoji: '🎤',
    bg: '#9b59b6',
    img: 'img/luha.png',
    tags: ['山寨', '315', '贡菜'],
  },
  {
    id: 'tomcat',
    name: '汤姆猫对比',
    cat: '经典',
    emoji: '🐱',
    bg: '#5d8aa8',
    img: 'img/tomcat.png',
    tags: ['猫和老鼠', '撞脸', '万能'],
  },
  {
    id: 'fushu2',
    name: '背手负鼠·淡定版',
    cat: '动物',
    emoji: '🐭',
    bg: '#8f9779',
    img: 'img/fushu2.png',
    tags: ['佛系', '从容', '淡定'],
  },
  {
    id: 'gazi2',
    name: '嘎子·玉米名场面',
    cat: '网红',
    emoji: '🌽',
    bg: '#e67e22',
    img: 'img/gazi2.png',
    tags: ['玉米', '哭泣', '抽象'],
  },
  {
    id: 'haland2',
    name: '哈兰德·魔人布欧',
    cat: '明星',
    emoji: '👹',
    bg: '#ff69b4',
    img: 'img/haland2.png',
    tags: ['龙珠', '布欧', '魔人'],
  },
];

// 导出供 app.js 使用
if (typeof module !== 'undefined') {
  module.exports = { hotTemplates };
}
