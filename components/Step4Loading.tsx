import React, { useState, useEffect } from 'react';
import { LoadingSpinnerIcon } from './icons/Icons';
import { Card } from './Card';

const loadingMessages = [
    "Warming up the director's chair...",
    "Consulting with the AI cinematographer...",
    "Storyboarding your scenes...",
    "Adjusting the virtual camera lenses...",
    "Adding a touch of cinematic magic...",
    "Finalizing the shot list..."
];

const imageAnalysisMessage = "Analyzing your style reference image...";

interface Step4LoadingProps {
    hasImage?: boolean;
    title?: string;
    message?: string;
}

export const Step4Loading: React.FC<Step4LoadingProps> = ({ hasImage = false, title = "Generating Prompts", message }) => {
    const [currentMessage, setCurrentMessage] = useState(message || (hasImage ? imageAnalysisMessage : loadingMessages[0]));

    useEffect(() => {
        // If a static message is provided, just use it and don't start the interval.
        if (message) {
            setCurrentMessage(message);
            return;
        }

        let messageList = loadingMessages;
        if (hasImage) {
            messageList = [imageAnalysisMessage, ...loadingMessages];
        }

        const intervalId = setInterval(() => {
            setCurrentMessage(prevMessage => {
                const currentIndex = messageList.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messageList.length;
                return messageList[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, [hasImage, message]);

    return (
        <Card className="flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-fade-in">
            <LoadingSpinnerIcon className="w-12 h-12 sm:w-16 h-16 text-purple-400"/>
            <h2 className="text-xl sm:text-2xl font-bold mt-6 text-slate-100">{title}</h2>
            <p className="text-slate-400 mt-2 transition-opacity duration-500">{currentMessage}</p>
        </Card>
    );
};