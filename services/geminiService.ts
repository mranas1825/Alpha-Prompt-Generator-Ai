import { GoogleGenAI, Type } from "@google/genai";
import type { ImagePrompt, StyleImage, VideoPrompt, JsonPrompt } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const summarizeScript = async (script: string): Promise<string> => {
    try {
        const prompt = `In one sentence, analyze the following script and describe its main theme or subject. Script: "${script}"`;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing script:", error);
        throw new Error("Failed to communicate with the AI for script summarization.");
    }
};

export const generateImagePrompts = async (script: string, sceneCount: number, imageStyle: string, styleImage: StyleImage | null): Promise<ImagePrompt[]> => {
    const textPrompt = `
        You are an expert film director and prompt engineer. Your task is to break down a script into a specific number of scenes and generate exceptionally detailed and creative prompts for an AI image generator.

        **Script:**
        "${script}"

        **Instructions:**
        1.  Analyze the script and divide it into exactly ${sceneCount} distinct, logical scenes.
        2.  For each scene, create a very detailed **Image Prompt** in an infographic style, similar to prompts for Leonardo or MidJourney.
        3.  Each Image Prompt must be a rich, descriptive paragraph of at least 40 words. Describe the visual elements, composition, colors, and overall aesthetic in a way that an AI image generator can create a high-quality, visually appealing infographic.
        4.  If a text style is provided, infuse it into every single Image Prompt. Style: "${imageStyle}".
        5.  If a reference image is provided, analyze its artistic style (e.g., color palette, lighting, composition, texture) and apply that style meticulously to every prompt.
        6.  Return the output as a JSON array.
    `;

    const contents = {
        parts: styleImage ? [
            { text: textPrompt },
            {
                inlineData: {
                    mimeType: styleImage.mimeType,
                    data: styleImage.base64,
                }
            }
        ] : [{ text: textPrompt }]
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene: {
                                type: Type.INTEGER,
                                description: "The scene number, starting from 1.",
                            },
                            image_prompt: {
                                type: Type.STRING,
                                description: "The highly detailed, infographic-style prompt for the AI image generator.",
                            },
                        },
                        required: ["scene", "image_prompt"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as ImagePrompt[];

    } catch (error) {
        console.error("Error generating image prompts:", error);
        throw new Error("Failed to generate image prompts from the AI.");
    }
};


export const generateVideoPrompts = async (imagePrompts: ImagePrompt[]): Promise<VideoPrompt[]> => {
    const prompt = `
        You are an expert video animator. Based on the following set of detailed image prompts, generate a corresponding cinematic, motion-based descriptive **Video Prompt** for each scene.

        **Image Prompts:**
        ${JSON.stringify(imagePrompts, null, 2)}

        **Instructions:**
        1. For each scene, create one corresponding video prompt in the style of advanced video generation models like Kling AI or Hailuo AI.
        2. Describe dynamic camera movements (e.g., dolly zoom, crane shot, tracking shot), character actions, environmental effects (e.g., wind, rain), and seamless transitions to create a visually stunning and coherent video sequence.
        3. Return the output as a JSON array.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene: {
                                type: Type.INTEGER,
                                description: "The scene number, starting from 1.",
                            },
                            video_prompt: {
                                type: Type.STRING,
                                description: "The corresponding cinematic, motion-based prompt for the AI video generator.",
                            },
                        },
                        required: ["scene", "video_prompt"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as VideoPrompt[];

    } catch (error) {
        console.error("Error generating video prompts:", error);
        throw new Error("Failed to generate video prompts from the AI.");
    }
};

export const generateJsonPrompts = async (imagePrompts: ImagePrompt[], videoPrompts: VideoPrompt[]): Promise<JsonPrompt[]> => {
    const combinedPrompts = imagePrompts.map(imgPrompt => {
        const vidPrompt = videoPrompts.find(vp => vp.scene === imgPrompt.scene);
        return {
            scene: imgPrompt.scene,
            image_prompt: imgPrompt.image_prompt,
            video_prompt: vidPrompt ? vidPrompt.video_prompt : "N/A",
        }
    });

    const prompt = `
        You are a meticulous data architect. Your task is to convert a series of scene descriptions (image and video prompts) into a structured JSON format. Analyze the provided prompts for each scene and extract the key details.

        **Scene Prompts:**
        ${JSON.stringify(combinedPrompts, null, 2)}

        **Instructions:**
        1.  For each scene, create a single JSON object.
        2.  Populate the properties based on the details in the prompts. Infer reasonable values where necessary (e.g., duration, resolution).
        3.  The 'elements' property should be an array of objects, each describing a key visual component in the scene.
        4.  Return the output as a JSON array of these objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene: { type: Type.INTEGER },
                            scene_description: { type: Type.STRING, description: "A concise summary of the scene's content from the image prompt." },
                            style: { type: Type.STRING, description: "The overall visual style (e.g., Minimalistic infographic, cinematic, hyperrealistic)." },
                            camera_motion: { type: Type.STRING, description: "The specific camera movement or animation from the video prompt." },
                            elements: {
                                type: Type.ARRAY,
                                description: "Key visual elements in the scene.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING, description: "The type of element (e.g., map, character, icon, text)." },
                                        description: { type: Type.STRING, description: "A detailed description of the element." }
                                    },
                                    required: ["type", "description"]
                                }
                            },
                            duration: { type: Type.STRING, description: "An estimated duration for the video clip, e.g., '8 seconds'." },
                            resolution: { type: Type.STRING, description: "The target resolution, e.g., '4K', '1080p'." }
                        },
                        required: ["scene", "scene_description", "style", "camera_motion", "elements", "duration", "resolution"]
                    }
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as JsonPrompt[];

    } catch (error) {
        console.error("Error generating JSON prompts:", error);
        throw new Error("Failed to generate structured JSON prompts from the AI.");
    }
};
