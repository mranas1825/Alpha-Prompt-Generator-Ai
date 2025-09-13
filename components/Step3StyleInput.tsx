import React, { useState, useCallback } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import type { StyleImage } from '../types';
import { UploadIcon } from './icons/Icons';
import { convertFileToBase64 } from '../utils';


interface Step3StyleInputProps {
  onStyleSubmit: (style: string, image: StyleImage | null) => void;
  onBack: () => void;
}

export const Step3StyleInput: React.FC<Step3StyleInputProps> = ({ onStyleSubmit, onBack }) => {
  const [style, setStyle] = useState('');
  const [image, setImage] = useState<StyleImage | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (style.trim() || image) {
      onStyleSubmit(style.trim(), image);
    }
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await convertFileToBase64(file);
        setImage({ base64, mimeType });
        setFileName(file.name);
        setPreviewUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error processing file:", error);
        // You could add user-facing error handling here
      }
    }
  }, []);
  
  const removeImage = () => {
    setImage(null);
    setFileName('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  return (
    <Card className="animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100">Step 3: Define Image Style</h2>
      <p className="text-center text-slate-400 mt-2 mb-6">Enter a style description, upload a reference image, or both!</p>
      <form onSubmit={handleSubmit}>
        
        {/* Text Style Input */}
        <div>
            <label htmlFor="style-text" className="block text-sm font-medium text-slate-300 mb-2">Style Description</label>
            <input
              id="style-text"
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Cinematic, hyperrealistic, 8k, volumetric lighting"
              className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            />
        </div>

        <div className="my-6 h-px bg-slate-700"></div>

        {/* Image Style Input */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Style from Image (Optional)</label>
            {previewUrl ? (
                <div className="mt-2 text-center">
                    <img src={previewUrl} alt="Style preview" className="max-h-48 w-auto inline-block rounded-lg border-2 border-slate-600"/>
                    <p className="text-sm text-slate-400 mt-2 truncate">{fileName}</p>
                    <button type="button" onClick={removeImage} className="text-sm text-red-400 hover:text-red-300 mt-1">Remove Image</button>
                </div>
            ) : (
                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-lg border-2 border-dashed border-slate-500 flex flex-col justify-center items-center p-6 text-center transition-colors">
                    <UploadIcon className="w-8 h-8 text-slate-400"/>
                    <span className="mt-2 block text-sm font-semibold text-slate-200">Upload a reference image</span>
                    <span className="mt-1 block text-xs text-slate-400">PNG, JPG, GIF up to 10MB</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
            )}
        </div>


        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button onClick={onBack} variant="secondary" type="button" className="w-full sm:w-auto">
            Back
          </Button>
          <Button type="submit" disabled={!style.trim() && !image} className="w-full sm:w-auto">
            Generate Image Prompts
          </Button>
        </div>
      </form>
    </Card>
  );
};