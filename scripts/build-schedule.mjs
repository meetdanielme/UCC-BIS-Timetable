import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const stripExports = (source) => source.replaceAll("export const ", "const ").replaceAll("export function ", "function ");

const [template, data, core, ui] = await Promise.all([
  read("src/schedule.template.html"),
  read("src/schedule-data.mjs"),
  read("src/schedule-core.mjs"),
  read("src/schedule-ui.mjs"),
]);

const logoResponse = await fetch(
  "https://www.ucc.ie/en/media/2017siteassets/images/ucc-central-header-logo.svg",
);
if (!logoResponse.ok) {
  throw new Error(`Could not load the official UCC logo (${logoResponse.status})`);
}
const logoSvg = (await logoResponse.text())
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/\s+on\w+="[^"]*"/gi, "");
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

const output = template
  .replace("<!-- DATA -->", stripExports(data))
  .replace("<!-- CORE -->", stripExports(core))
  .replace("<!-- UI -->", ui)
  .replace(
    /(<img class="brand-logo" src=")[^"]+/,
    `$1${logoDataUri}`,
  );

await writeFile(new URL("schedule.html", root), output);
console.log("Built schedule.html");
