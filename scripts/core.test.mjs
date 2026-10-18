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
test("versão incompleta não permite indexação de produção", () => {
  assert.equal(canRelease(site), false);
  assert.equal(
    canRelease({
      ...site,
      registration: "validado",
      companyRegistration: "validado",
      qualification: "validado",
      hours: "validado",
      domain: "https://example.org",
      privacyContact: "validado",
      portraitApproved: true,
      businessDataApproved: true,
      clinicalCopyApproved: true,
      legalScopeApproved: true,
      privacyApproved: true,
    }),
    true,
  );
});
test("schema não inventa estrelas ou condição de médico", () => {
  const data = JSON.stringify(schema("https://example.org"));
  assert.ok(!data.includes("AggregateRating"));
  assert.ok(!data.includes("Physician"));
  assert.ok(!data.includes("Review"));
  assert.equal(procedures.length, 5);
});

import { scenePose } from "../src/experience/choreography.mjs";
import { createStrand, HELIX } from "../src/experience/helix.mjs";
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
