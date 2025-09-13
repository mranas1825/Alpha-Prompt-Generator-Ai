
import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface Step1ScriptInputProps {
  onScriptSubmit: (script: string) => void;
}

export const Step1ScriptInput: React.FC<Step1ScriptInputProps> = ({ onScriptSubmit }) => {
  const [script, setScript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (script.trim()) {
      onScriptSubmit(script.trim());
    }
  };

  return (
    <Card className="animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100">Step 1: Provide Your Script</h2>
      <p className="text-center text-slate-400 mt-2 mb-6">Paste your paragraph or long-form script below.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="e.g., A lone astronaut drifts through the silent void, tethered to a damaged ship. Below, the marbled blue of Earth hangs like a distant memory..."
          className="w-full h-40 sm:h-48 p-4 bg-slate-900 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
        />
        <div className="mt-6 text-center">
          <Button type="submit" disabled={!script.trim()}>
            Analyze Script
          </Button>
        </div>
      </form>
    </Card>
  );
};