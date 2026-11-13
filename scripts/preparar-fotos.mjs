// Prepara um caso de antes e depois para o site: mesmo corte nas duas fotos (4:5, centro), sem NENHUM
// metadado (localização, aparelho, data) e em AVIF/WebP de 600 e 1200 px, leves para o celular.
// Os originais ficam fora deste repositório, que é público; só estes arquivos entram em public/.
// Não mexe em cor nem em pele: nada de filtro ou retoque (Código de Ética da Biomedicina, Res. CFBM 330/2020).
//
//   npm i --no-save sharp
//   node scripts/preparar-fotos.mjs <antes.jpg> <depois.jpg> <slug-do-caso>
//
// Depois, acrescente o caso em `results` no src/site.config.mjs (o script mostra o trecho).
import { mkdirSync } from "node:fs";
import path from "node:path";

const [antes, depois, slug] = process.argv.slice(2);
if (!antes || !depois || !/^[a-z0-9-]+$/.test(slug ?? "")) {
  console.error("uso: node scripts/preparar-fotos.mjs <antes.jpg> <depois.jpg> <slug-em-minusculas>");
  process.exit(2);
}
const { default: sharp } = await import("sharp").catch(() => {
  console.error("instale antes: npm i --no-save sharp");
  process.exit(2);
});

const out = path.join("public", "images", "resultados");
mkdirSync(out, { recursive: true });
const gerados = [];
for (const [arquivo, lado] of [
  [antes, "antes"],
  [depois, "depois"],
]) {
  for (const largura of [600, 1200]) {
    // rotate() aplica a orientação da câmera; o sharp não copia metadados a menos que se peça.
    const base = sharp(arquivo).rotate().resize(largura, Math.round(largura * 1.25), { fit: "cover", position: "centre" });
    const nome = path.join(out, `${slug}-${lado}-${largura}`);
    await base.clone().avif({ quality: 58, effort: 6 }).toFile(`${nome}.avif`);
    await base.clone().webp({ quality: 80 }).toFile(`${nome}.webp`);
    gerados.push(`${nome}.avif`, `${nome}.webp`);
  }
}
// Confere: nenhum arquivo gerado pode carregar EXIF, XMP ou IPTC.
for (const g of gerados) {
  const m = await sharp(g).metadata();
  if (m.exif || m.xmp || m.iptc) throw new Error(`${g} ainda tem metadados`);
}
console.log(`${gerados.length} arquivos em ${out}, sem metadados.`);
console.log(`Acrescente em results (src/site.config.mjs):
  {
    slug: "${slug}",
    procedure: "<procedimento>",
    interval: "<ex.: 30 dias depois>",
    alt: { before: "<descrição da foto do antes>", after: "<descrição da foto do depois>" },
  },`);
