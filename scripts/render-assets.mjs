// Renders the helix fallback posters, the hero avatar and the Open Graph card.
// Optional, not part of the build: npm i --no-save puppeteer-core && node scripts/render-assets.mjs
// Needs a local Chrome or Edge (or CHROME_PATH).
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { createServer } from "vite";
import puppeteer from "puppeteer-core";

const executablePath = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));
if (!executablePath) throw new Error("Chrome/Edge não encontrado; defina CHROME_PATH.");

const server = await createServer({
  server: { port: 5199, strictPort: true },
  logLevel: "error",
});
await server.listen();
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5199/scripts/render-assets.html");
  await page.waitForFunction("window.assetsReady === true", { timeout: 60000 });
  const save = (name, dataUrl) =>
    fs.writeFile(`public/images/${name}`, Buffer.from(dataUrl.split(",")[1], "base64"));
  const posters = [
    ["helix-loose.webp", { wind: 0, spin: -0.3, width: 1200, height: 1300 }],
    ["helix-loose-small.webp", { wind: 0, spin: -0.3, width: 600, height: 650 }],
    ["helix-mid.webp", { wind: 0.5, spin: 0.66, width: 1000, height: 1100 }],
    ["helix-tight.webp", { wind: 1, spin: 1.76, width: 1000, height: 1100 }],
  ];
  for (const [name, options] of posters)
    await save(name, await page.evaluate((o) => window.renderHelix(o), options));
  await save("mariana-avatar.webp", await page.evaluate(() => window.avatar()));
  const helix = await page.evaluate(() =>
    window.renderHelix({ wind: 1, spin: 1.2, tilt: [-0.1, -0.5], width: 700, height: 760 }),
  );
  await page.setViewport({ width: 1200, height: 630 });
  await page.evaluate((src) => window.og(src), helix);
  const card = await page.$("#og > div");
  await card.screenshot({ path: "public/images/og-mariana.jpg", type: "jpeg", quality: 88 });
  console.log("Assets em public/images atualizados.");
} finally {
  await browser.close();
  await server.close();
}
