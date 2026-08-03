import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = process.argv[2];
const append = process.argv.includes("--append");
const replaceRange = process.argv.find((argument) => argument.startsWith("--replace-range="))
  ?.split("=")[1]
  ?.split(":")
  .map(Number);
const sourceRange = process.argv.find((argument) => argument.startsWith("--source-range="))
  ?.split("=")[1]
  ?.split(":")
  .map(Number);
if (!sourcePath) throw new Error("Indica la ruta del archivo de cantos.");

const titlePattern = /^\s*(\d{1,3})[.]?\s+(.+?)\s*$/u;
const looksLikeMedia = (line) =>
  /(?:melod[ií]a|midi|mp3|video|orquesta|guitarra|piano|[oó]rgano|viol[ií]n|flauta|saxof[oó]n|voces sin|palabras sin m[uú]sica)/iu.test(
    line
  );
const isTitle = (line, index) => {
  const match = line.match(titlePattern);
  if (!match) return false;
  const number = Number(match[1]);
  if (sourceRange?.length === 2 && (number < sourceRange[0] || number > sourceRange[1])) return false;
  const title = match[2];
  let nextIndex = index + 1;
  while (nextIndex < lines.length && !lines[nextIndex].trim()) nextIndex += 1;
  return /\p{L}/u.test(title) && looksLikeMedia(lines[nextIndex] ?? "");
};

const source = await readFile(resolve(sourcePath), "utf8");
const lines = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
const minorWords = new Set([
  "a", "al", "con", "de", "del", "e", "el", "en", "la", "las", "los", "mi", "mis",
  "o", "para", "por", "sin", "su", "sus", "tu", "tus", "u", "un", "una", "unas", "unos", "y"
]);
const titleCase = (title) =>
  title
    .toLocaleLowerCase("es")
    .split(/\s+/u)
    .map((word, index) => {
      if (index > 0 && minorWords.has(word)) return word;
      return word.replace(/\p{L}/u, (letter) => letter.toLocaleUpperCase("es"));
    })
    .join(" ");
const blocks = [];
let current = null;

for (const [index, line] of lines.entries()) {
  if (isTitle(line, index)) {
    if (current) blocks.push(current);
    const [, number, title] = line.match(titlePattern);
    current = { numero: Number(number), titulo: titleCase(title.trim()), lines: [] };
  } else if (current) {
    current.lines.push(line.replace(/\s+$/u, ""));
  }
}
if (current) blocks.push(current);

const splitParagraphs = (blockLines) => {
  const content = [...blockLines];
  while (content.length && !content[0].trim()) content.shift();
  // Every source block places one or more multimedia lines immediately after its title.
  while (content.length && (looksLikeMedia(content[0]) || !content[0].trim())) content.shift();
  const indexStart = content.findIndex((line) => /^(?:www\.|biblioteca\s*$)/iu.test(line.trim()));
  if (indexStart >= 0) content.splice(indexStart);
  for (let index = 0; index < content.length;) {
    if (/^\*?se puede\b/iu.test(content[index].trim())) {
      let end = index;
      while (end < content.length && content[end].trim()) end += 1;
      content.splice(index, end - index);
    } else {
      index += 1;
    }
  }

  const paragraphs = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) paragraphs.push(paragraph);
    paragraph = [];
  };
  for (const line of content) {
    if (!line.trim()) flush();
    else paragraph.push(line.trim());
  }
  flush();

  return paragraphs.flatMap((linesInParagraph) => {
    const sections = [];
    let section = [];
    for (const line of linesInParagraph) {
      if ((/^\d+[.)]?\s+/u.test(line) || /^CORO\s*:?/iu.test(line)) && section.length) {
        sections.push(section);
        section = [];
      }
      section.push(line);
    }
    if (section.length) sections.push(section);
    return sections;
  });
};

const parsedSongs = blocks.map((block) => {
  let nextOrder = 1;
  const units = splitParagraphs(block.lines).map((paragraph) => {
    const joined = paragraph.join("\n").trim();
    const chorusMatch = joined.match(/^CORO\s*:?\s*/iu);
    if (chorusMatch) {
      return { tipo: "coro", contenido: joined.slice(chorusMatch[0].length).trim() };
    }
    const orderMatch = joined.match(/^(\d+)[.)]?\s+/u);
    const orden = orderMatch ? Number(orderMatch[1]) : nextOrder;
    nextOrder = Math.max(nextOrder + 1, orden + 1);
    return {
      orden,
      contenido: orderMatch ? joined.slice(orderMatch[0].length).trim() : joined
    };
  }).filter((unit) => unit.contenido);

  const chorus = units.find((unit) => unit.tipo === "coro");
  const verses = units.filter((unit) => unit.tipo !== "coro");
  const versos = chorus ? verses.flatMap((verse) => [verse, { ...chorus }]) : verses;
  return { numero: block.numero, titulo: block.titulo, versos };
});
const uniqueSongs = new Map();
for (const song of parsedSongs) {
  if (!uniqueSongs.has(song.numero)) uniqueSongs.set(song.numero, song);
}
const songs = [...uniqueSongs.values()].filter((song) => song.versos.length > 0);

let outputSongs = songs;
if (append) {
  const existing = JSON.parse(await readFile(resolve("db/cantos_espanol.json"), "utf8"));
  const retained = replaceRange?.length === 2
    ? existing.filter((song) => song.numero < replaceRange[0] || song.numero > replaceRange[1])
    : existing;
  const merged = new Map(retained.map((song) => [song.numero, song]));
  for (const song of songs) merged.set(song.numero, song);
  outputSongs = [...merged.values()].sort((a, b) => a.numero - b.numero);
}

const json = `${JSON.stringify(outputSongs, null, 2)}\n`;
await Promise.all([
  writeFile(resolve("db/cantos_espanol.json"), json, "utf8"),
  writeFile(resolve("src/data/cantos_espanol.json"), json, "utf8")
]);

console.log(
  `Procesados ${songs.length} cantos; total guardado: ${outputSongs.length} (${outputSongs[0]?.numero}–${outputSongs.at(-1)?.numero}).`
);
