import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Gemini API Key is missing! Restart the dev server if you just added .env.");
}

// Only init if key exists to avoid errors
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface LevelConfig {
    gridSize: number;
    robotPos: { x: number, y: number };
    goalPos: { x: number, y: number };
    obstacles?: { x: number, y: number }[]; /* Future proofing */
    message?: string;
}

export const generateLevel = async (levelNumber: number): Promise<LevelConfig> => {
    // Immediate fallback if no key
    if (!genAI) {
        console.error("Gemini API not initialized.");
        return {
            gridSize: 4,
            robotPos: { x: 0, y: 0 },
            goalPos: { x: 2, y: 2 },
            message: "AI Offline: Using offline level. Restart server to fix!"
        };
    }

    try {
        // Use gemma-2-27b-it as requested
        const model = genAI.getGenerativeModel({ model: "gemma-2-27b-it" });

        const difficulty = levelNumber <= 3 ? "easy" : levelNumber <= 6 ? "medium" : "hard";

        const prompt = `
        You are a level designer for a grid-based programming game for kids.
        Generate a level configuration in JSON format.
        
        Current Level: ${levelNumber} (${difficulty})
        
        Constraints:
        - Grid Size: 
          - Easy (Lvl 1-3): 4x4
          - Medium (Lvl 4-6): 5x5
          - Hard (Lvl 7+): 6x6
        - Robot Start: Usually (0,0) or corners.
        - Goal Position: Must be reachable. Farther away for higher levels.
        - Output strictly valid JSON. No markdown formatting.
        
        Response Format:
        {
            "gridSize": number,
            "robotPos": {"x": number, "y": number},
            "goalPos": {"x": number, "y": number},
            "message": "Short encouraging text for this level"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present (e.g. ```json ... ```)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr) as LevelConfig;
        return data;

    } catch (error) {
        console.error("Failed to generate level with Gemini:", error);
        // Fallback level to prevent game crash
        return {
            gridSize: 4,
            robotPos: { x: 0, y: 0 },
            goalPos: { x: 3, y: 3 },
            message: "Fallback Level (AI generation failed)"
        };
    }
};
