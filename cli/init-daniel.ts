#!/usr/bin/env bun
/**
 * Prepare projects/daniel for Daniel Swainston's own voice (takes stay gitignored).
 * Copies templates/daniel-script.json if there is no script yet, or --reset replaces it.
 *
 *   bun cli/init-daniel.ts
 *   bun cli/init-daniel.ts --reset
 */
import { copyFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { readScript } from "../src/script.ts";

const ROOT = resolve(import.meta.dir, "..");
const project = join(ROOT, "projects", "daniel");
const template = join(ROOT, "templates", "daniel-script.json");
const script = join(project, "script.json");
const reset = process.argv.includes("--reset");

await mkdir(join(project, "takes"), { recursive: true });
const has = await Bun.file(script).exists();
if (!has || reset) {
  await copyFile(template, script);
  console.error(`${script} ${has ? "reset from" : "created from"} templates/daniel-script.json`);
} else {
  console.error(`${script} already there (pass --reset to replace from the template)`);
}
const checked = await readScript(project);
console.log(JSON.stringify(checked, null, 2));
console.error(`\nOpen http://127.0.0.1:4173/?project=daniel#record in Chrome (headphones on).`);
