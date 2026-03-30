"use client";

import { FadeUp } from "@/components/shared/fade-up";

export function RichTextBlock({ data }: { data: any }) {
  const content = data?.body || data?.content || "";

  // If content is a Tina rich-text AST (object), render it recursively.
  // If it's a plain string, render as HTML.
  if (!content) return null;

  return (
    <section className="section-spacing">
      <div className="container-narrow">
        <FadeUp>
          {typeof content === "string" ? (
            <div
              className="prose prose-lg mx-auto max-w-none text-[var(--color-apple-gray-700)] prose-headings:text-[var(--color-apple-dark)] prose-a:text-[var(--color-apple-blue)] prose-strong:text-[var(--color-apple-dark)]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="prose prose-lg mx-auto max-w-none text-[var(--color-apple-gray-700)] prose-headings:text-[var(--color-apple-dark)] prose-a:text-[var(--color-apple-blue)] prose-strong:text-[var(--color-apple-dark)]">
              <RichTextNodes nodes={content?.children || []} />
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}

// Minimal Tina rich-text AST renderer
function RichTextNodes({ nodes }: { nodes: any[] }) {
  if (!nodes || !Array.isArray(nodes)) return null;

  return (
    <>
      {nodes.map((node: any, i: number) => (
        <RichTextNode key={i} node={node} />
      ))}
    </>
  );
}

function RichTextNode({ node }: { node: any }) {
  if (!node) return null;

  // Text leaf node
  if (node.type === "text" || typeof node.text === "string") {
    let text: React.ReactNode = node.text || "";
    if (node.bold) text = <strong>{text}</strong>;
    if (node.italic) text = <em>{text}</em>;
    if (node.underline) text = <u>{text}</u>;
    if (node.code) text = <code>{text}</code>;
    return <>{text}</>;
  }

  const children = <RichTextNodes nodes={node.children || []} />;

  switch (node.type) {
    case "h1":
      return <h1>{children}</h1>;
    case "h2":
      return <h2>{children}</h2>;
    case "h3":
      return <h3>{children}</h3>;
    case "h4":
      return <h4>{children}</h4>;
    case "p":
      return <p>{children}</p>;
    case "blockquote":
      return <blockquote>{children}</blockquote>;
    case "ul":
      return <ul>{children}</ul>;
    case "ol":
      return <ol>{children}</ol>;
    case "li":
      return <li>{children}</li>;
    case "lic":
      return <>{children}</>;
    case "a":
      return (
        <a href={node.url} target={node.url?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {children}
        </a>
      );
    case "img":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={node.url} alt={node.alt || ""} className="rounded-xl" />
      );
    case "hr":
      return <hr />;
    case "code_block":
      return (
        <pre>
          <code>{children}</code>
        </pre>
      );
    default:
      return <>{children}</>;
  }
}
