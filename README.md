# Privacy Policy Viewer

Pequeña aplicación estática para mostrar políticas de privacidad de mis proyectos.

Características
- Selector de proyecto vía query string `?project=<slug>`
- Modo `only-content` mediante `?viewMode=only-content` que oculta header/footer
- Temas por proyecto usando variables CSS definidas en `js/projects.js`
- Contenido de políticas almacenado en `json/*/privacy_policy.json` y renderizado dinámicamente

Estructura
```
index.html
assets/
  image/
  svg/
css/
js/
json/
```

Cómo usar
1. Abrir `index.html` en un servidor estático (recomendado) o directamente en el navegador.
2. Para listar proyectos: abrir `/` o `index.html`.
3. Para ver una política: `index.html?project=ravem-music`.
4. Para ver solo el contenido (sin header/footer): `index.html?project=ravem-music&viewMode=only-content`.

Desarrollo
- Archivos principales:
  - `js/content.js` — lógica de navegación y renderizado
  - `js/components.js` — conversor de JSON a nodos DOM
  - `js/projects.js` — lista de proyectos y estilos por tema
- JSON de políticas: `json/<project>/privacy_policy.json`

Licencia
- Libre para uso personal y comercial.
