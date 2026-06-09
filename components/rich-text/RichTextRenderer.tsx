interface Props {
  html: string | null | undefined;
  className?: string;
}

export default function RichTextRenderer({ html, className = "" }: Props) {
  if (!html) return null;

  const stripped = html.replace(/<[^>]*>/g, "").trim();
  if (!stripped) return null;

  const hasHtml = /<[a-z][\s\S]*>/i.test(html);

  if (!hasHtml) {
    return <p className={className}>{html}</p>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
