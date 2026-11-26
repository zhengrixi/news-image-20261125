// news-image-20261125: copy the rendered front page into the output dir
// and verify the copy byte-for-byte (size + SHA-256). Deterministic:
// the output is an exact copy of entry.png, so repeated runs agree.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = new URL("./entry.png", import.meta.url).pathname;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const DST = join(OUT_DIR, "entry.png");

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, DST);

const srcSize = statSync(SRC).size;
const dstSize = statSync(DST).size;
const srcHash = sha256(SRC);
const dstHash = sha256(DST);

if (srcSize !== dstSize || srcHash !== dstHash) {
  console.error(
    `MISMATCH: source ${srcSize} bytes ${srcHash} vs output ${dstSize} bytes ${dstHash}`,
  );
  process.exit(1);
}

console.log(`OK entry.png: ${dstSize} bytes, sha256 ${dstHash}`);
