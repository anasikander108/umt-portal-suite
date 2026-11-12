// UMT Portal Suite - autofill.js (Auto Captcha)  v5.0
// Made by: DeyKode
// Fills: Student ID + Password + CAPTCHA on the portal SIGN-IN page only.

(function () {
  'use strict';

  // The popup can inject this file again; never register the listeners twice.
  if (window.__umtAutofillLoaded) return;
  window.__umtAutofillLoaded = true;

  const PORTAL_ORIGIN = 'online.umt.edu.pk';
  const CAPTCHA_PATTERN = /^[a-zA-Z0-9]{3,10}$/;
  const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  function log(msg) { console.log('[UMT Auto Captcha] ' + msg); }

  function isPortalPage() {
    return window.location.hostname === PORTAL_ORIGIN;
  }

  // The sign-in form is the only place credentials should ever be filled.
  // Other portal pages (Change Password, search boxes, ...) must be left alone.
  function isLoginPage() {
    return !!document.getElementById('loginform');
  }

  // ─── Fill input (works with React/Angular/plain JS) ──────────────────────────
  function fillInput(el, value) {
    if (!el) return false;
    el.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    return true;
  }

  // ─── Find Student ID input ───────────────────────────────────────────────────
  function findIdInput() {
    const selectors = [
      'input[name="UserName"]',
      'input[name="username"]',
      'input[name="StudentId"]',
      'input[name="studentId"]',
      'input[name="Email"]',
      'input[name="email"]',
      'input[id="UserName"]',
      'input[id="username"]',
      'input[id="student_id"]',
      'input[placeholder*="Student ID" i]',
      'input[placeholder*="Email" i]',
      'input[placeholder*="User" i]',
      'input[type="email"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) { log(`ID field: ${sel}`); return el; }
    }
    // Fallback: first text input
    return document.querySelector('input[type="text"]');
  }

  // ─── Find Password input ─────────────────────────────────────────────────────
  // The redesign's show/hide button can turn the field into type="text",
  // so the name/id selectors matter as much as type="password".
  function findPasswordInput() {
    const el = document.querySelector(
      'input[type="password"], input[name="Password"], input[name="password"], input[id="Password"], input[id="password"]'
    );
    if (el) { log('Password field found'); return el; }
    return null;
  }

  // ─── Find CAPTCHA text on page ───────────────────────────────────────────────
  // textContent is read first on purpose: innerText follows CSS text-transform,
  // which would change the case of a case-sensitive captcha.
  function findCaptchaText() {
    const explicitSelectors = [
      '[id*="captcha" i]',
      '[class*="captcha" i]',
      '[id*="CaptchaCode" i]',
      '[id*="verif" i]',
      '.captcha', '#captcha', '#CaptchaCode',
    ];
    for (const sel of explicitSelectors) {
      try {
        const el = document.querySelector(sel);
        if (el && el.tagName !== 'INPUT') {
          const t = (el.textContent || el.innerText || '').trim();
          if (t && CAPTCHA_PATTERN.test(t)) { log(`Captcha via "${sel}": ${t}`); return t; }
        }
      } catch (_) {}
    }

    // Scan all short-text visible elements
    const tags = document.querySelectorAll('div,span,td,p,label,strong,b,em,li,h1,h2,h3,h4,h5,h6');
    const candidates = [];

    for (const el of tags) {
      if (['INPUT','TEXTAREA','SELECT','SCRIPT','STYLE','A','BUTTON'].includes(el.tagName)) continue;
      const directText = getDirectText(el);
      if (!directText || !CAPTCHA_PATTERN.test(directText)) continue;

      let score = 0;
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize) || 14;
      const id  = (el.id || '').toLowerCase();
      const cls = (el.className || '').toString().toLowerCase();

      if (id.includes('captcha') || cls.includes('captcha')) score += 100;
      if (id.includes('code')    || cls.includes('code'))    score += 50;
      if (fontSize >= 18) score += 30;
      if (fontSize >= 14) score += 10;
      if (/[0-9]/.test(directText)) score += 10;
      if (/[a-z]/.test(directText) && /[A-Z]/.test(directText)) score += 10;

      candidates.push({ text: directText, score });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      log(`Captcha text: "${candidates[0].text}" (score ${candidates[0].score})`);
      return candidates[0].text;
    }
    return null;
  }

  function getDirectText(el) {
    let t = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) t += node.textContent;
    }
    return t.trim();
  }

  // ─── Find CAPTCHA input field ────────────────────────────────────────────────
  function findCaptchaInput() {
    const selectors = [
      'input[placeholder="Code"]',
      'input[name="CaptchaInputText"]',
      'input[name="captchaCode"]',
      'input[name="CaptchaCode"]',
      'input[id="CaptchaInputText"]',
      'input[id="captchaCode"]',
      'input[id="SecurityCode"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) { log(`Captcha input: ${sel}`); return el; }
    }
    // Broader scan
    const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
    for (const inp of allInputs) {
      const ph   = (inp.placeholder || '').toLowerCase();
      const name = (inp.name || '').toLowerCase();
      const id   = (inp.id || '').toLowerCase();
      if (ph.includes('code') || ph.includes('captcha') ||
          name.includes('code') || name.includes('captcha') ||
          id.includes('code') || id.includes('captcha')) {
        log(`Captcha input (broad): ${inp.name || inp.id}`);
        return inp;
      }
    }
    // Last resort: last text input
    const inputs = Array.from(document.querySelectorAll('input[type="text"],input:not([type])'));
    const filtered = inputs.filter(i => {
      const n = (i.name || '').toLowerCase();
      return !n.includes('user') && !n.includes('email') && !n.includes('pass');
    });
    return filtered.length > 0 ? filtered[filtered.length - 1] : null;
  }

  // ─── Status toast (glass, bottom centre so it never covers the chatbot button) ─
  function showBadge(message, type) {
    let badge = document.getElementById('_umt_badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = '_umt_badge';
      badge.setAttribute('role', 'status');
      Object.assign(badge.style, {
        position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
        zIndex: '2147483647', display: 'flex', alignItems: 'center', gap: '10px',
        maxWidth: 'min(440px, calc(100vw - 32px))', padding: '11px 16px',
        borderRadius: '18px', fontFamily: FONT, fontSize: '13px', lineHeight: '1.35',
        color: '#1d1d1f', background: 'rgba(255,255,255,0.84)',
        backdropFilter: 'blur(24px) saturate(180%)',
        webkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
        transition: 'opacity 0.3s ease',
      });
      document.body.appendChild(badge);
    }
    const accent = type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#0071e3';
    const dot = document.createElement('span');
    Object.assign(dot.style, { width: '8px', height: '8px', borderRadius: '50%', background: accent, flexShrink: '0' });
    const text = document.createElement('span');
    text.textContent = message;
    badge.replaceChildren(dot, text);
    badge.style.opacity = '1';
    clearTimeout(badge._hide);
    badge._hide = setTimeout(() => {
      badge.style.opacity = '0';
      setTimeout(() => badge.remove(), 300);
    }, 4000);
  }

  // ─── MAIN: fill everything ────────────────────────────────────────────────────
  function fillAll(studentId, password) {
    const filled = [];

    // 1. Student ID
    if (studentId) {
      const idEl = findIdInput();
      if (idEl && fillInput(idEl, studentId)) filled.push('Student ID');
    }

    // 2. Password
    if (password) {
      const passEl = findPasswordInput();
      if (passEl && fillInput(passEl, password)) filled.push('Password');
    }

    // 3. Captcha
    const captchaText = findCaptchaText();
    if (captchaText) {
      const captchaInput = findCaptchaInput();
      if (captchaInput && fillInput(captchaInput, captchaText)) filled.push(`Captcha "${captchaText}"`);
    }

    if (filled.length > 0) {
      const msg = 'Auto-filled: ' + filled.join(', ');
      showBadge(msg, 'success');
      log(msg);
      return { success: true, message: msg };
    }
    showBadge('Could not find form fields on this page.', 'error');
    return { success: false, message: 'Could not find form fields.' };
  }

  // ─── Listen for popup messages ────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== 'fillAll' && request.action !== 'solveCaptcha') return;

    if (!isPortalPage()) {
      sendResponse({ success: false, message: 'Not on the student portal. Auto-fill skipped.' });
      return;
    }
    if (!isLoginPage()) {
      sendResponse({ success: false, message: 'Saved. Credentials will fill on the next sign-in page.' });
      return;
    }

    if (request.action === 'fillAll') {
      sendResponse(fillAll(request.studentId, request.password));
      return;
    }

    // solveCaptcha: captcha only (manual trigger, no saved credentials)
    const captchaText = findCaptchaText();
    if (!captchaText) {
      sendResponse({ success: false, message: 'Captcha not found.' });
      return;
    }
    const captchaInput = findCaptchaInput();
    if (captchaInput && fillInput(captchaInput, captchaText)) {
      showBadge(`Captcha filled: "${captchaText}"`, 'success');
      sendResponse({ success: true, message: `Filled: "${captchaText}"` });
    } else {
      sendResponse({ success: false, message: 'Captcha input not found.' });
    }
  });

  // ─── Auto-fill on page load (sign-in page only) ───────────────────────────────
  function autoFillOnLoad() {
    if (!isPortalPage() || !isLoginPage()) return;

    chrome.storage.local.get(['umtId', 'umtPass', 'autoSolve'], (data) => {
      if (data.autoSolve === false) return;

      const doFill = () => fillAll(data.umtId || null, data.umtPass || null);

      if (document.readyState === 'complete') {
        setTimeout(doFill, 900);
      } else {
        window.addEventListener('load', () => setTimeout(doFill, 900));
      }
    });
  }

  autoFillOnLoad();
  log('Loaded on: ' + window.location.href);
})();
