// Renders Strapi's "richtext" field, which stores plain Markdown. Keeps this
// dependency-free (no react-markdown) by handling the handful of Markdown
// features the CMS editors actually use: paragraphs, headings, bold/italic,
// links and bullet/numbered lists.
export default function RichText({ text }: { text?: string | null }) {
  if (!text) return null;

  const blocks = text.trim().split(/\n\s*\n/);

  return (
    <div className="prose-croft max-w-none text-[16px] leading-[28px] text-text [&_p]:mb-5 [&_ul]:mb-5 [&_ol]:mb-5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block: string, key: number) {
  const lines = block.split("\n").filter(Boolean);

  const headingMatch = block.match(/^(#{1,6})\s+(.*)$/);
  if (headingMatch) {
    const level = Math.min(headingMatch[1].length, 6);
    const Tag = ("h" + level) as keyof JSX.IntrinsicElements;
    return (
      <Tag key={key} className="font-heading font-light text-ink mt-8 mb-4 text-2xl">
        {renderInline(headingMatch[2])}
      </Tag>
    );
  }

  const isBulletList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
  if (isBulletList && lines.length > 0) {
    return (
      <ul key={key}>
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.trim().replace(/^[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }

  const isOrderedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
  if (isOrderedList && lines.length > 0) {
    return (
      <ol key={key}>
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.trim().replace(/^\d+\.\s+/, ""))}</li>
        ))}
      </ol>
    );
  }

  return <p key={key}>{renderInline(block.replace(/\n/g, " "))}</p>;
}

function renderInline(text: string) {
  // Split on markdown link / bold / italic tokens while keeping the tokens.
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} className="text-primary hover:underline" target={link[2].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {link[1]}
        </a>
      );
    }
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}