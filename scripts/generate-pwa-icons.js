const sharp = require("sharp");
const fs = require("fs");

const BRAND_BLUE = "#003bc6";
const SOURCE = "public/liferank_logo.png";
const CROP = { left: 95, top: 345, width: 285, height: 350 };

async function makeSilhouette() {
  const extracted = await sharp(SOURCE).extract(CROP).toBuffer();
  const cropped = await sharp(extracted).trim({ threshold: 10 }).toBuffer();

  const { data, info } = await sharp(cropped)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const luminance = (r + g + b) / 3;
    const WHITE_THRESHOLD = 210;
    let alpha;
    if (luminance <= WHITE_THRESHOLD) {
      alpha = 255;
    } else {
      alpha = Math.round((255 * (255 - luminance)) / (255 - WHITE_THRESHOLD));
    }
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = alpha;
  }

  return { buffer: out, width, height };
}

async function makeIcon(silhouette, canvasSize, paddingRatio, outPath) {
  const padding = Math.round(canvasSize * paddingRatio);
  const targetSize = canvasSize - padding * 2;

  const resizedSilhouette = await sharp(silhouette.buffer, {
    raw: { width: silhouette.width, height: silhouette.height, channels: 4 },
  })
    .resize(targetSize, targetSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: resizedSilhouette, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync("public/icons", { recursive: true });
  const silhouette = await makeSilhouette();

  await makeIcon(silhouette, 192, 0.18, "public/icons/icon-192.png");
  await makeIcon(silhouette, 512, 0.18, "public/icons/icon-512.png");
  // Maskable icons need extra safe-zone padding since OS platforms crop to a circle/shape.
  await makeIcon(silhouette, 512, 0.28, "public/icons/icon-maskable-512.png");
  await makeIcon(silhouette, 180, 0.16, "public/apple-touch-icon.png");

  console.log("Icons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
