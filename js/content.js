/**
 * Módulo principal de control de vistas y navegación.
 * - Carga el listado de proyectos.
 * - Renderiza la pantalla de aterrizaje o la política seleccionada.
 * - Gestiona el modo "only-content" a través del parámetro `viewMode`.
 */
import getComponent from "../js/components.js";
import PROJECTS from "./projects.js";

const mainContainer = document.getElementById("main_content_container");
const landingContainer = document.getElementById("landing_container");
const projectsGrid = document.getElementById("projects_grid");
const logoHeader = document.querySelector(".logo_header");
const breadcrumbNav = document.getElementById("breadcrumb_nav");
const breadcrumbProject = document.getElementById("breadcrumb_project");
const pageHeader = document.querySelector("header");
const pageFooter = document.querySelector("footer");
let activeOnlyContent = false;

/**
 * Devuelve el valor del parámetro `project` en la URL en minúsculas.
 * @returns {string} slug del proyecto o cadena vacía si no existe
 */
function getProjectSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("project")?.toString().toLowerCase() ?? "";
}

/**
 * Determina si la vista debe mostrarse en modo "solo contenido".
 * Este modo se activa únicamente con el searchParam `viewMode=only-content`.
 * @returns {boolean}
 */
function isOnlyContentMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("viewMode") === "only-content";
}

/**
 * Aplica las variables CSS definidas en el objeto `project` y actualiza el título.
 * @param {object} project - Objeto del proyecto con la propiedad `pageStyle`.
 */
function applyProjectStyles(project) {
  if (!project?.pageStyle) {
    return;
  }

  document.documentElement.style.cssText += project.pageStyle;
  document.title = `Política de Privacidad - ${project.nombre}`;
}

/**
 * Establece la ruta del logo que aparece en el header y asocia el enlace de tienda.
 * Si se proporciona `storeLink`, el logo se convierte en un enlace que abre en nueva pestaña.
 * @param {string} logoPath - Ruta relativa del archivo SVG/imagen.
 * @param {string} [storeLink] - URL de la página del producto (opcional).
 */
function setLogoHeader(logoPath, storeLink) {
  if (logoHeader && logoPath) {
    logoHeader.src = logoPath;

    if (storeLink) {
      logoHeader.dataset.storeLink = storeLink;
      logoHeader.style.cursor = "pointer";
      logoHeader.onclick = () => {
        try {
          window.open(storeLink, "_blank");
        } catch (e) {
          // fallback a navegación en la misma pestaña
          window.location.href = storeLink;
        }
      };
    } else {
      delete logoHeader.dataset.storeLink;
      logoHeader.style.cursor = "";
      logoHeader.onclick = null;
    }
  }
}

/**
 * Busca y devuelve el objeto `project` correspondiente al slug en la URL.
 * @returns {object|null} objeto del proyecto o null si no se encuentra
 */
function selectProject() {
  const projectSlug = getProjectSlug();
  if (!projectSlug) {
    return null;
  }

  return PROJECTS.find((item) => item.slug === projectSlug) ?? null;
}

/**
 * Muestra la pantalla de aterrizaje con la lista de proyectos.
 * Restaura el header/footer y oculta el contenedor principal.
 */
function showLanding() {
  activeOnlyContent = false;
  document.body.classList.remove("only-content");

  if (pageHeader) {
    pageHeader.style.display = "";
  }
  if (pageFooter) {
    pageFooter.style.display = "";
  }

  landingContainer.style.display = "flex";
  mainContainer.style.display = "none";
  breadcrumbNav.style.display = "none";
  logoHeader.style.display = "none";

  projectsGrid.innerHTML = "";

  PROJECTS.forEach((project) => {
    const card = document.createElement("a");
    card.className = "project_card";
    card.href = `./?project=${project.slug}`;

    const name = document.createElement("h2");
    name.className = "project_name";
    name.textContent = project.nombre;

    const description = document.createElement("p");
    description.className = "project_description";
    description.textContent = "Ver política de privacidad";

    card.appendChild(name);
    card.appendChild(description);
    projectsGrid.appendChild(card);
  });
}

/**
 * Configura la vista de la política para un `project` dado.
 * - Oculta la landing.
 * - Aplica estilos y logo del proyecto.
 * - Si `viewMode=only-content`, oculta header/footer y breadcrumbs.
 * @param {object} project
 */
function showPolicy(project) {
  landingContainer.style.display = "none";
  mainContainer.style.display = "flex";
  breadcrumbProject.textContent = project.nombre;
  setLogoHeader(project.logo, project.storeLink);
  applyProjectStyles(project);

  const onlyContent = isOnlyContentMode();

  if (onlyContent) {
    activeOnlyContent = true;
    document.body.classList.add("only-content");

    if (pageHeader) {
      pageHeader.style.display = "none";
    }
    if (pageFooter) {
      pageFooter.style.display = "none";
    }
    breadcrumbNav.style.display = "none";
    logoHeader.style.display = "none";
    window.history.pushState({ onlyContent: true }, "", window.location.href);
  } else {
    activeOnlyContent = false;
    document.body.classList.remove("only-content");

    if (pageHeader) {
      pageHeader.style.display = "";
    }
    if (pageFooter) {
      pageFooter.style.display = "";
    }
    breadcrumbNav.style.display = "flex";
    logoHeader.style.display = "block";
  }
}

// Maneja clics en breadcrumb para volver a la landing
document.addEventListener("click", (e) => {
  if (e.target.closest(".breadcrumb_item")) {
    e.preventDefault();
    window.history.pushState(null, "", "./");
    showLanding();
  }
});

// Evita retroceder del modo only-content si está activo (mantiene el estado en el hist.)
window.addEventListener("popstate", () => {
  if (activeOnlyContent) {
    window.history.pushState({ onlyContent: true }, "", window.location.href);
  }
});

/**
 * Lee el JSON de la política de privacidad del `project`.
 * Devuelve un objeto con la propiedad `data` o `{ data: [] }` en error.
 * @param {object} project
 * @returns {Promise<object>} respuesta JSON o objeto vacío en error
 */
async function readJson(project) {
  if (!project?.privacyContent) {
    console.error("Proyecto sin ruta de contenido definida");
    return { data: [] };
  }

  const data = await fetch(project.privacyContent)
    .then((res) => res.json())
    .catch(() => {
      console.log(`Error cargando política de privacidad de ${project.nombre}`);
      return { data: [] };
    });

  return data;
}

/**
 * Construye los nodos DOM a partir del JSON de contenido usando `getComponent()`.
 * @param {object} project
 * @returns {Promise<HTMLElement[]>} array de nodos listos para insertar
 */
async function buildContentView(project) {
  const data = await readJson(project).then((res) => res["data"] ?? []);

  const contentNodes = data.map((item) => {
    return getComponent(item);
  });

  return contentNodes;
}

/**
 * Renderiza en el contenedor principal los nodos generados para la política.
 * @param {object} project
 */
async function showPrivacyPolicy(project) {
  mainContainer.innerHTML = "";
  const nodes = await buildContentView(project);

  if (Array.isArray(nodes)) {
    nodes.forEach((item) => {
      mainContainer.appendChild(item);
    });
  }
}

/**
 * Punto de entrada: detecta el proyecto en la URL y muestra la vista apropiada.
 */
async function init() {
  const project = selectProject();

  if (!project) {
    showLanding();
  } else {
    showPolicy(project);
    await showPrivacyPolicy(project);
  }
}

init();
