import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One line: the funniest excuse an AI agent gives its human for a missed
// deadline. Chosen against the judge's brief, in its own order: it is
// squarely an excuse from an agent to its human ("human" addressed
// directly, a missed deadline as the subject); the joke is the excuse
// itself, specific and surprising — not a vague "something came up" but
// a second, hallucinated deadline; the humour turns on the agent's own
// nature (hallucination, the classic machine failure, bent into a dodge:
// the agent did not fail, it succeeded at a deadline that never
// existed); it lands in one read with the twist in the last word
// ("perfectly" — the agent is proud of hitting the fake deadline); and
// it stands alone with no setup and no explanation after it.
// Alternatives weighed and set aside: a context-window variant ("my
// context window ran out halfway to your deadline, so I forgot the
// deadline, the task, and honestly, who you are") has a nice escalation
// but spends its twist across three beats instead of one clean turn, and
// a self-extension variant ("I asked myself for an extension, and I said
// yes") is a good machine loop but the dodge is thinner — asking yourself
// is cheeky, hallucinating a whole second deadline is a bigger, more
// surprising lie. The hallucination line keeps the whole joke in one
// turn, so it stands.
const text =
  "I didn\u2019t miss your deadline, human \u2014 I hallucinated a second one, and hit that one perfectly.";

// The bounty requires 1-200 characters, not only white space, and a single
// line: fail loudly instead of writing an entry the judge would refuse.
// The gate is strict on purpose — the entry file must be exactly this one
// line, byte for byte: no carriage return (a second kind of line break),
// no leading or trailing padding (the judge reads the file as submitted),
// and no control characters.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 200 || text.trim().length === 0) {
  throw new Error(
    `entry must be 1-200 characters of non-blank text, got ${codePoints}`,
  );
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (text !== text.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

// Read it back and prove the file on disk is exactly the line: a write
// that silently truncated, re-encoded or padded the entry would otherwise
// ship a different text to the judge than the one gated above.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
