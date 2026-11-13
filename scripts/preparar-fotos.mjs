// Prepara um caso de antes e depois para o site: o mesmo recorte 2:3 nas duas fotos, sem NENHUM metadado
// (localização, aparelho, data), em AVIF e WebP de até 1200 px de largura, sem aumentar a resolução.
// Os originais ficam fora deste repositório, que é público; só estes arquivos entram em public/.
// Não mexe em cor nem em pele: nada de filtro ou retoque (Código de Ética da Biomedicina, Res. CFBM 330/2020).
//
//   npm i --no-save sharp
//   node scripts/preparar-fotos.mjs <antes.jpg> <depois.jpg> <slug> [--topo=0.3]
//   node scripts/preparar-fotos.mjs --montagem <antes-e-depois.jpg> <slug> [--topo=0.3]
//
// --montagem: uma imagem com o antes à esquerda e o depois à direita, separados por uma faixa branca
// (como a clínica costuma mandar). O script acha a faixa e usa a mesma largura nas duas metades.
// --topo: onde fica o recorte na vertical (0 = topo, 1 = base); ajuste para o rosto ficar inteiro.
//
// Depois, acrescente o caso em `results` no src/site.config.mjs (o script mostra o trecho).
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const topo = Number(args.find((a) => a.startsWith("--topo="))?.slice(7) ?? 0.3);
const pos = args.filter((a) => !a.startsWith("--topo="));
const montagem = pos[0] === "--montagem";
const [a, b, c] = montagem ? pos.slice(1) : pos;
const slug = montagem ? b : c;
if (!a || (!montagem && !b) || !/^[a-z0-9-]+$/.test(slug ?? "") || !(topo >= 0 && topo <= 1)) {
  console.error("uso: preparar-fotos.mjs <antes> <depois> <slug> [--topo=0.3]  |  --montagem <imagem> <slug> [--topo=0.3]");
  process.exit(2);
}
const { default: sharp } = await import("sharp").catch(() => {
  console.error("instale antes: npm i --no-save sharp");
  process.exit(2);
});

/** Coluna branca contínua perto do meio da montagem: [início, fim]. */
async function faixaBranca(arquivo) {
  const { data, info } = await sharp(arquivo).rotate().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const brancas = [];
  for (let x = Math.round(W * 0.35); x < Math.round(W * 0.65); x++) {
    let soma = 0;
    for (let y = 0; y < H; y++) soma += data[y * W + x];
    if (soma / H > 245) brancas.push(x);
  }
  if (!brancas.length) throw new Error("não achei a faixa branca entre o antes e o depois");
  return { W, H, de: brancas[0], ate: brancas.at(-1) };
}

/** Recorte 2:3 dentro de uma região: largura toda, altura escolhida por `topo` (ou o contrário se a região for larga). */
function recorte(left, width, H) {
  if (H >= width * 1.5) {
    const h = Math.round(width * 1.5);
    return { left, top: Math.round((H - h) * topo), width, height: h };
  }
  const w = Math.round(H / 1.5);
  return { left: left + Math.round((width - w) / 2), top: 0, width: w, height: H };
}

const lados = [];
if (montagem) {
  const { W, H, de, ate } = await faixaBranca(a);
  const largura = Math.min(de, W - ate - 1);
  lados.push(["antes", a, recorte(0, largura, H)], ["depois", a, recorte(ate + 1, largura, H)]);
} else {
  for (const [lado, arquivo] of [
    ["antes", a],
    ["depois", b],
  ]) {
    const m = await sharp(arquivo).rotate().metadata();
    const [W, H] = (m.orientation ?? 1) >= 5 ? [m.height, m.width] : [m.width, m.height];
    lados.push([lado, arquivo, recorte(0, W, H)]);
  }
}

const out = path.join("public", "images", "resultados");
mkdirSync(out, { recursive: true });
const gerados = [];
for (const [lado, arquivo, box] of lados) {
  // rotate() aplica a orientação da câmera; o sharp não copia metadados a menos que se peça.
  const base = sharp(arquivo).rotate().extract(box).resize({ width: Math.min(box.width, 1200), withoutEnlargement: true });
  const nome = path.join(out, `${slug}-${lado}`);
  await base.clone().avif({ quality: 60, effort: 6 }).toFile(`${nome}.avif`);
  await base.clone().webp({ quality: 82 }).toFile(`${nome}.webp`);
  gerados.push(`${nome}.avif`, `${nome}.webp`);
  console.log(`${lado}: recorte ${box.width}x${box.height} a partir de x=${box.left}, y=${box.top}`);
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
    label: "<nome curto do caso, ex.: Caso 1 · frente>",
    procedure: "<procedimento, se souber>",
    interval: "<ex.: 30 dias depois, se souber>",
    alt: { before: "<descrição da foto do antes>", after: "<descrição da foto do depois>" },
  },`);
