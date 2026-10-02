'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    try {
      // Split by double dollar ($$...$$) first for display math, then single dollar ($...$) for inline
      const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g);

      return parts
        .map((part) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const math = part.slice(2, -2).trim();
            try {
              return katex.renderToString(math, {
                displayMode: true,
                throwOnError: false,
                output: 'html'
              });
            } catch {
              return `<span class="katex-error">${math}</span>`;
            }
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1).trim();
            try {
              return katex.renderToString(math, {
                displayMode: false,
                throwOnError: false,
                output: 'html'
              });
            } catch {
              return `<span class="katex-error">${math}</span>`;
            }
          } else {
            // Regular text: sanitize newlines to <br/> or paragraphs
            return part
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\n\n/g, '<br/><br/>')
              .replace(/\n/g, '<br/>');
          }
        })
        .join('');
    } catch {
      return content;
    }
  }, [content]);

  return (
    <div
      className={`leading-relaxed ${block ? 'my-2' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
