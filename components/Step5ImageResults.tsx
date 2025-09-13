import React from 'react';
import type { ImagePrompt } from '../types';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { Card } from './Card';

interface Step5ImageResultsProps {
  imagePrompts: ImagePrompt[];
  onGenerateVideo: () => void;
  onDeclineVideo: () => void;
}

export const Step5ImageResults: React.FC<Step5ImageResultsProps> = ({ 
    imagePrompts, 
    onGenerateVideo,
    onDeclineVideo,
}) => {
  const imagePromptsContent = imagePrompts.map(p => `SCENE ${p.scene}\n${p.image_prompt}`).join('\n\n');

  return (
    <div className="w-full animate-fade-in space-y-8">
      <CodeBlock title="Image Prompts (Infographic Style)" content={imagePromptsContent} />

      <Card className="text-center">
        <h3 className="text-xl font-bold">Generate Video Prompts?</h3>
        <p className="text-slate-400 mt-2 mb-6">Would you like to generate cinematic video animation prompts for each scene?</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={onDeclineVideo} variant="secondary" className="w-full sm:w-auto">
                No, Start Over
            </Button>
            <Button onClick={onGenerateVideo} variant="primary" className="w-full sm:w-auto">
                Video Animation Prompts
            </Button>
        </div>
      </Card>
    </div>
  );
};