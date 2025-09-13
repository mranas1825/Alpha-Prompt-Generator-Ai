import React, { useMemo } from 'react';
import type { ImagePrompt, VideoPrompt } from '../types';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { Card } from './Card';
import { DownloadIcon } from './icons/Icons';

interface Step6VideoResultsProps {
  imagePrompts: ImagePrompt[];
  videoPrompts: VideoPrompt[];
  onGenerateJson: () => void;
  onReset: () => void;
}

export const Step6VideoResults: React.FC<Step6VideoResultsProps> = ({ 
    imagePrompts,
    videoPrompts,
    onGenerateJson, 
    onReset 
}) => {
  const imagePromptsContent = useMemo(() => 
    imagePrompts.map(p => `SCENE ${p.scene}\n${p.image_prompt}`).join('\n\n'), 
  [imagePrompts]);

  const videoPromptsContent = useMemo(() => 
    videoPrompts.map(p => `SCENE ${p.scene}\n${p.video_prompt}`).join('\n\n'), 
  [videoPrompts]);
  
  const handleDownloadTxt = () => {
    let content = "--- ALPHA PROMPT GENERATOR ---\n\n";
    content += "--- IMAGE PROMPTS ---\n\n";
    content += imagePromptsContent;
    content += "\n\n\n--- VIDEO PROMPTS ---\n\n";
    content += videoPromptsContent;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alpha-prompts.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full animate-fade-in space-y-8">
      <CodeBlock title="Image Prompts (Infographic Style)" content={imagePromptsContent} />
      <CodeBlock title="Video Animation Prompts (Cinematic Style)" content={videoPromptsContent} />
      
      <Card className="text-center">
          <h3 className="text-xl font-bold">Need a Structured Format?</h3>
          <p className="text-slate-400 mt-2 mb-6">Generate a detailed JSON output with all properties defined for each scene.</p>
          <Button onClick={onGenerateJson} className="w-full sm:w-auto">
              Generate JSON Format
          </Button>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={handleDownloadTxt} variant="secondary" className="w-full sm:w-auto">
             <span className="flex items-center justify-center"><DownloadIcon className="mr-2" />Download .txt</span>
        </Button>
        <Button onClick={onReset} variant="primary" className="w-full sm:w-auto">
          Start Over
        </Button>
      </div>
    </div>
  );
};