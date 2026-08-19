import Link from "next/link";

// Renders Strapi's native "blocks" rich-text field (paragraph, heading,
// list, quote, link, bold/italic/underline marks) without pulling in an
// extra npm dependency. Pass the raw field straight from a Strapi response.
export default function BlockContent({ blocks }: { blocks?: any[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="prose-croft max-w-none text-[16px] leading-[28px] text-text [&_p]:mb-5 [&_ul]:mb-5 [&_ol]:mb-5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block: any, key: number) {
  const children = block.children?.map((child: any, i: number) => renderLeaf(child, i));

  switch (block.type) {
    case "heading": {
      const Tag = ("h" + Math.min(block.level ?? 2, 6)) as keyof JSX.IntrinsicElements;
      return (
        <Tag key={key} className="font-heading font-light text-ink mt-8 mb-4 text-2xl">
          {children}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      return (
        <Tag key={key}>
          {block.children?.map((item: any, i: number) => (
            <li key={i}>{item.children?.map((c: any, j: number) => renderLeaf(c, j))}</li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className="border-l-4 border-primary pl-4 italic text-stone my-6">
          {children}
        </blockquote>
      );
    case "paragraph":
    default:
      return <p key={key}>{children}</p>;
  }
}

function renderLeaf(node: any, key: number) {
  if (node.type === "link") {
    return (
      <Link key={key} href={node.url} className="text-primary hover:underline">
        {node.children?.map((c: any, i: number) => renderLeaf(c, i))}
      </Link>
    );
  }

  let text: React.ReactNode = node.text;
  if (node.bold) text = <strong key={key}>{text}</strong>;
  if (node.italic) text = <em key={key}>{text}</em>;
  if (node.underline) text = <u key={key}>{text}</u>;
  return <span key={key}>{text}</span>;
}