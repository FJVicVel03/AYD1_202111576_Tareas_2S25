/*
  Post-export: mueve la carpeta ./out a ../docs en la raiz del repo
  y crea el archivo .nojekyll requerido por GitHub Pages.
*/
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..'); // front-magistral
const outDir = path.join(projectRoot, 'out');
const docsDir = path.resolve(projectRoot, '..', 'docs'); // repo raiz /docs

const rmIfExists = (p) => {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (_) {}
};

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

const copyRecursive = (src, dest) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (!fs.existsSync(outDir)) {
  console.error('No se encontro la carpeta ./out. ¿Fallo `next export`?');
  process.exit(1);
}

// Limpiar docs y copiar contenido
rmIfExists(docsDir);
ensureDir(docsDir);
copyRecursive(outDir, docsDir);

// Crear .nojekyll para servir _next y rutas con underscores
const noJekyllPath = path.join(docsDir, '.nojekyll');
fs.writeFileSync(noJekyllPath, '');

console.log(`Export copiado a: ${docsDir}`);

// Limpiar ./out despues de copiar
rmIfExists(outDir);

