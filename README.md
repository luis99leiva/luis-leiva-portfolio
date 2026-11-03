# Luis Leiva · Portfolio

Static site (HTML, CSS, JavaScript). No build step, no framework. Dark theme (warm espresso surfaces, cream text and buttons) with the layout matched to the Claura template: 1072px content column, cream bands, Halant serif headlines, Geist body, soft-focus flower photography with grain, glass stat cards, and blur-on-hover project cards.

Photo credits are in `CREDITS.md`.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `projects.html` | All projects |
| `tufinanciera.html` | Tu Financiera case study |
| `design-system.html` | Design System case study |
| `fitflex.html` | FitFlex case study |
| `about.html` | About |
| `contact.html` | Contact |

Shared files: `assets/css/styles.css`, `assets/js/main.js`, images in `assets/img/` (WebP).

## Publish on GitHub Pages

1. Create a repository and upload everything in this folder (keep the folder structure).
2. In the repository: Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. After a minute the site is live at `https://<your-user>.github.io/<repo>/`.

To preview locally, open `index.html` in a browser.

## Change the look

All colors, fonts, radii and spacing are variables in `styles.css`. The site is dark only, with no light/dark switch. The original cream (light) colors are kept as a hidden comment at the top of `styles.css` if you ever want them back.

## Add prototype videos (Amy La style)

Every phone on the site is a `.phone` frame. To turn a screenshot into a looping prototype clip, replace the `<img>` inside it with:

```html
<div class="phone">
  <video data-autoplay muted loop playsinline preload="none"
         poster="assets/img/tf-screen-home.webp">
    <source src="assets/video/tf-onboarding.mp4" type="video/mp4">
  </video>
</div>
```

`main.js` already plays clips only while they are on screen and pauses them when they leave. Keep clips 5 to 10 seconds, one interaction each, MP4 (H.264), about 1 to 3 MB.

## Contact form

GitHub Pages can't receive form submissions, so "Send message" opens the visitor's email app with the message already written, addressed to luis99leiva@gmail.com.

## Share previews

Each page has its own title and description. The share image (`og:image`) uses a relative path; once you know the final URL, change it to the full address (for example `https://<your-user>.github.io/<repo>/assets/img/og.jpg`) so LinkedIn and WhatsApp show the preview.
