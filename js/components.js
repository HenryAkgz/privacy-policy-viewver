/**
 * Devuelve un nodo DOM según el tipo de componente descrito en `data`.
 * Soporta tipos: `group` y `paragraph`.
 * @param {object} data - Objeto con la estructura del componente.
 * @returns {HTMLElement}
 */
function getComponent(data) {
  switch (data["type"]) {
    case "group":
      return groupComponent(data["title_group"], data["content"]);
    case "paragraph":
      return richParagraph(data["content"]);
  }
}

/**
 * Crea un contenedor de grupo que puede incluir un título y elementos hijos.
 * @param {string} title - Título del grupo (opcional).
 * @param {Array} content - Array de elementos hijos (component descriptions).
 * @returns {HTMLElement} contenedor del grupo
 */
function groupComponent(title, content) {
  const container = document.createElement("div");
  container.className = "content_group_container";

  if (title) {
    const titleGroup = document.createElement("h1");
    titleGroup.className = "title_group";
    titleGroup.textContent = title;
    container.appendChild(titleGroup);
  }

  if (content && Array.isArray(content)) {
    const contentContainer = document.createElement("div");
    contentContainer.className = "group_content_container";

    content.forEach((item) => {
      const paragraph = getComponent(item);
      contentContainer.appendChild(paragraph);
    });

    container.appendChild(contentContainer);
  }

  return container;
}

/**
 * Crea un párrafo con contenido enriquecido (HTML mínimo permitido).
 * @param {string} content - Texto en bruto con marcadores para formato/link.
 * @returns {HTMLElement} elemento <p>
 */
function richParagraph(content) {
  const paragraph = document.createElement("p");
  paragraph.className = "richParagraph";

  const text = richText(content);

  paragraph.innerHTML = text;

  return paragraph;
}

/**
 * Aplica transformaciones simples al texto para convertir marcadores en HTML:
 * - *texto* -> <span class="span_text">texto</span>
 * - <####url>texto<####> -> enlace externo
 * @param {string} text
 * @returns {string} texto con HTML seguro mínimo
 */
function richText(text) {
  let richText = text;

  if (text) {
    richText = richText.replace(
      /\*(.*?)\*/g,
      '<span class="span_text">$1</span>'
    );
    richText = richText.replace(
      /<####(.*?)>(.*?)<####>/g,
      '<a class="link_tag" href="$1" target="_blank">$2</a>'
    );
  }

  return richText;
}

export default getComponent;
