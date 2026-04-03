/**
 * responsive.js — Library University shared mobile helpers
 * Tự inject hamburger button, mobile drawer, và panel overlay
 */
(function() {
  'use strict';

  /* ─── 1. INJECT MOBILE DRAWER vào mọi trang có .header ─── */
  function initMobileNav() {
    const header = document.querySelector('.header-inner');
    if (!header) return;

    // Lấy nav links hiện tại để clone vào drawer
    const navLinks = document.querySelector('.nav-links');
    const navHTML = navLinks ? navLinks.innerHTML : '';

    // Lấy username từ sessionStorage
    const username = sessionStorage.getItem('username') || 'Admin';
    const initials = username.slice(0, 2).toUpperCase();

    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.id = 'mobileNavOverlay';
    document.body.appendChild(overlay);

    // Tạo drawer
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobileDrawer';
    drawer.innerHTML = `
      <div class="mobile-drawer-head">
        <div class="mobile-drawer-brand">
          <div class="brand-name">LIBRARY UNIVERSITY</div>
          <div class="brand-sub">Hệ thống quản lý thư viện</div>
        </div>
        <button class="mobile-drawer-close" id="drawerClose">✕</button>
      </div>
      <nav id="drawerNav">
        <a href="taikhoan.html">👤 Quản lý tài khoản</a>
        <a href="quanlysach.html">📚 Quản lý sách</a>
        <a href="muonsach.html">📖 Quản lý mượn sách</a>
        <a href="trasach.html">↩ Quản lý trả sách</a>
        <a href="baocao.html">📊 Báo cáo thống kê</a>
      </nav>
      <div class="mobile-drawer-user">
        <a href="index.html" onclick="sessionStorage.clear()">
          🚪 Đăng xuất (${username})
        </a>
      </div>
    `;
    document.body.appendChild(drawer);

    // Mark active link in drawer
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    drawer.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === currentPage) a.classList.add('active');
    });

    // Tạo hamburger button
    const hamBtn = document.createElement('button');
    hamBtn.className = 'hamburger';
    hamBtn.id = 'hamburgerBtn';
    hamBtn.setAttribute('aria-label', 'Mở menu');
    hamBtn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(hamBtn);

    // Toggle functions
    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('show');
      hamBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      hamBtn.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    document.getElementById('drawerClose').addEventListener('click', closeDrawer);

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeDrawer();
    });
  }

  /* ─── 2. TABLE SCROLL WRAPPER ─────────────────────────── */
  function wrapTables() {
    document.querySelectorAll('.card table, .table-card table').forEach(tbl => {
      const parent = tbl.parentElement;
      if (parent.classList.contains('table-scroll-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll-wrap';
      parent.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    });
  }

  /* ─── 3. SIDE PANEL OVERLAY (quanlysach) ──────────────── */
  function initPanelOverlay() {
    const panel = document.getElementById('sidePanel');
    if (!panel) return;

    // Create overlay
    const pOverlay = document.createElement('div');
    pOverlay.className = 'panel-overlay';
    pOverlay.id = 'panelOverlay';
    document.body.appendChild(pOverlay);

    // Observe panel open/close
    const observer = new MutationObserver(() => {
      if (panel.classList.contains('open')) {
        pOverlay.classList.add('show');
        if (window.innerWidth <= 900) document.body.style.overflow = 'hidden';
      } else {
        pOverlay.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] });

    // Close panel on overlay tap
    pOverlay.addEventListener('click', () => {
      panel.classList.remove('open');
    });
  }

  /* ─── 4. FIX modal scroll on iOS ──────────────────────── */
  function fixModalScroll() {
    document.querySelectorAll('.overlay').forEach(ov => {
      ov.addEventListener('touchmove', e => {
        if (e.target === ov) e.preventDefault();
      }, { passive: false });
    });
  }

  /* ─── 5. PREVENT double-tap zoom on buttons ───────────── */
  function preventDoubleTapZoom() {
    let lastTap = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300 && e.target.tagName === 'BUTTON') {
        e.preventDefault();
      }
      lastTap = now;
    }, { passive: false });
  }

  /* ─── RUN ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    initMobileNav();
    wrapTables();
    initPanelOverlay();
    fixModalScroll();
    preventDoubleTapZoom();
  }
})();
