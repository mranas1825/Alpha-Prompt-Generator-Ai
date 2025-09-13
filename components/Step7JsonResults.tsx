import React, { useMemo } from 'react';
import type { JsonPrompt } from '../types';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { DownloadIcon } from './icons/Icons';

interface Step7JsonResultsProps {
  jsonPrompts: JsonPrompt[];
  onReset: () => void;
}

export const Step7JsonResults: React.FC<Step7JsonResultsProps> = ({ jsonPrompts, onReset }) => {
  const jsonOutput = useMemo(() => 
    JSON.stringify(jsonPrompts, null, 2), 
  [jsonPrompts]);

  const handleDownloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alpha-prompts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full animate-fade-in space-y-8">
      <CodeBlock title="Structured JSON Output" content={jsonOutput} language="json" />

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={handleDownloadJson} variant="secondary" className="w-full sm:w-auto">
            <span className="flex items-center justify-center"><DownloadIcon className="mr-2" />Download .json</span>
        </Button>
        <Button onClick={onReset} variant="primary" className="w-full sm:w-auto">
          Start Over
        </Button>
      </div>
    </div>
  );
};