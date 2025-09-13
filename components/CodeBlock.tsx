
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon } from './icons/Icons';
import { Card } from './Card';

interface CodeBlockProps {
  title: string;
  content: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, content, language = 'text' }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
  };

  return (
    <Card className="relative animate-fade-in-slow">
      <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
          <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
          >
              {isCopied ? <CheckIcon /> : <ClipboardIcon />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
      </div>
      <pre className="bg-slate-900 rounded-lg p-4 max-h-72 sm:max-h-96 overflow-y-auto">
        <code className={`language-${language} text-slate-300 whitespace-pre-wrap`}>
          {content}
        </code>
      </pre>
    </Card>
  );
};