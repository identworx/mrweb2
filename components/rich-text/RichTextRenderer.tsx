interface Props {
  html: string | null | undefined;
  className?: string;
}

function isHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

function hasVisibleContent(text: string): boolean {
  return text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainTextToHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n");
  const paragraphs = normalized.split(/\n\n+/);
  return paragraphs
    .map((para) => {
      const escaped = escapeHtml(para.trim());
      const withBreaks = escaped.replace(/\n/g, "<br />");
      return `<p>${withBreaks}</p>`;
    })
    .filter((p) => p !== "<p></p>")
    .join("");
}

export default function RichTextRenderer({ html, className = "" }: Props) {
  if (!html) return null;
  if (!hasVisibleContent(html)) return null;

  const safeHtml = isHtml(html) ? html : plainTextToHtml(html);

  return (
    <div
      className={`rich-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
