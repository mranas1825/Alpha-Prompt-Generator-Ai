import React, { useState, useCallback } from 'react';
import { Step1ScriptInput } from './components/Step1ScriptInput';
import { Step2ScenePacing } from './components/Step2ScenePacing';
import { Step3StyleInput } from './components/Step3StyleInput';
import { Step4Loading } from './components/Step4Loading';
import { Step5ImageResults } from './components/Step5ImageResults';
import { Step6VideoResults } from './components/Step6VideoResults';
import { Step7JsonResults } from './components/Step7JsonResults';
import { Header } from './components/Header';
import { summarizeScript, generateImagePrompts, generateVideoPrompts, generateJsonPrompts } from './services/geminiService';
import type { AppState, StyleImage, VideoPrompt, JsonPrompt } from './types';
import { AppStep } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    step: AppStep.SCRIPT_INPUT,
    script: '',
    scriptSummary: '',
    sceneCount: 3,
    imageStyle: '',
    styleImage: null,
    imagePrompts: null,
    videoPrompts: null,
    jsonPrompts: null,
    error: null,
    isLoading: false,
  });

  const handleScriptSubmit = useCallback(async (script: string) => {
    setAppState(prev => ({ ...prev, script, isLoading: true, step: AppStep.SCENE_PACING, error: null }));
    try {
      const summary = await summarizeScript(script);
      setAppState(prev => ({ ...prev, scriptSummary: summary, isLoading: false }));
    } catch (e) {
      console.error(e);
      setAppState(prev => ({ ...prev, error: 'Could not analyze script. Please try again.', isLoading: false, scriptSummary: "Analysis failed. Please proceed." }));
    }
  }, []);

  const handlePacingSubmit = useCallback((count: number) => {
    setAppState(prev => ({ ...prev, sceneCount: count, step: AppStep.STYLE_INPUT, error: null }));
  }, []);

  const handleStyleSubmit = useCallback(async (style: string, image: StyleImage | null) => {
    setAppState(prev => ({ ...prev, imageStyle: style, styleImage: image, step: AppStep.LOADING, error: null }));
    try {
      const results = await generateImagePrompts(appState.script, appState.sceneCount, style, image);
      setAppState(prev => ({ ...prev, imagePrompts: results, step: AppStep.IMAGE_PROMPTS_RESULTS }));
    } catch (e) {
      console.error(e);
      setAppState(prev => ({ ...prev, error: 'Failed to generate prompts. Please check your inputs and try again.', step: AppStep.STYLE_INPUT }));
    }
  }, [appState.script, appState.sceneCount]);

  const handleGenerateVideoPrompts = useCallback(async () => {
    if (!appState.imagePrompts) return;
    setAppState(prev => ({...prev, step: AppStep.VIDEO_PROMPTS_LOADING, error: null}));
    try {
        const videoResults = await generateVideoPrompts(appState.imagePrompts);
        setAppState(prev => ({...prev, videoPrompts: videoResults, step: AppStep.VIDEO_PROMPTS_RESULTS}));
    } catch (e) {
        console.error(e);
        setAppState(prev => ({...prev, error: 'Failed to generate video prompts.', step: AppStep.IMAGE_PROMPTS_RESULTS}));
    }
  }, [appState.imagePrompts]);

  const handleGenerateJsonPrompts = useCallback(async () => {
    if (!appState.imagePrompts || !appState.videoPrompts) return;
    setAppState(prev => ({ ...prev, step: AppStep.JSON_PROMPTS_LOADING, error: null }));
    try {
      const jsonResults = await generateJsonPrompts(appState.imagePrompts, appState.videoPrompts);
      setAppState(prev => ({ ...prev, jsonPrompts: jsonResults, step: AppStep.JSON_PROMPTS_RESULTS }));
    } catch (e) {
      console.error(e);
      setAppState(prev => ({ ...prev, error: 'Failed to generate JSON prompts.', step: AppStep.VIDEO_PROMPTS_RESULTS }));
    }
  }, [appState.imagePrompts, appState.videoPrompts]);

  const handleBack = useCallback((toStep: AppStep) => {
    setAppState(prev => ({ ...prev, step: toStep, error: null }));
  }, []);

  const handleReset = useCallback(() => {
    setAppState({
      step: AppStep.SCRIPT_INPUT,
      script: '',
      scriptSummary: '',
      sceneCount: 3,
      imageStyle: '',
      styleImage: null,
      imagePrompts: null,
      videoPrompts: null,
      jsonPrompts: null,
      error: null,
      isLoading: false,
    });
  }, []);
  
  const renderStep = () => {
    switch (appState.step) {
      case AppStep.SCRIPT_INPUT:
        return <Step1ScriptInput onScriptSubmit={handleScriptSubmit} />;
      case AppStep.SCENE_PACING:
        return <Step2ScenePacing onPacingSubmit={handlePacingSubmit} onBack={() => handleBack(AppStep.SCRIPT_INPUT)} summary={appState.scriptSummary} isLoading={appState.isLoading} sceneCount={appState.sceneCount} setSceneCount={(count) => setAppState(prev => ({...prev, sceneCount: count}))} />;
      case AppStep.STYLE_INPUT:
        return <Step3StyleInput onStyleSubmit={handleStyleSubmit} onBack={() => handleBack(AppStep.SCENE_PACING)} />;
      case AppStep.LOADING:
        return <Step4Loading hasImage={!!appState.styleImage} />;
      case AppStep.IMAGE_PROMPTS_RESULTS:
        return appState.imagePrompts ? (
            <Step5ImageResults 
                imagePrompts={appState.imagePrompts}
                onGenerateVideo={handleGenerateVideoPrompts}
                onDeclineVideo={handleReset} 
            />
        ) : <Step4Loading title="Loading" message="Preparing results..." />;
      case AppStep.VIDEO_PROMPTS_LOADING:
        return <Step4Loading title="Generating Videos" message="Crafting cinematic video prompts..." />;
      case AppStep.VIDEO_PROMPTS_RESULTS:
        return appState.imagePrompts && appState.videoPrompts ? (
            <Step6VideoResults
                imagePrompts={appState.imagePrompts}
                videoPrompts={appState.videoPrompts}
                onGenerateJson={handleGenerateJsonPrompts}
                onReset={handleReset}
            />
        ) : <Step4Loading title="Loading" message="Preparing results..." />;
      case AppStep.JSON_PROMPTS_LOADING:
         return <Step4Loading title="Structuring Data" message="Building the detailed JSON output..." />;
      case AppStep.JSON_PROMPTS_RESULTS:
        return appState.jsonPrompts ? (
            <Step7JsonResults 
                jsonPrompts={appState.jsonPrompts}
                onReset={handleReset}
            />
        ) : <Step4Loading title="Loading" message="Preparing results..." />;
      default:
        return <Step1ScriptInput onScriptSubmit={handleScriptSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-8">
        {renderStep()}
        {appState.error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-center">
                <p><strong>Error:</strong> {appState.error}</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;