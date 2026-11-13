import test from "node:test";
import assert from "node:assert/strict";
import { attribution, whatsappHref, canRelease, schema } from "../src/lib.mjs";
import { site, procedures } from "../src/site.config.mjs";
test("WhatsApp preserva telefone e codifica assunto sem permitir injeção de query", () => {
  const u = new URL(
    whatsappHref({
      label: "preenchimento labial & avaliação",
      position: "procedure",
      search: "?utm_source=instagram&utm_medium=story&utm_content=story_01",
    }),
  );
  assert.equal(u.origin, "https://wa.me");
  assert.equal(u.pathname, "/5554999507227");
  assert.equal([...u.searchParams.keys()].length, 1);
  assert.match(u.searchParams.get("text"), /labial & avaliação/);
  assert.match(u.searchParams.get("text"), /instagram\/story\/story_01/);
});
test("atribuição descarta PII e parâmetros livres", () => {
  assert.deepEqual(
    attribution(
      "?utm_source=nome@email.com&utm_medium=11999999999&utm_content=Joana&utm_campaign=depressao",
    ),
    { source: "site", medium: "organic", content: "" },
  );
});
test("Google só com registro, forma de agendar, domínio, contato de privacidade e aprovações", () => {
  assert.equal(canRelease({ ...site, hours: "" }), false, "sem a forma de agendar não publica");
  assert.equal(canRelease({ ...site, registration: "" }), false, "sem CRBM não publica");
  assert.equal(canRelease({ ...site, domain: "" }), false);
  assert.equal(canRelease({ ...site, privacyContact: "" }), false);
  for (const k of ["portraitApproved", "businessDataApproved", "clinicalCopyApproved", "legalScopeApproved", "privacyApproved"])
    assert.equal(canRelease({ ...site, [k]: false }), false, `sem ${k} não publica`);
  // Pessoa física, sem CNPJ; habilitação não exibida e sem horário fixo, por decisão do Nicolas (2026-11-13).
  assert.equal(site.companyRegistration, "");
  assert.equal(site.qualification, "");
  assert.equal(canRelease(site), true);
});
test("schema não inventa estrelas ou condição de médico", () => {
  const data = JSON.stringify(schema("https://example.org"));
  assert.ok(!data.includes("AggregateRating"));
  assert.ok(!data.includes("Physician"));
  assert.ok(!data.includes("Review"));
  assert.equal(procedures.length, 6);
  assert.deepEqual(
    procedures.map((p) => p.number),
    ["01", "02", "03", "04", "05", "06"],
  );
});
test("não inventa empresa: ela atende como pessoa física, sem razão social nem CNPJ", () => {
  assert.equal(site.companyRegistration, "");
  assert.ok(!/ltda|eireli|\bme\b|s\/a|cnpj/i.test(site.legalName));
});

import { existsSync } from "node:fs";
import { resultCaption, resultCases } from "../src/lib.mjs";
test("antes e depois: legenda exigida pelo CFBM (paciente real, TCLE, sem garantia, CRBM, habilitação)", () => {
  const legenda = resultCaption({ ...site, qualification: "Habilitação X" });
  for (const trecho of ["Paciente real", "sem filtro", "TCLE", "não é garantido", site.registration, "Habilitação X"])
    assert.ok(legenda.includes(trecho), `falta "${trecho}"`);
});
test("antes e depois: espaço reservado só na versão de revisão; publicado sem fotos, a seção some", () => {
  const pronto = {
    ...site,
    qualification: "validado",
    hours: "validado",
    results: [],
  };
  assert.equal(canRelease(pronto), true);
  assert.deepEqual(resultCases(pronto), []);
  assert.equal(resultCases({ ...pronto, hours: "" })[0].placeholder, true);
});
test("cada caso de antes e depois tem nome, descrições e os 4 arquivos preparados", () => {
  const slugs = new Set();
  for (const r of site.results) {
    assert.match(r.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(r.slug), `${r.slug} repetido`);
    slugs.add(r.slug);
    assert.ok(r.label && r.alt?.before && r.alt?.after, `${r.slug}: dados incompletos`);
    // Procedimento só como a Mariana informar (pode ficar vazio, nunca chutado); tempo depois do tratamento não vai.
    assert.equal(typeof r.procedure, "string");
    assert.ok(!r.interval, "tempo depois do tratamento não é mostrado (decisão do Nicolas)");
    for (const lado of ["antes", "depois"])
      for (const ext of ["avif", "webp"])
        assert.ok(existsSync(`public/images/resultados/${r.slug}-${lado}.${ext}`), `${r.slug}-${lado}.${ext}`);
  }
});
test("legenda sem habilitação traz nome, profissão e CRBM", () => {
  const legenda = resultCaption({ ...site, qualification: "" });
  assert.ok(legenda.includes(`${site.name} · ${site.profession} · ${site.registration}.`));
  assert.ok(!legenda.includes(" ·  ·") && !legenda.includes("undefined"));
});

