import fs from "node:fs";
import path from "node:path";

const [, , sourceArg, outputArg = "db/cantos_totonaku.json"] = process.argv;
if (!sourceArg) {
  console.error("Uso: node scripts/parse-totonaku-songs.mjs <fuente.txt> [salida.json]");
  process.exit(1);
}

const normalizeLabel = (value) =>
  value.normalize("NFD").replace(/\p{M}/gu, "").trim().toUpperCase().replace(/\s*:\s*$/, "");

const titleCase = (value) =>
  value
    .toLocaleLowerCase("es-MX")
    .replace(/\p{L}[\p{L}\p{M}]*/gu, (word) =>
      word[0].toLocaleUpperCase("es-MX") + word.slice(1)
    );

const songHeading = (line) => {
  const match = line.trim().match(/^(\d+)\s*(?:\.\s*)?-\s*(.+)$/u);
  if (!match) return null;
  const title = match[2].trim();
  if (!/\p{L}/u.test(title) || title !== title.toLocaleUpperCase("es-MX")) return null;
  return { numero: Number(match[1]), rawTitle: title };
};

const source = fs.readFileSync(path.resolve(sourceArg), "utf8").replace(/^\uFEFF/, "").replace(/\r/g, "");
const lines = source.split("\n");
const headings = lines
  .map((line, index) => ({ ...songHeading(line), index }))
  .filter((item) => Number.isInteger(item.numero));

if (!headings.length) throw new Error("No se encontraron encabezados de cantos.");

const warnings = [];
const songs = headings.map((heading, headingIndex) => {
  const end = headings[headingIndex + 1]?.index ?? lines.length;
  const body = lines.slice(heading.index + 1, end);
  const segments = [];
  let current = null;

  const finish = () => {
    if (!current) return;
    while (current.lines.length && !current.lines[0]) current.lines.shift();
    while (current.lines.length && !current.lines.at(-1)) current.lines.pop();
    if (current.lines.some(Boolean)) segments.push(current);
    current = null;
  };

  for (const rawLine of body) {
    const line = rawLine.trim();
    const label = normalizeLabel(line);
    if (label === "CORO" || label === "ULTIMO CORO") {
      finish();
      current = { kind: label === "CORO" ? "chorus" : "lastChorus", lines: [] };
      continue;
    }

    const verseStart = line.match(/^(\d+)\s*\.\s*-\s*(.*)$/u);
    if (verseStart) {
      finish();
      current = { kind: "verse", order: Number(verseStart[1]), lines: [] };
      if (verseStart[2].trim()) current.lines.push(verseStart[2].trim());
      continue;
    }

    if (!current) current = { kind: "verse", order: 1, lines: [] };
    current.lines.push(line);
  }
  finish();

  const verses = segments.filter((segment) => segment.kind === "verse");
  const choruses = segments.filter((segment) => segment.kind === "chorus");
  const lastChoruses = segments.filter((segment) => segment.kind === "lastChorus");
  const uniqueChoruses = [...new Set(choruses.map((segment) => segment.lines.join("\n")))];
  const uniqueLastChoruses = [...new Set(lastChoruses.map((segment) => segment.lines.join("\n")))];

  if (!verses.length) warnings.push(`Canto ${heading.numero}: no contiene estrofas.`);
  if (uniqueChoruses.length > 1) warnings.push(`Canto ${heading.numero}: contiene coros normales diferentes.`);
  if (uniqueLastChoruses.length > 1) warnings.push(`Canto ${heading.numero}: contiene últimos coros diferentes.`);

  const chorus = uniqueChoruses[0];
  const lastChorus = uniqueLastChoruses[0];
  const outputVerses = [];
  verses.forEach((verse, index) => {
    outputVerses.push({ orden: verse.order, contenido: verse.lines.join("\n") });
    const isLastVerse = index === verses.length - 1;
    if (!isLastVerse && chorus) outputVerses.push({ tipo: "coro", contenido: chorus });
    if (isLastVerse && lastChorus) outputVerses.push({ tipo: "ultimo_coro", contenido: lastChorus });
    if (isLastVerse && verses.length === 1 && chorus && !lastChorus) {
      outputVerses.push({ tipo: "coro", contenido: chorus });
    }
  });

  return {
    numero: heading.numero,
    titulo: titleCase(heading.rawTitle.replace(/\s*\.\s*$/u, "")),
    versos: outputVerses
  };
});

const duplicateNumbers = songs
  .map((song) => song.numero)
  .filter((numero, index, all) => all.indexOf(numero) !== index);
const maxNumber = Math.max(...songs.map((song) => song.numero));
const missingNumbers = Array.from({ length: maxNumber }, (_, index) => index + 1)
  .filter((numero) => !songs.some((song) => song.numero === numero));

if (duplicateNumbers.length) throw new Error(`Números duplicados: ${duplicateNumbers.join(", ")}`);
if (songs.some((song) => song.versos.some((verse) => !verse.contenido.trim()))) {
  throw new Error("La extracción produjo bloques vacíos.");
}

const outputPath = path.resolve(outputArg);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(songs, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  source: path.resolve(sourceArg),
  output: outputPath,
  songs: songs.length,
  first: songs[0]?.numero,
  last: songs.at(-1)?.numero,
  missingNumbers,
  songsWithChorus: songs.filter((song) => song.versos.some((verse) => verse.tipo === "coro")).length,
  warnings
}, null, 2));
