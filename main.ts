// One Line, One Laugh — make.fun entry
// https://make.fun/bounty/u-plucky-finch-20-one-line-one-laugh-0ffe66ea
//
// THE LINE (written to <outputDir>/entry.txt):
//   I finally achieved work-life balance: I now panic about work and my
//   personal life at the exact same time.
//
// WHY THIS LINE:
//   - Funny on its own, no setup, picture or prior context needed: the
//     phrase "work-life balance" sets up a familiar self-help promise and
//     the twist redefines it as synchronized panic.
//   - The laugh arrives fast: the turn lands in the second clause, inside
//     the same line, with no extra sentence to explain it.
//   - Fresh angle: instead of the stock "my job is stressful" rant or a
//     pun on "balance", it keeps the buzzword and inverts what it means.
//   - Tight wording: every word earns its place; it reads cleanly in one
//     pass and is easy to repeat to someone else.
//   - Holds up on a second read: the joke is the redefinition itself, not
//     a one-off wordplay that dies once you have seen it.
//
// CANDIDATES CONSIDERED AND REJECTED:
//   1. "My smart fridge just emailed me a breakup letter. Apparently I've
//      been seeing the microwave behind its back."
//      Rejected: anthropomorphised-appliance jokes are well worn, and
//      "behind its back" is a stock phrase — the angle is not fresh.
//   2. "I told my plants I loved them and they still died, so now I just
//      lie to them about the weather instead."
//      Rejected: the setup takes too long and the punchline is diluted
//      across two clauses; the laugh does not land fast enough.
//   3. "My therapist says I use humor to avoid my feelings, which is
//      hilarious because my feelings filed a restraining order years ago."
//      Rejected: a two-step joke that explains itself ("which is
//      hilarious because..."); too long and too self-referential.
//   4. "I bought a self-help book and it ghosted me halfway through
//      chapter three."
//      Rejected: "ghosted" is a worn-out word and the joke is a thin
//      one-word pun rather than a real twist.
//   5. "NASA asked me to stop waving at satellites. Apparently they can
//      see me and it's making the astronauts uncomfortable."
//      Rejected: the second sentence wanders — "astronauts uncomfortable"
//      is random rather than a payoff of the setup.
//
// The line is original, written for this entry, not a quote and not a
// house anchor/rung text.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The single funny line this entry submits. Pure ASCII, one line.
const LINE =
  "I finally achieved work-life balance: I now panic about work and my personal life at the exact same time.";

// Self-check gate: the entry must be valid UTF-8 text of 1-200
// characters, a single line, not only whitespace, with no trailing
// newline. Anything failing the gate aborts with a non-zero exit
// instead of writing a bad entry.
function checkLine(line: string): void {
  // Valid UTF-8: no lone surrogates (a lone surrogate cannot encode).
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = line.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new Error("gate: line contains a lone surrogate (not valid UTF-8)");
      }
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new Error("gate: line contains a lone surrogate (not valid UTF-8)");
    }
  }
  // Character count in code points (matches the gate's 1-200 range).
  const length = [...line].length;
  if (length < 1 || length > 200) {
    throw new Error(`gate: line is ${length} characters, must be 1-200`);
  }
  // Single line: no newline or carriage return anywhere.
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: line must be a single line");
  }
  // Not only whitespace.
  if (line.trim().length === 0) {
    throw new Error("gate: line must not be only whitespace");
  }
  // No trailing newline (the file is written byte-exact, no newline added).
  // No invisible control characters (tabs, zero-width marks, etc.) that
  // would make the line read differently than it looks.
  for (const ch of line) {
    const code = ch.codePointAt(0) as number;
    if ((code < 0x20 && ch !== " ") || code === 0x7f || (code >= 0x200b && code <= 0x200f)) {
      throw new Error("gate: line contains an invisible control character");
    }
  }
}

function main(): void {
  const outputDir = process.argv[2] ?? "/output";
  checkLine(LINE);
  mkdirSync(outputDir, { recursive: true });
  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Round-trip check: what was written must be byte-exact what we gated.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("gate: written entry.txt does not match the gated line");
  }
}

main();
