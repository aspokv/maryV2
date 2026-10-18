import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const React = await import("react");
  const { renderToString } = await import("react-dom/server");
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  const { site, procedures } = await import("../src/site.config.mjs");
  const { schema, canRelease } = await import("../src/lib.mjs");
  const routes = [
    "/",
    "/links/",
    "/privacidade/",
    "/estudio/",
    ...procedures.map((p) => `/procedimentos/${p.slug}/`),
  ];
  const template = await fs.readFile("dist/index.html", "utf8");
  const origin =
    site.domain ||
    "https://mariana-strey-atelier.cuddly-shrew-1557.chatgpt.site";
  const released = canRelease(site);
  for (const route of routes) {
    let html = template;
    const p = procedures.find((p) => route.includes(p.slug));
    const title = p
      ? `${p.label} em Caxias do Sul | Mariana Strey`
      : route === "/links/"
        ? "Mariana Strey | Atendimento e localização"
        : route === "/estudio/"
          ? "A sua beleza não segue um padrão | Mariana Strey"
          : route === "/privacidade/"
            ? "Privacidade | Mariana Strey"
            : "Dra. Mariana Strey | Biomedicina estética em Caxias do Sul";
    const description = p
      ? `${p.label} em São Pelegrino, Caxias do Sul. Conheça indicações, limites e cuidados. Converse direto com a Mariana sobre a sua avaliação.`
      : "Dra. Mariana Strey, biomédica esteta em São Pelegrino, Caxias do Sul. Conheça a proposta de cuidado e converse sobre sua avaliação.";
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description"[^>]*>/,
        `<meta name="description" content="${description}" />`,
      );
    html = html
      .replace(
        /<meta property="og:title"[^>]*>/,
        `<meta property="og:title" content="${title}" />`,
      )
      .replace(
        /<meta property="og:description"[^>]*>/,
        `<meta property="og:description" content="${description}" />`,
      )
      .replace(
        'content="/images/og-mariana.jpg"',
        `content="${origin}/images/og-mariana.jpg"`,
      );
    if (released && !["/estudio/", "/links/"].includes(route))
      html = html.replace("noindex,nofollow", "index,follow");
    const extra = `<link rel="canonical" href="${origin}${route}" /><meta property="og:url" content="${origin}${route}" />${released ? '<script type="application/ld+json">' + JSON.stringify(schema(origin)).replace(/</g, "\\u003c") + "</script>" : ""}`;
    html = html.replace("</head>", extra + "</head>");
    html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${renderToString(React.createElement(App, { initialPath: route }))}</div>`,
      );
    const target = path.join("dist", route.slice(1), "index.html");
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html);
  }
  await fs.writeFile(
    "dist/robots.txt",
    released
      ? `User-agent: *\nAllow: /\nDisallow: /estudio/\nDisallow: /links/\nSitemap: ${origin}/sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n",
  );
  await fs.writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
      released
        ? routes
            .filter(
              (x) => !["/estudio/", "/links/", "/privacidade/"].includes(x),
            )
            .map((x) => `<url><loc>${origin}${x}</loc></url>`)
            .join("")
        : ""
    }</urlset>`,
  );
  await fs.writeFile(
    "dist/_headers",
    `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/models/*\n  Cache-Control: public, max-age=86400\n/draco/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
  );
  console.log(
    `Prerendered ${routes.length} routes. Public release ready: ${released}.`,
  );
} finally {
  await server.close();
}
