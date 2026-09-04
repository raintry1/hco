'use client';

import { cn } from '@/lib/utils';
import { Heading, Prose, CodeInline } from '@/components/typography/prose';

interface ArticleContentProps {
  content: string;
  className?: string;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  p: (props) => <p {...props} />,
  strong: (props) => <strong {...props} />,
  em: (props) => <em {...props} />,
  ul: (props) => <ul className="list-disc pl-6 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
  li: (props) => <li {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
  ),
  code: (props) => <CodeInline {...props} />,
  pre: (props) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>
      <code className="font-mono text-sm" />
    </pre>
  ),
  a: (props) => (
    <a className="text-primary underline underline-offset-2 hover:no-underline" {...props} />
  ),
  img: (props) => (
    <figure className="my-6">
      <img
        className="rounded-lg w-full h-auto"
        loading="lazy"
        {...props}
      />
      {props.alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{props.alt}</figcaption>}
    </figure>
  ),
  hr: () => <hr className="border-border my-8" />,
};

function parseContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockContent = '';
      } else {
        inCodeBlock = false;
        nodes.push(
          <pre key={`code-${i}`} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
            <code className={`font-mono text-sm language-${codeBlockLang}`}>{codeBlockContent}</code>
          </pre>
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    if (trimmed.startsWith('# ')) {
      nodes.push(<Heading key={`h1-${i}`} level={1}>{trimmed.slice(2)}</Heading>);
    } else if (trimmed.startsWith('## ')) {
      nodes.push(<Heading key={`h2-${i}`} level={2}>{trimmed.slice(3)}</Heading>);
    } else if (trimmed.startsWith('### ')) {
      nodes.push(<Heading key={`h3-${i}`} level={3}>{trimmed.slice(4)}</Heading>);
    } else if (trimmed.startsWith('#### ')) {
      nodes.push(<Heading key={`h4-${i}`} level={4}>{trimmed.slice(5)}</Heading>);
    } else if (trimmed.startsWith('> ')) {
      nodes.push(<blockquote key={`quote-${i}`} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">{trimmed.slice(2)}</blockquote>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) {
          nodes.push(renderList(listType, listItems, i));
        }
        inList = true;
        listType = 'ul';
        listItems = [trimmed.slice(2)];
      } else {
        listItems.push(trimmed.slice(2));
      }
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        if (inList) {
          nodes.push(renderList(listType, listItems, i));
        }
        inList = true;
        listType = 'ol';
        listItems = [trimmed.replace(/^\d+\.\s/, '')];
      } else {
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      }
    } else if (trimmed === '---' || trimmed === '***') {
      if (inList) {
        nodes.push(renderList(listType, listItems, i));
        inList = false;
        listItems = [];
      }
      nodes.push(<hr key={`hr-${i}`} className="border-border my-8" />);
    } else if (trimmed === '') {
      if (inList) {
        nodes.push(renderList(listType, listItems, i));
        inList = false;
        listItems = [];
      }
    } else {
      if (inList) {
        nodes.push(renderList(listType, listItems, i));
        inList = false;
        listItems = [];
      }
      nodes.push(
        <p key={`p-${i}`} className="my-4">{parseInline(trimmed)}</p>
      );
    }
  }

  if (inList) {
    nodes.push(renderList(listType, listItems, lines.length));
  }

  return nodes;
}

function renderList(type: 'ul' | 'ol', items: string[], key: number) {
  const Tag = type === 'ul' ? 'ul' : 'ol';
  const className = type === 'ul' ? 'list-disc pl-6 space-y-2 my-4' : 'list-decimal pl-6 space-y-2 my-4';
  return (
    <Tag key={`list-${key}`} className={className}>
      {items.map((item, idx) => (
        <li key={idx}>{parseInline(item)}</li>
      ))}
    </Tag>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[([^\]]+)\]\(([^)]+)\))/);
  return parts
    .filter((part): part is string => typeof part === 'string')
    .map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return <CodeInline key={idx}>{part.slice(1, -1)}</CodeInline>;
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={idx}>{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return <a key={idx} href={linkMatch[2]} className="text-primary underline underline-offset-2 hover:no-underline">{linkMatch[1]}</a>;
      }
      return part;
    });
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  return (
    <Prose className={cn('prose-purple', className)}>
      {parseContent(content)}
    </Prose>
  );
}