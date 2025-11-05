// Node script para processar a logo: remove fundo branco (tolerância),
// gera PNG transparente em múltiplos tamanhos e salva nos diretórios do app.
// Uso:
//   node scripts/process-logo.mjs caminho/para/imagem_entrada.(jpg|png)
// Saídas:
//   - src/assets/logo.png (1024px, quadrado, transparente)
//   - public/logo-512.png
//   - public/logo-256.png

import fs from 'node:fs';
import path from 'node:path';
import Jimp from 'jimp';

const rootDir = process.cwd();
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Erro: informe o caminho da imagem de entrada. Ex.: node scripts/process-logo.mjs assets_src/bp-logo.jpg');
  process.exit(1);
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

function isNearWhite(r, g, b, tolerance = 18) {
  // Considera branco e tons muito claros como fundo
  return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
}

async function removeWhiteBackground(image) {
  const { width, height } = image.bitmap;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = image.bitmap.data[idx + 0];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      const a = image.bitmap.data[idx + 3];
      if (a !== 0 && isNearWhite(r, g, b)) {
        image.bitmap.data[idx + 3] = 0; // Transparente
      }
    }
  }
  return image;
}

async function padToSquare(image, paddingRatio = 0.12) {
  const { width, height } = image.bitmap;
  const size = Math.max(width, height);
  const padding = Math.round(size * paddingRatio);
  const canvasSize = size + padding * 2;

  const canvas = await new Jimp(canvasSize, canvasSize, 0x00000000); // transparente
  const x = Math.round((canvasSize - width) / 2);
  const y = Math.round((canvasSize - height) / 2);
  canvas.composite(image, x, y);
  return canvas;
}

async function main() {
  const absInput = path.isAbsolute(inputPath) ? inputPath : path.join(rootDir, inputPath);
  if (!fs.existsSync(absInput)) {
    console.error('Arquivo não encontrado:', absInput);
    process.exit(1);
  }

  const img = await Jimp.read(absInput);
  img.rgba(true);

  // Remove fundo claro
  await removeWhiteBackground(img);

  // Ajusta contraste/claridade leve para logos
  img.contrast(0.05);

  // Centraliza em canvas quadrado com padding
  const squared = await padToSquare(img, 0.15);

  // Saídas
  const assetsDir = path.join(rootDir, 'src', 'assets');
  const publicDir = path.join(rootDir, 'public');
  await ensureDir(assetsDir);
  await ensureDir(publicDir);

  // 1024px base
  const base = squared.clone().contain(1024, 1024, Jimp.RESIZE_BICUBIC);
  await base.writeAsync(path.join(assetsDir, 'logo.png'));

  // 512 e 256 para público (favicons/imagens)
  await squared.clone().contain(512, 512, Jimp.RESIZE_BICUBIC).writeAsync(path.join(publicDir, 'logo-512.png'));
  await squared.clone().contain(256, 256, Jimp.RESIZE_BICUBIC).writeAsync(path.join(publicDir, 'logo-256.png'));

  console.log('Logo processada com sucesso:');
  console.log('- src/assets/logo.png');
  console.log('- public/logo-512.png');
  console.log('- public/logo-256.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


