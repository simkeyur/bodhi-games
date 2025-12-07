import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("CRITICAL: Gemini API Key is missing! .env variables might not be loaded in production.");
    console.error("Make sure VITE_GEMINI_API_KEY is set in your Firebase/Vercel dashboard.");
}

// Only init if key exists to avoid errors
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface LevelConfig {
    gridSize: number;
    robotPos: { x: number, y: number };
    goalPos: { x: number, y: number };
    obstacles?: { x: number, y: number }[]; /* Future proofing */
    message?: string;
    isAiGenerated: boolean;
}

export const generateLevel = async (levelNumber: number): Promise<LevelConfig> => {
    // Immediate fallback if no key
    if (!genAI) {
        console.error("Gemini API not initialized.");
        return {
            gridSize: 4,
            robotPos: { x: 0, y: 0 },
            goalPos: { x: 2, y: 2 },
            message: "AI Offline: Using offline level. Restart server to fix!",
            isAiGenerated: false
        };
    }

    try {
        // Use gemma-3-27b-it as discovered via API
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

        // Progressive Difficulty Logic
        // Level 1: 4x4, No obstacles
        // Level 2: 4x4, 1 obstacle
        // Level 3: 5x5, 2 obstacles
        // ...
        // Level 7: 8x8, Many obstacles

        const gridSize = Math.min(8, 4 + Math.floor((levelNumber - 1) / 2));
        const obstacleCount = Math.max(0, levelNumber - 1);

        const prompt = `
        You are a level designer for a grid-based programming game for kids.
        Generate a level configuration in JSON format.
        
        Current Level: ${levelNumber}
        Target Grid Size: ${gridSize}x${gridSize}
        Target Obstacles: ${obstacleCount}
        
        Constraints:
        - Grid Size: ${gridSize}
        - Robot Start: (0,0) or corners.
        - Goal Position: Must be reachable.
        - Obstacles: Place ${obstacleCount} obstacles at random positions (excluding start/goal).
        - Message: Engaging text related to Space/Robots.
        
        Response Format:
        {
            "gridSize": number,
            "robotPos": {"x": number, "y": number},
            "goalPos": {"x": number, "y": number},
            "obstacles": [{"x": number, "y": number}],
            "message": "Short encouraging text"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present (e.g. ```json ... ```)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr) as LevelConfig;
        return { ...data, isAiGenerated: true };

    } catch (error) {
        console.error("Failed to generate level with Gemini:", error);
        // Fallback level to prevent game crash
        return {
            gridSize: 4,
            robotPos: { x: 0, y: 0 },
            goalPos: { x: 3, y: 3 },
            message: "Fallback Level (AI generation failed)",
            isAiGenerated: false
        };
    }
};
