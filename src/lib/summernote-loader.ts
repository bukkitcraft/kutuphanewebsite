/** Summernote Lite + jQuery (CDN): npm paketi postinstall hatasi verdiginden pinli surumler buradan yuklenir. */

const JQUERY_URL = "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js";
const SUMMERNOTE_LITE_CSS =
  "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css";
const SUMMERNOTE_LITE_JS =
  "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js";

function loadCssOnce(href: string, marker: string) {
  if (document.querySelector(`link[${marker}]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute(marker, "true");
  document.head.appendChild(link);
}

function loadScriptOnce(src: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    if ((existing as HTMLScriptElement & { __loaded?: boolean }).__loaded) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(src)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      (script as HTMLScriptElement & { __loaded?: boolean }).__loaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Script load failed: ${src}`));
    document.body.appendChild(script);
  });
}

let loadPromise: Promise<JQueryStatic> | null = null;

export function loadSummernoteLite(): Promise<JQueryStatic> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Summernote only runs in the browser."));
  }

  const w = window as Window & { jQuery?: JQueryStatic };
  if (w.jQuery?.fn && typeof (w.jQuery.fn as { summernote?: unknown }).summernote === "function") {
    return Promise.resolve(w.jQuery);
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      loadCssOnce(SUMMERNOTE_LITE_CSS, "data-summernote-lite-css");
      await loadScriptOnce(JQUERY_URL);
      await loadScriptOnce(SUMMERNOTE_LITE_JS);

      const $ = (window as Window & { jQuery?: JQueryStatic }).jQuery;
      if (!$?.fn || typeof ($.fn as { summernote?: unknown }).summernote !== "function") {
        throw new Error("Summernote did not attach to jQuery.");
      }
      return $;
    })().catch((err) => {
      loadPromise = null;
      throw err;
    });
  }

  return loadPromise;
}
