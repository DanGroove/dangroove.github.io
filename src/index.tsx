// The homepage is the static "under construction" page in public/index.html
// (styles and script in public/holding). The previous React site is kept one
// click away at /?classic and only loads there, so the homepage ships none of it.
if (document.documentElement.classList.contains('is-classic')) {
  import('./classic');
}

export {};