import { afterClip, fiberPath, fiberPoints, fiberX, sweepOf } from "../src/experience/fiber.mjs";
test("fibra do antes e depois: começa na borda esquerda, atravessa e termina na direita", () => {
  const xs = (p) => fiberPoints(p, 0.3).map(([x]) => x);
  // Nas pontas, o que sobra do outro lado fica debaixo do corpo da fibra (12 px de largura).
  assert.ok(Math.max(...xs(0)) <= 2, "começo mostra o depois");
  assert.ok(Math.min(...xs(1)) >= 98, "fim ainda mostra o antes");
  let anterior = -Infinity;
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    const pts = fiberPoints(p, p);
    assert.ok(pts.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
    assert.ok(pts[0][1] < 0 && pts.at(-1)[1] > 100, "a fibra passa das bordas de cima e de baixo");
    for (let k = 1; k < pts.length; k++) assert.ok(pts[k][1] > pts[k - 1][1]);
    assert.ok(fiberX(p) >= anterior, "a fibra nunca volta");
    anterior = fiberX(p);
    assert.match(fiberPath(pts), /^M[\d.-]+ [\d.-]+(Q[\d. -]+)+L[\d.-]+ [\d.-]+$/);
    assert.ok(afterClip(pts).startsWith("polygon("));
  }
});
test("rolagem: primeiro a fibra desce, depois atravessa, no fim segura o depois", () => {
  assert.deepEqual(sweepOf(0), { draw: 0, p: 0 });
  assert.equal(sweepOf(0.14).draw, 1);
  assert.equal(sweepOf(0.14).p, 0);
  assert.equal(sweepOf(0.86).p, 1);
  assert.deepEqual(sweepOf(1), { draw: 1, p: 1 });
  assert.ok(sweepOf(0.5).p > 0.4 && sweepOf(0.5).p < 0.6);
});

import { scenePose } from "../src/experience/choreography.mjs";
import { createStrand, helixExtent, HELIX } from "../src/experience/helix.mjs";
test("coreografia mantém transformações finitas e enrola as fibras até a hélice", () => {
  for (const mobile of [false, true]) {
    let previous = -1;
    for (let i = 0; i <= 1000; i++) {
      const pose = scenePose(i / 1000, mobile);
      assert.ok(
        [
          ...pose.tilt,
          pose.spin,
          pose.scale,
          pose.offsetX,
          pose.offsetY,
          pose.cameraZ,
          pose.wind,
          pose.light,
        ].every(Number.isFinite),
      );
      assert.ok(pose.cameraZ > 5);
      assert.ok(pose.wind >= previous, "a hélice não se desfaz no meio");
      previous = pose.wind;
    }
    assert.equal(scenePose(0, mobile).wind, 0);
    assert.equal(scenePose(1, mobile).wind, 1);
  }
});
test("fibras do colágeno ficam finitas, fechadas nas pontas e próximas na hélice", () => {
  const strands = [0, 1, 2].map((i) => createStrand(i, 120, 12));
  for (const wind of [0, 0.5, 1]) {
    for (const s of strands) {
      s.update(wind);
      assert.ok(s.positions.every(Number.isFinite));
      assert.ok(s.normals.every(Number.isFinite));
      // The first ring collapses into a rounded tip instead of an open tube.
      const tip = s.positions.slice(0, 3);
      for (let j = 0; j < 12; j++)
        for (let k = 0; k < 3; k++)
          assert.ok(Math.abs(s.positions[j * 3 + k] - tip[k]) < 1e-6);
    }
    const ring = 60 * 12 * 3;
    const centre = (s) => {
      const c = [0, 0];
      for (let j = 0; j < 12; j++) {
        c[0] += s.positions[ring + j * 3] / 12;
        c[1] += s.positions[ring + j * 3 + 2] / 12;
      }
      return Math.hypot(...c);
    };
    const spread = Math.max(...strands.map(centre));
    if (wind === 1) assert.ok(Math.abs(spread - HELIX.tightRadius) < 0.02);
    if (wind === 0) assert.ok(spread > HELIX.tightRadius * 2);
  }
  assert.ok(strands[0].indices.every((v) => v < 121 * 12));
});
test("a medida usada para encaixar a hélice na tela contém todas as fibras", () => {
  for (const wind of [0, 0.25, 0.5, 0.75, 1]) {
    const { length, diameter } = helixExtent(wind);
    for (const i of [0, 1, 2]) {
      const s = createStrand(i, 120, 12);
      s.update(wind);
      for (let v = 0; v < s.positions.length; v += 3) {
        assert.ok(Math.abs(s.positions[v + 1]) <= length / 2 + 1e-6);
        assert.ok(Math.hypot(s.positions[v], s.positions[v + 2]) <= diameter / 2 + 1e-6);
      }
    }
  }
});
