/* ============================================================
   个人作品集官网 - main.js
   纯原生 JavaScript，负责全部交互逻辑：
   1. 导航锚点平滑滚动
   2. 导航跟随滚动自动高亮当前区块
   3. 页面滚动渐入（IntersectionObserver）
   4. 图片懒加载
   5. 深浅色主题切换（localStorage 记忆选择）
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. 导航锚点平滑滚动 ---------- */
  const navLinks = document.querySelectorAll('.nav-link');

  function smoothScroll(target) {
    const el = document.querySelector(target);
    if (!el) return;
    // 桌面端主内容区在侧边栏右侧，滚动的是整个页面
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScroll(href);
      }
    });
  });

  /* ---------- 2. 导航跟随滚动自动高亮当前区块 ---------- */
  const sections = document.querySelectorAll('main section[id]');

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  // 使用 IntersectionObserver 监控区块进入视口比例
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, threshold: 0.4 }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  } else {
    // 降级：基于滚动位置的简单高亮
    window.addEventListener('scroll', () => {
      let current = 'home';
      const pos = window.scrollY + window.innerHeight * 0.4;
      sections.forEach((sec) => {
        if (pos >= sec.offsetTop) current = sec.id;
      });
      setActive(current);
    }, { passive: true });
  }

  /* ---------- 3. 页面滚动渐入 ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 渐入一次后停止观察，避免重复触发
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // 不支持时直接全部显示
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. 图片懒加载（<img loading="lazy"> 的补充） ---------- */
  // 原生 loading="lazy" 已在 HTML 中声明，此处仅做降级兼容
  if (!('loading' in HTMLImageElement.prototype)) {
    const imgs = document.querySelectorAll('img[data-src]');
    imgs.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  /* ---------- 5. 深浅色主题切换（localStorage 记忆选择） ---------- */
  const THEME_KEY = 'portfolio-theme';
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-label', isDark ? '切换到浅色主题' : '切换到深色主题');
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      /* 隐私模式等场景下写入失败时忽略，仅本次生效 */
    }
  }

  // 初始化：优先读取用户上一次的选择，无记录时默认浅色
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (err) {
    /* 读取失败时按默认浅色处理 */
  }
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  themeToggle.addEventListener('click', toggleTheme);
})();