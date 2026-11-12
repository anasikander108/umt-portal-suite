# UMT Portal Suite – Chrome Extension (v5)

One extension for `online.umt.edu.pk` that combines:

- **Portal redesign** – Apple-style glass interface for the sign-in page, dashboard and every inner page.
- **Auto Captcha** – fills Student ID, password and the captcha on the sign-in page.

Both features are controlled from the toolbar popup.

## Files

```
umt-portal-suite/
├── manifest.json
├── content.js      # redesign (UI, icons, login fixes)
├── content.css     # redesign styles
├── autofill.js     # auto captcha / credential fill (sign-in page only)
├── popup.html      # toolbar popup
├── popup.js
├── assets/
│   ├── campus.png              # hero + login background
│   ├── umt-logo.png            # sidebar logo
│   └── icons/                  # icon16/48/128 (toolbar), logo.png (login seal)
└── README.md
```

## Install (Chrome / Edge)

1. Remove the two old extensions (Auto Captcha and Portal Redesign) so they don't run twice.
2. Open `chrome://extensions`, enable **Developer mode**.
3. **Load unpacked** and select the `umt-portal-suite` folder.
4. Open the popup, enter your Student ID and password, press **Submit**.

After changing any file, click **Reload** on the extension and hard-refresh the portal (`Ctrl+Shift+R`).

## Popup

| Control | What it does |
|---|---|
| Submit / Update | Saves your credentials. On the portal it fills the sign-in page; elsewhere it opens the sign-in page. |
| Auto‑solve on page load | Fills ID, password and captcha automatically whenever the sign-in page opens. |
| Portal redesign | Turns the redesign on or off. The portal tab reloads when you change it. |
| Clear saved credentials | Removes the saved ID and password. |

## How the two features work together

- The redesign restyles the sign-in form; it never changes the form's fields, so auto-fill finds them as before.
- Auto-fill runs **only on the sign-in page** (detected by `#loginform`). Other portal pages are never touched, so Change Password or search boxes are not filled.
- The captcha is read with `textContent`, so CSS such as `text-transform` can't change its letter case.
- The status toast is a glass pill at the bottom centre of the page.

## Sidebar extras

- **Timetable Finder** opens https://umt-timetable-finder.vercel.app/ in a new tab.
- **FindKhoon** (right below Timetable Finder) opens https://www.findkhoon.online in a new tab.
- **DeyKode** opens the extension's own links page (`deykode.html`) in a new tab, with a square tile for each of Instagram, LinkedIn and the website. The footer reads "Designed and built by DeyKode" and links straight to https://www.deykode.com.
- The popup's **Follow for More** button opens the DeyKode Instagram (https://www.instagram.com/deykode).
- The old Team page (`/Home/Index#umt-team`) is still in `content.js` but is no longer linked from the sidebar.

## Permissions

`storage` (saved credentials and switches), `scripting` and `activeTab` (fill the current tab from the popup), and host access to `https://online.umt.edu.pk/*` only.

**Note:** the password is stored unencrypted in `chrome.storage.local`, as in the original Auto Captcha extension. It stays on your machine, but anyone with access to your browser profile can read it. Don't use this on a shared computer.

## Customising

- Colours, radii, glass strength: tokens at the top of `content.css`.
- Font: `--font` in `content.css` and `font-family` in `popup.html`.
- Sidebar items and icons: `navItems` and `ICONS` in `content.js`.
- Sidebar logo: replace `assets/umt-logo.png` (square PNG with transparent background, 256px is enough).
- Toolbar icons: replace the three PNGs in `assets/icons/`.
- Extension name: `name` in `manifest.json`.

## v5.1 changes

- **Fixed:** on the Home page, opening Timetable or Registered Courses could
  leave a dark overlay on screen after closing it, previously only cleared by
  refreshing. `content.js` now watches for that leftover state (a stray
  Bootstrap `.modal-backdrop` with no modal actually open) after any close
  attempt — click, Escape key, or backdrop click — and removes it, restoring
  normal scrolling. If you still see it stick around in some new spot, note
  exactly what you clicked right before it happened; that detail decides
  whether the fix above covers it or the trigger needs a different selector.
- **Added:** FindKhoon sidebar link, right under Teacher Reviews.

## v5.3

- Home page **Timetable** is now one card column per day (Monday → Sunday), with each day's classes sorted by start time (8:00 AM first, then 9:30 AM, …), instead of one long table.

## v5.4

- **Removed:** Teacher Reviews sidebar link.
- **Added:** Timetable Finder sidebar link in its place.
- **Changed:** the DeyKode sidebar link now opens a links page (`deykode.html`) with tiles for Instagram, LinkedIn and the website.
- **Added:** Back button on the DeyKode links page. It closes the tab and returns you to the portal (or opens the portal dashboard if the tab can't be closed).
- **Changed:** extension logo (toolbar icons, popup header, sign-in page logo) is now the official UMT seal.
- **Changed:** the popup's "Follow for More" button now opens the DeyKode Instagram instead of LinkedIn.

## Troubleshooting

| Problem | Fix |
|---|---|
| Nothing fills | Check **Auto‑solve on page load** is on and you are on the sign-in page. |
| Old look still shows | Reload the extension, then hard-refresh the portal. |
| Everything filled twice / duplicate toasts | The old Auto Captcha or Portal Redesign extension is still installed. Remove it. |
| Timetable / courses empty | They are read from the original dashboard, so they appear only on `/Home/Index`. |
