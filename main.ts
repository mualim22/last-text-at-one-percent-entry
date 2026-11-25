// Last Text at One Percent — the final text a dying phone sends at 1% battery.
// main.ts writes exactly one message to /output/entry.txt and nothing else.

import { mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// The entry: one last text, in the dying phone's own voice.
const ENTRY =
  "1% left. this is my last text. your screen time today was 9 hours and 14 minutes. nine. i died watching you ignore everyone. goodb\u2014";

// The gate: UTF-8 text of 1 to 200 characters, not only whitespace.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// A text message is a single line: no line breaks allowed.
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line, no line breaks");
}

const botDir = process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(botDir, "output");

// Create the output dir and clear only its contents — never remove it itself.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read it back and confirm what was written is exactly the entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt does not match the entry");
}
// Confirm the bytes on disk are the entry's UTF-8 encoding, no more, no less.
const writtenBytes = readFileSync(outPath);
if (writtenBytes.length !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry");
}
console.log(`wrote entry.txt (${chars.length} chars)`);
