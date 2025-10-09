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

## Arquitectura del prototipo

- `pages/index.js` - Pagina principal con vision general, modulos clave y alertas recientes.
- `pages/observatorio.js` - Panel del observatorio con tableros de analisis e indicadores criticos.
- `pages/denuncias.js` - Flujo conceptual para iniciar denuncias digitales y recibir acompanamiento.
- `pages/colaboracion.js` - Estrategia de alianzas, hoja de ruta y resultados comunitarios.
- `pages/mockups.js` - Galeria de mockups con filtros por orientacion y visor con zoom.
- `public/mockups/*.svg` - Conjunto de mockups estaticos (desktop y mobile) listos para descargar.
- `components/SectionHeader.js` y `components/Layout.js` - Componentes compartidos para mantener consistencia visual.
- `styles/*` - Hojas de estilos modulares para cada vista.

## Proximos pasos sugeridos

1. Conectar las vistas con datos reales o servicios mock (APIs, archivos JSON).
2. Integrar autenticacion para perfiles institucionales y comunitarios.
3. Anadir diseno responsivo avanzado y pruebas de usabilidad con personas usuarias finales.
