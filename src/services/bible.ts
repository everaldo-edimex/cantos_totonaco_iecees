import rawRvr from "@/data/RVR1960_vid_149.json";
import rawRva from "@/data/RVA2015_vid_1782.json";
import type { BibleBook, BibleData, BibleHeading, BibleVerse } from "@/types/bible";
import type { BibleVersion } from "@/types/preferences";

type RawItem = { type: string; verse_numbers: number[]; lines: string[] };
type RawChapter = { chapter_usfm: string; is_chapter: boolean; items: RawItem[] };
type RawBook = { book_usfm: string; name: string; chapters: RawChapter[] };
type RawBible = {
  local_abbreviation: string; local_title: string; repository: string;
  language: { local_name: string }; publisher: { name: string }; copyright: { text: string };
  books: RawBook[];
};

const normalize = (raw: RawBible): BibleData => ({
  metadata: {
    abbreviation: raw.local_abbreviation,
    title: raw.local_title,
    language: raw.language.local_name,
    publisher: raw.publisher.name,
    copyright: raw.copyright.text,
    repository: raw.repository
  },
  books: raw.books.map((book): BibleBook => ({
    usfm: book.book_usfm,
    name: book.name.replace(/^S\. /, ""),
    chapters: book.chapters.filter((chapter) => chapter.is_chapter).map((chapter) => {
      const number = Number(chapter.chapter_usfm.split(".").at(-1));
      const verses: BibleVerse[] = [];
      let pending: BibleHeading[] = [];
      for (const item of chapter.items) {
        const text = item.lines.join("\n").trim();
        if (item.type !== "verse") {
          if (text) pending.push({ type: item.type, text });
          continue;
        }
        const verseNumber = item.verse_numbers[0];
        if (!verseNumber || !text) continue;
        const previous = verses.at(-1);
        if (previous?.verse === verseNumber) {
          previous.segments.push({ text, headings: pending });
          previous.text = previous.segments.map((segment) => segment.text).join(" ");
        } else {
          verses.push({
            bookUsfm: book.book_usfm, bookName: book.name.replace(/^S\. /, ""), chapter: number,
            verse: verseNumber, reference: `${book.name.replace(/^S\. /, "")} ${number}:${verseNumber}`,
            segments: [{ text, headings: pending }], text
          });
        }
        pending = [];
      }
      return { number, verses };
    })
  }))
});

const databases: Record<BibleVersion, BibleData> = {
  RVR1960: normalize(rawRvr as RawBible),
  RVA2015: normalize(rawRva as RawBible)
};

export const getBible = (version: BibleVersion) => databases[version];
export const getBibleBook = (version: BibleVersion, usfm: string) =>
  getBible(version).books.find((book) => book.usfm === usfm.toUpperCase());
export const getBibleChapter = (version: BibleVersion, usfm: string, chapter: number) =>
  getBibleBook(version, usfm)?.chapters.find((item) => item.number === chapter);
export const getBibleVerse = (version: BibleVersion, book: string, chapter: number, verse: number) =>
  getBibleChapter(version, book, chapter)?.verses.find((item) => item.verse === verse);
