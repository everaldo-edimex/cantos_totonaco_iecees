export function VerseBlock({ order, content }: { order?: number; content: string }) {
  return <section className="verse-block"><span className="verse-label">{order === undefined ? "Verso" : `Verso ${order}`}</span><p>{content}</p></section>;
}
