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
test("coreografia mantém transformações finitas em todos os quadros e recompõe a escultura", () => {
  for (const mobile of [false, true]) {
    for (let i = 0; i <= 1000; i++) {
      const pose = scenePose(i / 1000, mobile);
      assert.ok(
        [
          ...pose.rotation,
          pose.scale,
          pose.offsetX,
          pose.offsetY,
          pose.cameraZ,
          pose.explode,
          pose.light,
        ].every(Number.isFinite),
      );
      assert.ok(pose.cameraZ > 5);
      assert.ok(pose.explode >= 0 && pose.explode <= 1);
    }
    assert.equal(scenePose(0, mobile).explode, 0);
    assert.equal(scenePose(1, mobile).explode, 0);
    assert.ok(scenePose(0.75, mobile).explode > 0.95);
  }
});
