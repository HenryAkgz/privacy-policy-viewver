/**
 * Array inmutable de proyectos con políticas de privacidad.
 * Cada proyecto define variables CSS descriptivas para su tema.
 * Estructura de cada entrada:
 * {
 *   logo: string, // ruta al SVG del logo
 *   nombre: string,
 *   slug: string,
 *   privacyContent: string, // ruta al JSON con la política
 *   pageStyle: string // bloque CSS con variables custom
 *   storeLink: string // URL a la tienda del proyecto
 * }
 */
const PROJECTS = Object.freeze([
  {
    logo: "./svg/ravem_logo_web.svg",
    nombre: "Ravem Music",
    slug: "ravem-music",
    privacyContent: "./json/ravem/privacy_policy.json",
    storeLink: "https://akgz.dev/product/ravem_music_mobile",
    pageStyle: `
      --background-color: #16161e;
      --header-footer-background-color: #1a1b26;
      --header-breadcrumb-background-color: #105c6325;
      --paragraph-color: rgb(198, 216, 246);
      --title-color: rgb(198, 216, 246);
      --accent-color: rgb(62, 211, 211);
      --link-color: rgb(203, 113, 23);
      --scroll-thumb-color: #1b2b47;
      --scroll-thumb-hover-color: #8fb1ff;
      --footer-text-color: rgb(198, 216, 246);
    `,
  },
  {
    logo: "./svg/akgz_logo.svg",
    nombre: "Croppy",
    slug: "croppy",
    privacyContent: "./json/croppy/privacy_policy.json",
    storeLink: "https://akgz.dev/product/croppy",
    pageStyle: `
      --background-color: #0f172a;
      --header-footer-background-color: #111827;
      --header-breadcrumb-background-color: #5333d31e;
      --paragraph-color: #e5e7eb;
      --title-color: #f8fafc;
      --accent-color: #4f46e5;
      --link-color: #38bdf8;
      --scroll-thumb-color: #334155;
      --scroll-thumb-hover-color: #60a5fa;
      --footer-text-color: #e5e7eb;
    `,
  },
]);

export default PROJECTS;
