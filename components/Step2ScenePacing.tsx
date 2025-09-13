import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { CheckCircleIcon, LoadingSpinnerIcon } from './icons/Icons';

interface Step2ScenePacingProps {
  summary: string;
  isLoading: boolean;
  sceneCount: number;
  setSceneCount: (count: number) => void;
  onPacingSubmit: (count: number) => void;
  onBack: () => void;
}

export const Step2ScenePacing: React.FC<Step2ScenePacingProps> = ({ summary, isLoading, sceneCount, setSceneCount, onPacingSubmit, onBack }) => {
  
  const handleSceneCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    setSceneCount(value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPacingSubmit(sceneCount);
  };
  
  return (
    <Card className="animate-fade-in">
      <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-200 p-4 rounded-lg flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">
          {isLoading ? <LoadingSpinnerIcon /> : <CheckCircleIcon />}
        </div>
        <div>
          <h3 className="font-semibold">{isLoading ? 'Analyzing Script...' : 'Script Received!'}</h3>
          <p className="text-sm mt-1">{isLoading ? 'The AI is reading your script to understand its core themes...' : summary}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100">Step 2: Scene Pacing</h2>
        <p className="text-center text-slate-400 mt-2 mb-6">How many scenes (or images) should I create from this paragraph of your script?</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input 
            type="number"
            min="1"
            value={sceneCount}
            onChange={handleSceneCountChange}
            className="w-28 text-center bg-slate-900 border-2 border-slate-700 rounded-lg p-3 text-2xl sm:text-3xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
          />

          <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Button onClick={onBack} variant="secondary" className="w-full sm:w-auto">
              Back
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Set Scene Count
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};