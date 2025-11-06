import { GoogleGenAI, Type } from '@google/genai';
import { SheetRow } from '../types';

// Fix: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            slno: { type: Type.STRING, description: 'Sequential serial number, e.g., "1", "2".' },
            slate: { type: Type.STRING, description: 'Slate and take number, e.g., "A001C002_220101_R123", "SC-10 T-1".' },
            cameraName: { type: Type.STRING, description: 'Camera identifier, e.g., "A Cam", "B Cam".' },
            cameraModel: { type: Type.STRING, description: 'Camera model name, e.g., "ARRI Alexa Mini LF", "RED Komodo".' },
            clipNo: { type: Type.STRING, description: 'Clip or file name, e.g., "A001_C001.mxf".' },
            lens: { type: Type.STRING, description: 'Lens used, e.g., "50mm Cooke Anamorphic".' },
            height: { type: Type.STRING, description: 'Camera height from ground, e.g., "1.5m", "4ft".' },
            focus: { type: Type.STRING, description: 'Focal distance, e.g., "2m", "6ft".' },
            fps: { type: Type.STRING, description: 'Frames per second, e.g., "24", "48".' },
            shutter: { type: Type.STRING, description: 'Shutter angle or speed, e.g., "180d", "1/48s".' },
            notes: { type: Type.STRING, description: 'Any relevant notes for the shot, e.g., "Good take", "VFX marker tracking issue".' },
        },
        required: ['slno', 'slate', 'cameraName', 'cameraModel', 'clipNo', 'lens', 'height', 'focus', 'fps', 'shutter', 'notes'],
    },
};

export const generateSampleData = async (): Promise<Omit<SheetRow, 'id'>[]> => {
  // Fix: Per coding guidelines, check for process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a list of 5 realistic camera log entries for a visual effects heavy sci-fi action scene. Include varied and plausible technical details for each entry.',
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text;
    const data = JSON.parse(jsonText);

    if (!Array.isArray(data)) {
        throw new Error("API did not return an array.");
    }

    return data;
  } catch (error) {
    console.error("Error generating sample data with Gemini:", error);
    throw new Error("Failed to generate sample data. Please check your API key and network connection.");
  }
};
