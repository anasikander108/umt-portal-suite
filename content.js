/**
 * UMT Portal Suite – content.js (portal redesign)  v5
 *
 * The extension is a SKIN, not a SPA: links navigate normally and the script
 * re-applies on every page load.
 *   • Login page   → glass card over the campus photo, real form untouched
 *   • Dashboard    → full Apple-style redesign built from extracted portal data
 *   • Other pages  → glass sidebar + header around the portal's own content
 */

(function () {
  'use strict';

  // ── Guard: don't inject twice ──────────────────────────────
  if (document.getElementById('umt-redesign-root')) return;

  // Merged extension: the popup can switch the redesign off (default: on).
  // Everything below runs inside start(), only when the switch allows it.
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ redesign: true }, (s) => {
      if (!s || s.redesign !== false) start();
    });
  } else {
    start();
  }

  function start() {

  // ═══════════════════════════════════════════════════════════
  // ICONS – inline SVG line icons (24×24 grid, currentColor stroke)
  // Declared first: the code below runs immediately and const is not hoisted.
  // ═══════════════════════════════════════════════════════════
  const ICONS = {
    dashboard:   '<rect x="3" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2"/>',
    user:        '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"/>',
    userCheck:   '<circle cx="9" cy="8" r="4"/><path d="M2 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/><path d="m16 11 2 2 4-4"/>',
    users:       '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.9.7 3 2.3 3 5.2"/>',
    star:        '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    instagram:   '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    book:        '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    bookOpen:    '<path d="M2 4.5h6a4 4 0 0 1 4 4V21a3 3 0 0 0-3-3H2z"/><path d="M22 4.5h-6a4 4 0 0 0-4 4V21a3 3 0 0 1 3-3h7z"/>',
    cap:         '<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/>',
    chat:        '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    message:     '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.7-.8L3 21l1.9-5.3A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
    doc:         '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    inbox:       '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',
    card:        '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h4"/>',
    map:         '<path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7z"/><path d="M9 4v13M15 7v13"/>',
    megaphone:   '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    bag:         '<path d="M6 2 3 6v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    calendar:    '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/>',
    clock:       '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight:'<path d="m9 6 6 6-6 6"/>',
    arrowUpRight:'<path d="M7 17 17 7M8 7h9v9"/>',
    sidebar:     '<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M9 4v16"/>',
    bell:        '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    expand:      '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    lock:        '<rect x="4" y="10.5" width="16" height="10.5" rx="3"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    logout:      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    pencil:      '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    monitor:     '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/>',
    clipboard:   '<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 4.5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5"/><path d="M9 11h6M9 15h4"/>',
    send:        '<path d="m22 2-11 11"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    search:      '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    shield:      '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
    globe:       '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    eye:         '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:      '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.7A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    drop:        '<path d="M12 2.5s7 8.2 7 12.8a7 7 0 0 1-14 0c0-4.6 7-12.8 7-12.8z"/>',
  };

  // Team page data. Replace each href with that member's own LinkedIn profile.
  const LINKEDIN_PLACEHOLDER = 'https://www.linkedin.com/in/anas-abdul-rehman-a04a532aa/';
  const LINKEDIN_AHMAD = 'https://www.linkedin.com/in/ahmad-bilal-177187317/';
  const LINKEDIN_ABDULLAH = 'https://www.linkedin.com/in/abdullah-undefined-54618340b?trk=contact-info';
  const TEAM = [
    { name: 'Anas Abdul Rehman', email: 'S2025266108@umt.edu.pk', href: LINKEDIN_PLACEHOLDER },
    { name: 'Ahmad Bilal',       email: 'S2025266121@umt.edu.pk', href: LINKEDIN_AHMAD },
    { name: 'Abdullah Tanveer',  email: 'S2025266120@umt.edu.pk', href: LINKEDIN_ABDULLAH },
  ];
  const TEAM_HASH = '#umt-team';

  function icon(name, extraClass) {
    return `<svg class="umt-i${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  }

  // UMT logo for the sidebar (assets/umt-logo.png, listed in web_accessible_resources)
  function brandMark() {
    const url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
      ? chrome.runtime.getURL('assets/umt-logo.png')
      : '';
    return `<img class="umt-mark" src="${url}" alt="UMT" width="48" height="48" draggable="false">`;
  }

  // ── Fix: dark overlay stuck on screen after closing Timetable / ───────────
  // Registered Courses on the home page (previously only a refresh cleared it)
  // The portal opens these as a native Bootstrap modal. Its own close button
  // sometimes fails to remove the ".modal-backdrop" it added (or to strip the
  // "modal-open" class off <body>), especially if it's closed a moment after
  // opening. Rather than trying to patch the portal's own script, this just
  // watches for that leftover state and clears it itself.
  patchStuckModalBackdrops();
  function patchStuckModalBackdrops() {
    function anyModalOpen() {
      return !!document.querySelector('.modal.show, .modal.in, .modal[style*="display: block"], .modal[style*="display:block"]');
    }
    function cleanup() {
      if (anyModalOpen()) return; // a real modal is still open — leave it alone
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }

    // Give the portal's own close handler a moment to run first, then check
    // whether it actually finished the job.
    const recheck = () => { setTimeout(cleanup, 350); setTimeout(cleanup, 900); };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest(
        '[data-dismiss="modal"], [data-bs-dismiss="modal"], .modal .close, .modal-header .close, .modal-backdrop'
      );
      if (trigger) recheck();
    }, true);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') recheck();
    });

    // Belt-and-suspenders: if a backdrop is ever left sitting with no modal
    // actually open (whatever the cause), remove it on the next DOM change.
    new MutationObserver(() => {
      if (!anyModalOpen() && document.querySelector('.modal-backdrop')) cleanup();
    }).observe(document.body, { childList: true });
  }

  // ── Determine current page type ───────────────────────────
  const path = window.location.pathname.toLowerCase();

  // The sign-in page is also served at "/", so the path alone can't decide.
  // Detect the login page by the presence of the actual login form.
  const isLoginPage = !!document.getElementById('loginform');
  const isDashboard = !isLoginPage &&
    (path === '/' || path === '/home' || path === '/home/index' || path === '/home/');

  // ── Campus image URL via extension ───────────────────────
  const campusImgUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
    ? chrome.runtime.getURL('assets/campus.png')
    : '';

  // ── LOGIN PAGE: standalone reskin, no sidebar/header ──────
  if (isLoginPage) {
    injectLoginPage(campusImgUrl);
    return; // nothing else on this page should run
  }

  // ── Extract portal data ───────────────────────────────────
  const portalData = extractPortalData();

  // If the redesign ever throws, fall back to the original portal instead of a
  // blank page (the original layout is hidden before the redesign is built).
  function safeInject() {
    try {
      if (isDashboard) injectDashboard(portalData, campusImgUrl);
      else injectSkinOnly(portalData);
      return true;
    } catch (e) {
      console.error('[UMT Redesign] Failed, showing original portal:', e);
      const r = document.getElementById('umt-redesign-root');
      if (r) r.remove();
      document.body.classList.remove('umt-redesigned', 'umt-skinned');
      return false;
    }
  }

  const injected = safeInject();

  // ── MutationObserver: safety net ─────────────────────────
  const observer = new MutationObserver(() => {
    if (!document.getElementById('umt-redesign-root')) {
      if (!safeInject()) observer.disconnect();
    }
  });
  if (injected) observer.observe(document.body, { childList: true, subtree: false });


  // ═══════════════════════════════════════════════════════════
  // DATA EXTRACTION  (runs before we hide anything)
  // ═══════════════════════════════════════════════════════════
  function extractPortalData() {
    const data = {
      username: '', studentId: '', avatarInitials: 'S',
      marqueeText: '',
      timetableRows: [], coursesRows: [],
      logoutToken: '', logoutAction: '/Account/LogOff',
    };
    try {
      const profileName = q('.sub-title-w3-agileits');
      if (profileName) data.username = profileName.textContent.trim();

      qq('.drop-3 a').forEach(a => {
        if (/S\d{6,}/.test(a.textContent)) data.studentId = a.textContent.trim();
      });

      if (data.username) {
        data.avatarInitials = data.username.trim().split(' ')
          .map(p => p[0] || '').join('').slice(0, 2).toUpperCase() || 'S';
      }

      const marquee = q('marquee');
      if (marquee) data.marqueeText = marquee.textContent.trim();

      // Timetable
      const ttTable = q('#collapseThree table');
      if (ttTable) {
        qq('tr', ttTable).slice(1).forEach(row => {
          const c = qq('td', row);
          if (c.length >= 9) data.timetableRows.push({
            day: c[0].textContent.trim(), code: c[1].textContent.trim(),
            name: c[2].textContent.trim(), faculty: c[3].textContent.trim(),
            type: c[4].textContent.trim(), mode: c[5].textContent.trim(),
            start: c[6].textContent.trim(), end: c[7].textContent.trim(),
            room: c[8].textContent.trim(),
          });
        });
      }

      // Registered courses
      const rcTable = q('#collapseOne table');
      if (rcTable) {
        qq('tr', rcTable).slice(1).forEach(row => {
          const c = qq('td', row);
          if (c.length >= 9) data.coursesRows.push({
            id: c[0].textContent.trim(), title: c[1].textContent.trim(),
            crHr: c[2].textContent.trim(), type: c[3].textContent.trim(),
            faculty: c[4].textContent.trim(), email: c[5].textContent.trim(),
            mode: c[6].textContent.trim(), section: c[7].textContent.trim(),
            semester: c[8].textContent.trim(),
          });
        });
      }

      const tokenInput = q('input[name="__RequestVerificationToken"]');
      if (tokenInput) data.logoutToken = tokenInput.value;
      const logoutForm = q('#logoutForm');
      if (logoutForm) data.logoutAction = logoutForm.action || data.logoutAction;

    } catch (e) { console.warn('[UMT Redesign] Data extraction error:', e); }
    return data;
  }


  // ═══════════════════════════════════════════════════════════
  // DASHBOARD INJECTION  (full redesign, home page only)
  // ═══════════════════════════════════════════════════════════
  function injectDashboard(data, campusImg) {
    // Hide original layout (hidden, never removed)
    document.body.classList.add('umt-redesigned');

    const root = document.createElement('div');
    root.id = 'umt-redesign-root';
    root.innerHTML = `
      <div class="umt-scrim"></div>
      ${buildSidebar(path)}
      <div class="umt-main">
        ${buildHeader(data)}
        <div class="umt-content">
          <div class="umt-dash-only">
            ${buildHero(campusImg, data)}
            ${buildDashboardCards()}
            ${buildTimetableStrip(data)}
            ${buildCoursesStrip(data)}
          </div>
          ${buildTeamView()}
        </div>
        ${buildFooter()}
      </div>
    `;
    document.body.appendChild(root);

    // The profile popover lives inside root so the page-hiding rule never touches it
    const panel = buildProfilePanelEl(data);
    root.appendChild(panel);

    wireInteractivity(root, panel);
    wireViews(root);
  }


  // ═══════════════════════════════════════════════════════════
  // SKIN-ONLY INJECTION  (non-dashboard pages)
  // Wraps the existing portal content in our sidebar + header so
  // navigation feels consistent, while the portal's own page
  // renders normally inside the content area.
  // ═══════════════════════════════════════════════════════════
  function injectSkinOnly(data) {
    document.body.classList.add('umt-skinned');

    // Move all original body children (except scripts/styles) into a holder
    const originalContent = document.createElement('div');
    originalContent.id = 'umt-original-content';
    Array.from(document.body.children).forEach(child => {
      if (['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) return;
      originalContent.appendChild(child);
    });

    const root = document.createElement('div');
    root.id = 'umt-redesign-root';
    root.innerHTML = `
      <div class="umt-scrim"></div>
      ${buildSidebar(path)}
      <div class="umt-main">
        ${buildHeader(data)}
      </div>
    `;

    const main = root.querySelector('.umt-main');
    main.appendChild(originalContent);
    main.insertAdjacentHTML('beforeend', buildFooter());

    document.body.appendChild(root);

    const panel = buildProfilePanelEl(data);
    root.appendChild(panel);

    wireInteractivity(root, panel);
  }


  // ═══════════════════════════════════════════════════════════
  // LOGIN PAGE  (glass card, real form left untouched)
  // ═══════════════════════════════════════════════════════════
  function injectLoginPage(campusImg) {
    if (document.body.classList.contains('umt-login-redesigned')) return;
    document.body.classList.add('umt-login-redesigned');

    // Campus background photo (overrides the body.bck stock image via a CSS variable)
    if (campusImg) {
      document.body.style.setProperty('--umt-campus', `url('${campusImg}')`);
    }

    // Swap the stock UMT_Logo.png for the transparent seal
    const logoImg = q('.wrap-login100 img');
    if (logoImg) {
      const logoUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
        ? chrome.runtime.getURL('assets/icons/logo.png')
        : logoImg.src;
      logoImg.src = logoUrl;
      logoImg.classList.add('umt-login-logo');
      logoImg.removeAttribute('height');
      logoImg.removeAttribute('width');
    }

    // Relabel the submit button. The original click handler is bound to
    // #loginbtn itself, so changing the text does not affect submission.
    const loginBtn = document.getElementById('loginbtn');
    if (loginBtn && !loginBtn.dataset.umtLabeled) {
      loginBtn.textContent = 'Get Started';
      loginBtn.dataset.umtLabeled = '1';
    }

    // Replace the font-glyph icons with SVGs that sit in a fixed gutter,
    // so the icon and the typed text can never overlap.
    qq('.wrap-input100').forEach(wrap => {
      const input = wrap.querySelector('input');
      if (!input) return;
      let iconName = null;
      if (input.id === 'student_id') iconName = 'user';
      else if (input.id === 'Password') iconName = 'lock';
      if (!iconName) return;

      let sym = wrap.querySelector('.symbol-input100');
      if (!sym) {
        sym = document.createElement('span');
        sym.className = 'symbol-input100';
        wrap.appendChild(sym);
      }
      sym.innerHTML = icon(iconName);
    });

    // Show / hide password (type="button" so it never submits the form)
    const pwd = document.getElementById('Password');
    if (pwd && !pwd.parentElement.querySelector('.umt-eye')) {
      const eye = document.createElement('button');
      eye.type = 'button';
      eye.className = 'umt-eye';
      eye.setAttribute('aria-label', 'Show password');
      eye.innerHTML = icon('eye');
      eye.addEventListener('click', () => {
        const show = pwd.type === 'password';
        pwd.type = show ? 'text' : 'password';
        eye.innerHTML = icon(show ? 'eyeOff' : 'eye');
        eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
      pwd.parentElement.appendChild(eye);
    }

    // Label the captcha box for screen readers
    const captchaSpan = q('.captcha');
    if (captchaSpan) captchaSpan.setAttribute('aria-label', 'Captcha code');

    // Floating PRS chatbot shortcut
    const chatbot = q('a[href*="chatgpt.com"]');
    if (chatbot) chatbot.classList.add('umt-chatbot');
  }


  // ═══════════════════════════════════════════════════════════
  // UI BUILDERS
  // ═══════════════════════════════════════════════════════════

  function buildSidebar(currentPath) {
    // DeyKode opens the extension's own links page (Instagram, LinkedIn, website)
    const deykodePageUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
      ? chrome.runtime.getURL('deykode.html')
      : 'https://www.deykode.com';
    const navItems = [
      { icon: 'dashboard', label: 'Dashboard',           href: '/Home/Index', nav: 'dashboard' },
      { icon: 'user',      label: 'Profile',             href: '/studentProfile/studentProfile' },
      { icon: 'book',      label: 'My Courses',          href: '/MyCourses' },
      { icon: 'cap',       label: 'Transcript',          href: '/Transcript' },
      { icon: 'chat',      label: 'Feedback',            href: '/StudentFeedback' },
      { icon: 'doc',       label: 'Student Undertaking', href: '/StudentUndertaking' },
      { icon: 'inbox',     label: 'Request', href: '#', submenu: [
          { label: 'PRS Requests',       href: '/ManageRequests/getAllRequests' },
          { label: 'Courses Request',    href: '/CourseRequest/Index?RequestType=AddDrop' },
          { label: 'Request Management', href: '/ManageRequests/Index1' },
          { label: 'FT Clearance',       href: '/Home/Clearance' },
          { label: 'Appointment',        href: '/AppointmentRequest' },
      ]},
      { icon: 'card',      label: 'Payments', href: '#', submenu: [
          { label: 'Payment History',     href: '/Payment' },
          { label: 'Pending Fee Voucher', href: '/Payment/Payment_Voucher' },
      ]},
      { icon: 'map',       label: 'Road Map',          href: '/Roadmap' },
      { icon: 'megaphone', label: 'Announcements',     href: '/Announcements' },
      { icon: 'bag',       label: 'UMT Store',         href: '/Home/umtstore' },
      { icon: 'calendar',  label: 'Academic Calendar', href: 'https://www.umt.edu.pk/org/Academic-Calendar/Academic-Calendar-2019-2020.aspx', target: '_blank' },
      { icon: 'clock',     label: 'Timetable Finder',  href: 'https://umt-timetable-finder.vercel.app/', target: '_blank' },
      { icon: 'drop',      label: 'FindKhoon',         href: 'https://www.findkhoon.online', target: '_blank' },
      { icon: 'users',     label: 'DeyKode',           href: deykodePageUrl, target: '_blank' },
    ];

    const cp = currentPath.replace(/\/$/, '').toLowerCase();
    const matches = href => {
      const h = href.split('?')[0].toLowerCase();
      return h !== '#' && (cp === h || cp.startsWith(h));
    };

    const itemsHtml = navItems.map(item => {
      if (item.submenu) {
        const subActive = item.submenu.some(s => matches(s.href));
        return `
          <li class="umt-nav-item${subActive ? ' open' : ''}">
            <button class="umt-nav-toggle" type="button" title="${esc(item.label)}" aria-expanded="${subActive}">
              <span class="umt-nav-icon">${icon(item.icon)}</span>
              <span class="umt-nav-label">${esc(item.label)}</span>
              <span class="umt-nav-arrow">${icon('chevronDown')}</span>
            </button>
            <ul class="umt-nav-sub">
              ${item.submenu.map(sub => `
                <li class="${matches(sub.href) ? 'sub-active' : ''}">
                  <a href="${esc(sub.href)}">${esc(sub.label)}</a>
                </li>`).join('')}
            </ul>
          </li>`;
      }

      // The dashboard is also served at "/" and "/Home", so use the page type
      const onTeam = window.location.hash === TEAM_HASH;
      const active = item.nav === 'dashboard' ? (isDashboard && !onTeam)
                   : item.nav === 'team'      ? (isDashboard && onTeam)
                   : matches(item.href);
      return `
        <li class="umt-nav-item${active ? ' active' : ''}"${item.nav ? ` data-nav="${item.nav}"` : ''}>
          <a href="${esc(item.href)}" title="${esc(item.label)}"${item.target ? ` target="${item.target}" rel="noopener"` : ''}${active ? ' aria-current="page"' : ''}>
            <span class="umt-nav-icon">${icon(item.icon)}</span>
            <span class="umt-nav-label">${esc(item.label)}</span>
          </a>
        </li>`;
    }).join('');

    return `
      <nav class="umt-sidebar" aria-label="Main">
        <div class="umt-brand">
          ${brandMark()}
          <div class="umt-brand-text">
            <span class="umt-brand-name">UMT</span>
            <span class="umt-brand-sub">Student Portal</span>
          </div>
        </div>
        <ul class="umt-nav">${itemsHtml}</ul>
      </nav>`;
  }

  function buildHeader(data) {
    // Scroll speed scales with text length so long notices stay readable
    const tickerSeconds = Math.max(24, Math.round((data.marqueeText || '').length * 0.22));
    return `
      <header class="umt-header">
        <button class="umt-icon-btn umt-header-toggle" id="umt-sidebar-toggle" type="button" title="Toggle sidebar" aria-label="Toggle sidebar">${icon('sidebar')}</button>
        <span class="umt-header-title">${esc(getPageTitle())}</span>
        ${data.marqueeText ? `
          <div class="umt-ticker" role="marquee" aria-label="Announcements">
            <span class="umt-ticker-track" style="animation-duration:${tickerSeconds}s">${esc(data.marqueeText)}</span>
          </div>` : ''}
        <div class="umt-header-actions">
          <a href="/ManageRequests/PRSChat/169213b3-1188-f011-80bc-02bf0a020011"
             class="umt-icon-btn" title="Messages" aria-label="Messages">${icon('message')}</a>
          <button class="umt-icon-btn" type="button" title="Notifications" aria-label="Notifications">${icon('bell')}</button>
          <button class="umt-icon-btn" id="umt-fullscreen-btn" type="button" title="Fullscreen" aria-label="Toggle fullscreen">${icon('expand')}</button>
          <button class="umt-avatar" id="umt-profile-toggle" type="button" title="Profile" aria-label="Open profile menu">
            ${esc(data.avatarInitials || 'S')}
          </button>
        </div>
      </header>`;
  }

  function getPageTitle() {
    const map = {
      '/home': 'Dashboard', '/home/index': 'Dashboard',
      '/mycourses': 'My Courses',
      '/studentprofile': 'Profile',
      '/transcript': 'Transcript',
      '/studentfeedback': 'Feedback',
      '/studentundertaking': 'Student Undertaking',
      '/announcements': 'Announcements',
      '/payment': 'Payments',
      '/roadmap': 'Road Map',
      '/attendance': 'Attendance',
      '/courserequest': 'Course Registration',
      '/managerequests': 'Request Management',
      '/home/clearance': 'FT Clearance',
      '/advisor': 'Academic Advisor',
    };
    const cp = path.replace(/\/$/, '');
    if (cp === '') return 'Dashboard';
    for (const [k, v] of Object.entries(map)) {
      if (cp === k || cp.startsWith(k)) return v;
    }
    // Fallback: humanize pathname
    return cp.split('/').filter(Boolean).pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Portal';
  }

  function firstName(full) {
    const w = (full || '').trim().split(/\s+/)[0] || '';
    return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
  }

  function buildHero(campusImg, data) {
    const bg = campusImg ? ` style="background-image:url('${campusImg}')"` : '';
    const name = firstName(data.username);
    const title = name ? `Welcome back, ${esc(name)}.` : 'Welcome to UMT.';
    return `
      <section class="umt-hero"${bg}>
        <div class="umt-hero-panel">
          <h1 class="umt-hero-title">Welcome back,<br>Dear.</h1>
          <p class="umt-hero-sub">Access all your academic resources, services and announcements in one place.</p>
          <div class="umt-hero-actions">
            <a href="https://lms.umt.edu.pk" target="_blank" rel="noopener" class="umt-btn umt-btn-primary">Open LMS ${icon('arrowUpRight')}</a>
            <a href="/Announcements" class="umt-btn umt-btn-secondary">Announcements</a>
          </div>
        </div>
      </section>`;
  }

  function buildDashboardCards() {
    const tile = (href, ic, label, tone, external) => `
      <a href="${href}" class="umt-tile" data-tone="${tone}"${external ? ' target="_blank" rel="noopener"' : ''}>
        <span class="umt-tile-icon">${icon(ic)}</span>${label}
      </a>`;
    const row = (href, ic, label) => `
      <li><a href="${href}">
        <span class="umt-item-icon">${icon(ic)}</span>
        <span class="umt-item-label">${label}</span>
        ${icon('chevronRight', 'umt-item-chev')}
      </a></li>`;
    const head = (tone, ic, title, href) => `
      <div class="umt-card-header">
        <div class="umt-card-title-row">
          <span class="umt-app-icon umt-tone-${tone}">${icon(ic)}</span>
          <h2 class="umt-card-title">${title}</h2>
        </div>
        <a href="${href}" class="umt-card-view-all">View all ${icon('chevronRight')}</a>
      </div>`;

    return `
      <div class="umt-cards-grid">

        <div class="umt-card umt-card-academics">
          ${head('blue', 'cap', 'Academics', '/MyCourses')}
          <div class="umt-tile-grid">
            ${tile('/CourseRequest', 'pencil', 'New Registration', 'blue')}
            ${tile('/MyCourses', 'book', 'My Courses', 'purple')}
            ${tile('/Attendance', 'checkCircle', 'Attendance', 'green')}
            ${tile('https://lms.umt.edu.pk/login/index.php', 'monitor', 'LMS', 'orange', true)}
          </div>
        </div>

        <div class="umt-card umt-card-learning">
          ${head('green', 'users', 'Learning Support', '/Advisor')}
          <ul class="umt-item-list">
            ${row('/Advisor', 'userCheck', 'Academic Advisor')}
            ${row('/TutorProgram/Index', 'clipboard', 'Peer Tutoring Program')}
          </ul>
        </div>

        <div class="umt-card umt-card-request">
          ${head('orange', 'inbox', 'Request Management', '/ManageRequests/Index1')}
          <ul class="umt-item-list">
            ${row('/ManageRequests/Index1', 'send', 'Submit a Request')}
            ${row('/ManageRequests/getAllRequests', 'search', 'Track Status')}
            ${row('/Home/Clearance', 'shield', 'FT Clearance')}
          </ul>
        </div>

        <div class="umt-card umt-card-resources">
          ${head('purple', 'globe', 'Resources', '/AcademicRecord')}
          <ul class="umt-item-list">
            ${row('/AcademicRecord', 'globe', 'Important Links')}
          </ul>
        </div>

      </div>`;
  }

  function modeBadge(mode) {
    const online = /online/i.test(mode || '');
    return `<span class="umt-badge${online ? ' is-online' : ''}">${esc(mode)}</span>`;
  }

  function buildStrip(opts) {
    return `
      <div class="umt-strip">
        <button class="umt-strip-header" type="button" data-body="${opts.bodyId}" aria-expanded="false" aria-controls="${opts.bodyId}">
          <span class="umt-app-icon umt-tone-${opts.tone}">${icon(opts.icon)}</span>
          <span class="umt-strip-label">${opts.title}</span>
          <span class="umt-strip-btn">
            <span class="umt-strip-show">${opts.showLabel}</span><span class="umt-strip-hide">Hide</span>
            ${icon('chevronDown')}
          </span>
        </button>
        <div class="umt-strip-body" id="${opts.bodyId}">
          <div class="umt-strip-inner">${opts.content}</div>
        </div>
      </div>`;
  }

  // ── Timetable: one card column per day, slots in time order ──────────
  // "8:00 AM", "08:00", "8:00:00 AM", "1:45 PM" → minutes since midnight (NaN if unreadable)
  function timeToMinutes(str) {
    const m = String(str || '').trim().match(/(\d{1,2})\s*[:.]\s*(\d{2})(?:\s*[:.]\s*\d{2})?\s*([ap]\.?m\.?)?/i);
    if (!m) return NaN;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ap = (m[3] || '').toLowerCase().replace(/\./g, '');
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    return h * 60 + min;
  }

  // Normalise to "8:00 AM" (split so the CSS can shrink the AM/PM part)
  function timeParts(str) {
    const mins = timeToMinutes(str);
    if (isNaN(mins)) return { clock: esc(str), ap: '' };
    const h24 = Math.floor(mins / 60), mm = String(mins % 60).padStart(2, '0');
    return { clock: `${h24 % 12 || 12}:${mm}`, ap: h24 >= 12 ? 'PM' : 'AM' };
  }

  function buildTimetableStrip(data) {
    let content;
    if (data.timetableRows.length > 0) {
      // Group by day
      const byDay = new Map();
      data.timetableRows.forEach(r => {
        const key = (r.day || '').trim().toLowerCase();
        if (!byDay.has(key)) byDay.set(key, { label: (r.day || '').trim() || 'Other', rows: [] });
        byDay.get(key).rows.push(r);
      });

      // Monday → Sunday, unknown day names last
      const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
      const dayRank = k => { const i = DAY_ORDER.findIndex(d => k.startsWith(d.slice(0, 3))); return i < 0 ? 99 : i; };
      const days = Array.from(byDay.entries())
        .sort((a, b) => dayRank(a[0]) - dayRank(b[0]))
        .map(([, v]) => v);

      const slot = r => {
        const st = timeParts(r.start), en = timeParts(r.end);
        const isLab = /lab/i.test(r.type) || /\bL$/.test(r.code);
        const room = r.room || 'Room TBA';
        return `
          <div class="umt-slot">
            <div class="umt-slot-time">
              <span class="umt-slot-start">${st.clock}<small>${st.ap}</small></span>
              <span class="umt-slot-end">to ${en.clock} ${en.ap}</span>
            </div>
            <div class="umt-slot-card${isLab ? ' is-lab' : ''}">
              <div class="umt-slot-top">
                <span class="umt-slot-code">${esc(r.code)}</span>
                <span class="umt-slot-type"><i></i>${esc(r.type || (isLab ? 'Lab' : 'Theory'))}</span>
              </div>
              <div class="umt-slot-name">${esc(r.name)}</div>
              <div class="umt-slot-meta">${icon('user')}<span>${esc(r.faculty)}</span></div>
              <div class="umt-slot-meta">${icon('map')}<span>${esc(room)}</span></div>
              <div class="umt-slot-foot">${modeBadge(r.mode)}</div>
            </div>
          </div>`;
      };

      content = `
        <div class="umt-tt-days">
          ${days.map(d => {
            const sorted = d.rows.slice().sort((a, b) => {
              const x = timeToMinutes(a.start), y = timeToMinutes(b.start);
              return (isNaN(x) ? 1e9 : x) - (isNaN(y) ? 1e9 : y);
            });
            return `
              <section class="umt-tt-day">
                <header class="umt-tt-day-head">
                  <h3>${esc(d.label)}</h3>
                  <span>${sorted.length} ${sorted.length === 1 ? 'class' : 'classes'}</span>
                </header>
                <div class="umt-tt-slots">${sorted.map(slot).join('')}</div>
              </section>`;
          }).join('')}
        </div>`;
    } else {
      content = '<p class="umt-empty">No timetable data found.</p>';
    }
    return buildStrip({ bodyId: 'umt-tt-body', tone: 'blue', icon: 'clock', title: 'Timetable', showLabel: 'View timetable', content });
  }

  function buildCoursesStrip(data) {
    let content;
    if (data.coursesRows.length > 0) {
      content = `
        <div class="umt-table-wrap">
          <table class="umt-table">
            <thead><tr>
              <th>ID</th><th>Title</th><th class="umt-td-center">Cr.Hr</th><th>Type</th>
              <th>Faculty</th><th>Email</th><th>Mode</th><th>Section</th><th>Semester</th>
            </tr></thead>
            <tbody>
              ${data.coursesRows.map(r => `<tr>
                <td><strong>${esc(r.id)}</strong></td>
                <td>${esc(r.title)}</td>
                <td class="umt-td-center">${esc(r.crHr)}</td>
                <td>${esc(r.type)}</td>
                <td>${esc(r.faculty)}</td>
                <td class="umt-td-muted">${esc(r.email)}</td>
                <td>${modeBadge(r.mode)}</td>
                <td>${esc(r.section)}</td>
                <td>${esc(r.semester)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    } else {
      content = '<p class="umt-empty">No registered courses found.</p>';
    }
    return buildStrip({ bodyId: 'umt-rc-body', tone: 'purple', icon: 'bookOpen', title: 'Registered Courses', showLabel: 'View courses', content });
  }

  function buildFooter() {
    return `
      <div class="umt-footer">
        <p>© ${new Date().getFullYear()} All Rights Reserved | Designed and built by
          <a href="https://www.deykode.com" target="_blank" rel="noopener">DeyKode</a>
        </p>
      </div>`;
  }

  function buildProfilePanelEl(data) {
    const panel = document.createElement('div');
    panel.id = 'umt-profile-panel';
    panel.className = 'umt-profile-panel';
    panel.innerHTML = `
      <div class="umt-profile-head">
        <span class="umt-avatar" aria-hidden="true">${esc(data.avatarInitials || 'S')}</span>
        <div>
          <p class="umt-profile-name">${esc(data.username || 'Student')}</p>
          <p class="umt-profile-id">${esc(data.studentId)}</p>
        </div>
      </div>
      <a href="/Manage/ChangePassword" class="umt-profile-row">${icon('lock')} Change Password</a>
      <form method="post" action="${esc(data.logoutAction)}">
        <input type="hidden" name="__RequestVerificationToken" value="${esc(data.logoutToken)}">
        <button type="submit" class="umt-profile-row is-danger">${icon('logout')} Logout</button>
      </form>`;
    return panel;
  }


  // ═══════════════════════════════════════════════════════════
  // INTERACTIVITY
  // ═══════════════════════════════════════════════════════════
  function wireInteractivity(root, profilePanel) {

    // Sidebar toggle
    const toggleBtn = root.querySelector('#umt-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) root.classList.toggle('sidebar-mobile-open');
        else root.classList.toggle('sidebar-collapsed');
      });
    }

    // Close the mobile sidebar when tapping outside it (the toggle itself is excluded,
    // otherwise it would open and immediately close again)
    root.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && root.classList.contains('sidebar-mobile-open')) {
        if (e.target.closest('.umt-sidebar, #umt-sidebar-toggle')) return;
        root.classList.remove('sidebar-mobile-open');
      }
    });

    // Sub-menu toggles
    root.querySelectorAll('.umt-nav-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const li = btn.closest('.umt-nav-item');
        const wasOpen = li.classList.contains('open');
        root.querySelectorAll('.umt-nav-item.open').forEach(el => {
          el.classList.remove('open');
          const b = el.querySelector('.umt-nav-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          li.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Profile popover
    const profileBtn = root.querySelector('#umt-profile-toggle');
    if (profileBtn && profilePanel) {
      const close = () => profilePanel.classList.remove('is-open');
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePanel.classList.toggle('is-open');
      });
      document.addEventListener('click', close);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
      profilePanel.addEventListener('click', e => e.stopPropagation());
    }

    // Fullscreen
    const fsBtn = root.querySelector('#umt-fullscreen-btn');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      });
    }

    // Accordions (Timetable / Registered Courses)
    root.querySelectorAll('.umt-strip-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = document.getElementById(header.dataset.body);
        if (!body) return;
        const open = body.classList.toggle('open');
        header.setAttribute('aria-expanded', String(open));
        header.closest('.umt-strip').classList.toggle('is-open', open);
      });
    });
  }


  // ═══════════════════════════════════════════════════════════
  // UTILS
  // ═══════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════
  // TEAM VIEW  (/Home/Index#umt-team; no longer linked from the sidebar)
  // A view inside the dashboard shell, so it works without any portal page.
  // ═══════════════════════════════════════════════════════════
  function buildTeamView() {
    return `
      <section class="umt-team" aria-labelledby="umt-team-title">
        <h1 class="umt-team-title" id="umt-team-title">Team</h1>
        <ul class="umt-team-list">
          ${TEAM.map(m => `
            <li>
              <a class="umt-team-card" href="${esc(m.href)}" target="_blank" rel="noopener" title="Open LinkedIn profile">
                <span class="umt-team-name">${esc(m.name)}</span>
                <span class="umt-team-email">${esc(m.email)}</span>
                ${icon('chevronRight', 'umt-team-arrow')}
              </a>
            </li>`).join('')}
        </ul>
      </section>`;
  }

  function wireViews(root) {
    const title = root.querySelector('.umt-header-title');

    const apply = () => {
      const team = window.location.hash === TEAM_HASH;
      root.classList.toggle('view-team', team);
      root.classList.remove('sidebar-mobile-open');
      if (title) title.textContent = team ? 'DeyKode' : getPageTitle();
      root.querySelectorAll('.umt-nav-item[data-nav]').forEach(li => {
        li.classList.toggle('active', (li.dataset.nav === 'team') === team);
      });
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', apply);

    // "Dashboard" while on the team view: switch back without reloading the portal
    const dashLink = root.querySelector('.umt-nav-item[data-nav="dashboard"] a');
    if (dashLink) {
      dashLink.addEventListener('click', (e) => {
        if (window.location.hash !== TEAM_HASH) return;
        e.preventDefault();
        history.pushState(null, '', window.location.pathname + window.location.search);
        apply();
      });
    }
    apply();
  }

  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qq(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }


  } // end start()

})();
