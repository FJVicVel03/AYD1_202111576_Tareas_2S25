# SeguridadGT - Prototipo Frontend

Prototipo de experiencia web construido con Next.js para visualizar la iniciativa de seguridad ciudadana en Guatemala. Incluye vistas conceptuales que representan el observatorio de datos, la ruta digital de denuncias y la red de colaboracion comunitaria.

## Requisitos

- Node.js 18 o superior
- npm 9+ o yarn

## Instalacion

```bash
npm install
```

## Scripts disponibles

- `npm run dev` - Inicia el entorno de desarrollo en `http://localhost:3000`.
- `npm run build` - Genera la version optimizada para produccion.
- `npm run start` - Ejecuta la aplicacion compilada.
- `npm run lint` - Revisa la calidad del codigo con ESLint.
- `npm run export:docs` - Genera la version estatica en la carpeta `../docs` (raiz del repo) lista para GitHub Pages y crea `.nojekyll`.

## Arquitectura del prototipo

- `pages/index.js` - Pagina principal con vision general, modulos clave y alertas recientes.
- `pages/observatorio.js` - Panel del observatorio con tableros de analisis e indicadores criticos.
- `pages/denuncias.js` - Flujo avanzado para denuncias anonimas o con perfil, limpieza de metadatos, validacion anti-fraude, boton de emergencia y asistente virtual IA.
- `pages/colaboracion.js` - Estrategia de alianzas, hoja de ruta y resultados comunitarios.
- `pages/perfil.js` - Tablero personal con control de identidad, seguimiento de casos y auditoria de coincidencias IA.
- `pages/mockups.js` - Galeria de mockups con filtros por orientacion y visor con zoom.
- `public/mockups/*.svg` - Conjunto de mockups estaticos (desktop y mobile) listos para descargar.
- `components/SectionHeader.js` y `components/Layout.js` - Componentes compartidos para mantener consistencia visual.
- `styles/*` - Hojas de estilos modulares para cada vista.
- Documentacion adicional en `docs/Plan_Agil_SeguridadGT.md` con MVP, roadmap incremental, historias de usuario y KPIs sugeridos.

## Proximos pasos sugeridos

1. Conectar las vistas con datos reales o servicios mock (APIs, archivos JSON).
2. Integrar autenticacion para perfiles institucionales y comunitarios.
3. Anadir diseno responsivo avanzado y pruebas de usabilidad con personas usuarias finales.
4. Seguir el roadmap descrito en `docs/Plan_Agil_SeguridadGT.md` para priorizar el MVP y preparar la expansion.

## Despliegue en GitHub Pages

Este proyecto esta configurado para exportarse como sitio estatico y publicarse desde la carpeta `docs` en la raiz del repositorio:

1. Desde `front-magistral/`, ejecuta:
   - `npm install`
   - `npm run export:docs`
2. Confirma que se creo la carpeta `docs/` en la raiz del repo (`AYD1_202111576_Tareas_2S25/docs`).
3. Haz commit y push de los cambios a la rama `main`.
4. En GitHub > Settings > Pages, configura:
   - Source: `Deploy from a branch`
   - Branch: `main` / Folder: `/docs`
5. Tu sitio quedara disponible en `https://<tu-usuario>.github.io/AYD1_202111576_Tareas_2S25/`.

Notas:
- El archivo `.nojekyll` se genera automaticamente para que GitHub Pages sirva la carpeta `/_next/`.
- Los `basePath` y `assetPrefix` estan ajustados automaticamente para entorno de produccion.
