/* ============================================================
   个人作品集官网 - theme-init.js
   主题预初始化：在页面首次渲染前应用用户已保存的主题，
   避免刷新时出现「先浅后深」的闪烁。
   与 main.js 中的主题切换逻辑共用同一个 localStorage 键。
   ============================================================ */

(function () {
  'use strict';

  var THEME_KEY = 'portfolio-theme';

  try {
    if (localStorage.getItem(THEME_KEY) === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (err) {
    /* 隐私模式等场景下读取失败时忽略，保持默认浅色 */
  }
})();
