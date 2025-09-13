export enum AppStep {
    SCRIPT_INPUT,
    SCENE_PACING,
    STYLE_INPUT,
    LOADING,
    IMAGE_PROMPTS_RESULTS,
    VIDEO_PROMPTS_LOADING,
    VIDEO_PROMPTS_RESULTS,
    JSON_PROMPTS_LOADING,
    JSON_PROMPTS_RESULTS,
}

export interface ImagePrompt {
  scene: number;
  image_prompt: string;
}

export interface VideoPrompt {
  scene: number;
  video_prompt: string;
}

export interface JsonPrompt {
    scene: number;
    scene_description: string;
    style: string;
    camera_motion: string;
    elements: {
        type: string;
        description: string;
    }[];
    duration: string;
    resolution: string;
}

export interface StyleImage {
    base64: string;
    mimeType: string;
}

export interface AppState {
    step: AppStep;
    script: string;
    scriptSummary: string;
    sceneCount: number;
    imageStyle: string;
    styleImage: StyleImage | null;
    imagePrompts: ImagePrompt[] | null;
    videoPrompts: VideoPrompt[] | null;
    jsonPrompts: JsonPrompt[] | null;
    error: string | null;
    isLoading: boolean;
}
