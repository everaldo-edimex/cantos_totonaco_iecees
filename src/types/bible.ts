export interface BibleHeading { type: string; text: string }
export interface BibleSegment { text: string; headings: BibleHeading[] }
export interface BibleVerse {
  bookUsfm: string;
  bookName: string;
  chapter: number;
  verse: number;
  reference: string;
  segments: BibleSegment[];
  text: string;
}
export interface BibleChapter { number: number; verses: BibleVerse[] }
export interface BibleBook { usfm: string; name: string; chapters: BibleChapter[] }
export interface BibleMetadata {
  abbreviation: string;
  title: string;
  language: string;
  publisher: string;
  copyright: string;
  repository: string;
}
export interface BibleData { metadata: BibleMetadata; books: BibleBook[] }
export interface BibleReference { book: string; chapter: number; verse: number }
export interface BiblePlaylist { id: string; title: string; references: BibleReference[]; createdAt: number }
