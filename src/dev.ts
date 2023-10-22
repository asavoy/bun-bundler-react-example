// TODO: this is all hacked together while figuring out what's broken or missing
//       when using the Bun Bundler.
const rimraf = require("rimraf");
rimraf.sync("example/dist");

console.log("Building...");
// TODO: entrypoints should be discovered from the HTML files
const build = await Bun.build({
  entrypoints: ["example/src/main-a.tsx", "example/src/main-b.tsx"],
  outdir: "example/dist",
  naming: "[name]-[hash].[ext]",
  splitting: true,
});
console.log("Building done");
console.log(build);

console.log("Rewriting HTML...");
// TODO: assumes entrypoints are in the same order as the inputs
// TODO: derive path from build.outputs properly
// TODO: inject scripts into content properly
const b = build.outputs.filter((i) => i.path.endsWith(".css"))[0];
console.log(b.type);
const entryAPath = build.outputs
  .filter((i) => i.kind == "entry-point")[0]
  .path.split("example/dist/")[1];
const entryBPath = build.outputs
  .filter((i) => i.kind == "entry-point")[1]
  .path.split("example/dist/")[1];
// TODO: missing a css loader that loads css files on-demand at runtime
const cssPaths = build.outputs
  .filter((i) => i.loader == "file" && i.type == "text/css")
  .map((i) => i.path.split("example/dist/")[1]);
const inputAHtml = Bun.file("example/a.html");
const outputAHtml = Bun.file("example/dist/a.html");
let contentA = await inputAHtml.text();
contentA = contentA.replace("src/main-a.tsx", entryAPath);
contentA = contentA.replace(
  "</head>",
  cssPaths.map((i) => `<link rel="stylesheet" href="${i}">`).join("\n") +
    "\n</head>"
);
await Bun.write(outputAHtml, contentA);

const inputBHtml = Bun.file("example/b.html");
const outputBHtml = Bun.file("example/dist/b.html");
let contentB = await inputBHtml.text();
contentB = contentB.replace("src/main-b.tsx", entryBPath);
contentB = contentB.replace(
  "</head>",
  cssPaths.map((i) => `<link rel="stylesheet" href="${i}">`).join("\n") +
    "\n</head>"
);
await Bun.write(outputBHtml, contentB);
console.log("Rewriting HTML done");

const port = 8123;
console.log(`Serving at http://localhost:${port}`);
console.log(`- http://localhost:${port}/a.html`);
console.log(`- http://localhost:${port}/b.html`);
Bun.serve({
  port,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    console.log(`${req.method} ${path}`);
    const localPath = path === "/" ? "/a.html" : path;
    const file = Bun.file(`example/dist${localPath}`);
    if (await file.exists()) {
      return new Response(file);
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
});
