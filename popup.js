// UMT Portal Suite - popup.js v5.0
// Made by: DeyKode

const PORTAL_HOST = 'online.umt.edu.pk';
const LOGIN_URL   = 'https://online.umt.edu.pk/Account/Login';

const studentIdEl    = document.getElementById('studentId');
const passwordEl     = document.getElementById('password');
const submitBtn      = document.getElementById('submitBtn');
const statusEl       = document.getElementById('status');
const autoToggle     = document.getElementById('autoToggle');
const redesignToggle = document.getElementById('redesignToggle');
const savedNotice    = document.getElementById('savedNotice');
const clearLink      = document.getElementById('clearLink');
const eyeBtn         = document.getElementById('eyeBtn');
const eyeIcon        = document.getElementById('eyeIcon');

// ─── Helpers ──────────────────────────────────────────────────────────────────
let statusTimer;
function showStatus(msg, type, duration = 4000) {
  clearTimeout(statusTimer);
  statusEl.textContent = msg;
  statusEl.className = type;
  statusEl.style.display = 'block';
  if (duration) statusTimer = setTimeout(() => { statusEl.style.display = 'none'; }, duration);
}

function hostOf(url) {
  try { return new URL(url).hostname; } catch (_) { return ''; }
}

function withActiveTab(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => cb(tab));
}

// ─── Eye toggle ───────────────────────────────────────────────────────────────
let passVisible = false;
eyeBtn.addEventListener('click', () => {
  passVisible = !passVisible;
  passwordEl.type = passVisible ? 'text' : 'password';
  eyeIcon.innerHTML = passVisible
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
});

// ─── Load saved settings on popup open ────────────────────────────────────────
chrome.storage.local.get(['umtId', 'umtPass', 'autoSolve', 'redesign'], (data) => {
  if (data.umtId) {
    studentIdEl.value = data.umtId;
    passwordEl.value  = data.umtPass || '';
    savedNotice.classList.add('show');
    clearLink.style.display = 'block';
    submitBtn.textContent = 'Update';
  }
  autoToggle.checked     = data.autoSolve !== false;
  redesignToggle.checked = data.redesign  !== false;
});

// ─── Submit: save credentials & trigger fill ──────────────────────────────────
submitBtn.addEventListener('click', () => {
  const id   = studentIdEl.value.trim();
  const pass = passwordEl.value;

  if (!id || !pass) {
    showStatus('Please enter your Student ID and Password.', 'error');
    return;
  }

  chrome.storage.local.set({ umtId: id, umtPass: pass }, () => {
    showStatus('Credentials saved.', 'success');
    savedNotice.classList.add('show');
    clearLink.style.display = 'block';
    submitBtn.textContent = 'Update';

    setTimeout(() => {
      withActiveTab((tab) => {
        if (tab && hostOf(tab.url) === PORTAL_HOST) {
          // Already on the portal: fill now if this is the sign-in page
          injectAndFill(tab.id, id, pass);
        } else {
          // Open the sign-in page. The popup closes when the tab opens, so the
          // page's own content script does the fill on load (Auto-solve must be on).
          chrome.tabs.create({ url: LOGIN_URL }, (newTab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === newTab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                setTimeout(() => injectAndFill(newTab.id, id, pass), 1000);
              }
            });
          });
        }
      });
    }, 600);
  });
});

// ─── Inject the autofill script & send the fill command ───────────────────────
function injectAndFill(tabId, id, pass) {
  chrome.scripting.executeScript(
    { target: { tabId }, files: ['autofill.js'] },
    () => {
      if (chrome.runtime.lastError) return;
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: 'fillAll', studentId: id, password: pass }, (response) => {
          if (chrome.runtime.lastError) return;
          if (response?.success) showStatus(response.message, 'success');
          else if (response?.message) showStatus(response.message, 'info');
        });
      }, 400);
    }
  );
}

// ─── Clear credentials ────────────────────────────────────────────────────────
clearLink.addEventListener('click', () => {
  if (!confirm('Clear saved credentials?')) return;
  chrome.storage.local.remove(['umtId', 'umtPass'], () => {
    studentIdEl.value = '';
    passwordEl.value  = '';
    savedNotice.classList.remove('show');
    clearLink.style.display = 'none';
    submitBtn.textContent = 'Submit';
    showStatus('Credentials cleared.', 'info');
  });
});

// ─── Quick Links ──────────────────────────────────────────────────────────────
document.getElementById('lmsBtn').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://lms.umt.edu.pk' });
});

document.getElementById('financeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://www.instagram.com/deykode?obrf=M2dzdTg0Zm04Yzh4&utm_source=qr' });
});

// ─── Toggles ──────────────────────────────────────────────────────────────────
autoToggle.addEventListener('change', () => {
  chrome.storage.local.set({ autoSolve: autoToggle.checked });
});

// The redesign rebuilds the page, so switching it needs a reload of the portal tab
redesignToggle.addEventListener('change', () => {
  const on = redesignToggle.checked;
  chrome.storage.local.set({ redesign: on }, () => {
    withActiveTab((tab) => {
      if (tab && hostOf(tab.url) === PORTAL_HOST) {
        chrome.tabs.reload(tab.id);
        showStatus(on ? 'Redesign on. Portal reloaded.' : 'Redesign off. Portal reloaded.', 'info', 2500);
      } else {
        showStatus(on ? 'Redesign on. Applies next time you open the portal.' : 'Redesign off. Applies next time you open the portal.', 'info', 3000);
      }
    });
  });
});
