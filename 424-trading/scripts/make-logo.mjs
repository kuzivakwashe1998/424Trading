// Turns the supplied brand JPEG (flat light background) into transparent PNG
// assets: logo.png (full), logo-mark.png (triangles), logo-wordmark.png (text),
// favicon.png (64px mark).
import sharp from "sharp";

const SRC = "/home/user/uploads/WhatsApp Image 2026-09-11 at 17.52.00.jpeg";
const OUT = "/home/user/424-trading/public/media";

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log("source", width, height, channels);

// background = average of the four corners
const px = (x, y) => {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2]];
};
const corners = [px(0, 0), px(width - 1, 0), px(0, height - 1), px(width - 1, height - 1)];
const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / 4);
console.log("background", bg.map((v) => Math.round(v)).join(","));

for (let i = 0; i < data.length; i += channels) {
  const d = Math.sqrt(
    (data[i] - bg[0]) ** 2 + (data[i + 1] - bg[1]) ** 2 + (data[i + 2] - bg[2]) ** 2
  );
  const a = d <= 30 ? 0 : d >= 70 ? 255 : Math.round(((d - 30) / 40) * 255);
  data[i + 3] = a;
}

const transparent = await sharp(Buffer.from(data), {
  raw: { width, height, channels },
}).png().toBuffer();

await sharp(transparent).toFile(`${OUT}/logo.png`);

const markRaw = await sharp(transparent)
  .extract({
    left: Math.round(width * 0.24),
    top: Math.round(height * 0.24),
    width: Math.round(width * 0.52),
    height: Math.round(height * 0.31),
  })
  .png()
  .toBuffer();
const mark = await sharp(markRaw).trim().png().toBuffer();
await sharp(mark).toFile(`${OUT}/logo-mark.png`);
await sharp(mark).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(`${OUT}/favicon.png`);

const wordRaw = await sharp(transparent)
  .extract({
    left: Math.round(width * 0.04),
    top: Math.round(height * 0.55),
    width: Math.round(width * 0.92),
    height: Math.round(height * 0.21),
  })
  .png()
  .toBuffer();
const wordmark = await sharp(wordRaw).trim().png().toBuffer();
await sharp(wordmark).toFile(`${OUT}/logo-wordmark.png`);

for (const f of ["logo-mark.png", "logo-wordmark.png"]) {
  const m = await sharp(`${OUT}/${f}`).metadata();
  console.log(f, m.width, m.height);
}
console.log("done");
