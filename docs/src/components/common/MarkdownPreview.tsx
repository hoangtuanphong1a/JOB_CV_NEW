// src/components/common/MarkdownPreview.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";


// Định nghĩa type đúng cho style

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  const components: Components = {
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLElement>) => {
      const { style: _style, ...restProps } = props;
      void _style;
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (!inline && match) {
        return (
          <SyntaxHighlighter
            // Ép kiểu đúng: vscDarkPlus là object có index signature
            style={vscDarkPlus as Record<string, React.CSSProperties>}
            language={match[1]}
            PreTag="div"
            {...restProps}
          >
            {codeString}
          </SyntaxHighlighter>
        );
      }

      return (
        <code
          className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        className="max-w-full h-auto rounded-lg shadow-md my-4"
        loading="lazy"
      />
    ),
  };

  return (
    <div className="prose prose-slate max-w-none p-6 prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content || "*Nội dung preview sẽ hiển thị ở đây...*"}
      </ReactMarkdown>
    </div>
  );
};