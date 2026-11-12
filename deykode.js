// UMT Portal Suite - deykode.js
// Back button on the DeyKode links page. The page is opened in a new tab from
// the portal sidebar, so there is usually no history to go back to: in that
// case close the tab (returning to the portal tab), and if the browser refuses
// to close it, go to the portal dashboard instead.
const PORTAL_HOME = 'https://online.umt.edu.pk/Home/Index';

document.getElementById('backBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.close();
  setTimeout(() => { window.location.href = PORTAL_HOME; }, 150);
});
