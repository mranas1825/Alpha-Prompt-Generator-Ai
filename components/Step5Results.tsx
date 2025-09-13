import React, { useState, useMemo } from 'react';
import type { ImagePrompt, VideoPrompt } from '../types';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { LoadingSpinnerIcon, DownloadIcon } from './icons/Icons';
// FIX: Import the Card component to resolve the 'Cannot find name Card' error.
import { Card } from './Card';

interface Step5ResultsProps {
  imagePrompts: ImagePrompt[];
  videoPrompts: VideoPrompt[] | null;
  isGeneratingVideos: boolean;
  onGenerateVideos: () => void;
  onReset: () => void;
}

export const Step5Results: React.FC<Step5ResultsProps> = ({ 
    imagePrompts, 
    videoPrompts, 
    isGeneratingVideos,
    onGenerateVideos, 
    onReset 
}) => {
  const [showJson, setShowJson] = useState(false);

  const imagePromptsContent = useMemo(() => 
    imagePrompts.map(p => `SCENE ${p.scene}\n${p.image_prompt}`).join('\n\n'), 
  [imagePrompts]);

  const videoPromptsContent = useMemo(() => 
    videoPrompts ? videoPrompts.map(p => `SCENE ${p.scene}\n${p.video_prompt}`).join('\n\n') : '', 
  [videoPrompts]);
  
  const combinedPrompts = useMemo(() => {
    return imagePrompts.map(imgPrompt => {
        const vidPrompt = videoPrompts?.find(vp => vp.scene === imgPrompt.scene);
        return {
            ...imgPrompt,
            video_prompt: vidPrompt ? vidPrompt.video_prompt : null,
        }
    })
  }, [imagePrompts, videoPrompts]);

  const jsonOutput = useMemo(() => 
    JSON.stringify(combinedPrompts, null, 2), 
  [combinedPrompts]);

  const handleDownloadTxt = () => {
    let content = "--- ALPHA PROMPT GENERATOR ---\n\n";
    content += "--- IMAGE PROMPTS ---\n\n";
    content += imagePromptsContent;

    if (videoPromptsContent) {
        content += "\n\n\n--- VIDEO PROMPTS ---\n\n";
        content += videoPromptsContent;
    }

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
      {/* Image Prompts Section */}
      <CodeBlock title="Image Prompts" content={imagePromptsContent} />

      {/* Video Prompts Section */}
      {videoPrompts ? (
        <CodeBlock title="Video Animation Prompts" content={videoPromptsContent} />
      ) : (
        <Card className="text-center">
          <h3 className="text-xl font-bold">Ready for the Next Step?</h3>
          <p className="text-slate-400 mt-2 mb-6">Generate corresponding video animation prompts for each scene.</p>
          <Button onClick={onGenerateVideos} disabled={isGeneratingVideos}>
            {isGeneratingVideos ? (
                <span className="flex items-center"><LoadingSpinnerIcon className="mr-2" />Generating...</span>
            ) : (
                'Generate Video Prompts'
            )}
          </Button>
        </Card>
      )}

      {/* JSON Viewer */}
      {showJson && (
          <CodeBlock title="JSON Output" content={jsonOutput} language="json" />
      )}

      {/* Actions Section */}
      <div className="text-center space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
        <Button onClick={handleDownloadTxt} variant="secondary">
            <span className="flex items-center"><DownloadIcon className="mr-2" />Download .txt</span>
        </Button>
        <Button onClick={() => setShowJson(prev => !prev)} variant="secondary">
          {showJson ? 'Hide JSON' : 'View as JSON'}
        </Button>
        <Button onClick={onReset} variant="primary">
          Start Over
        </Button>
      </div>
    </div>
  );
};