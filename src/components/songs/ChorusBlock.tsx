export function ChorusBlock({ content, last = false }: { content: string; last?: boolean }) {
  return <section className="chorus-block"><span className="verse-label">{last ? "Último coro" : "Coro"}</span><p>{content}</p></section>;
}
