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

// Mystery Match Configuration
export interface MysteryMatchConfig {
    pairs: { id: string, item1: string, item2: string }[];
    theme: string;
}

// Odd One Out Configuration
export interface OddOneOutConfig {
    items: { id: string, content: string, isOutlier: boolean }[];
    explanation: string;
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

export const generateMysteryMatch = async (): Promise<MysteryMatchConfig> => {
    if (!genAI) {
        console.error("Gemini API not initialized.");
        return {
            theme: "Offline Fallback",
            pairs: [
                { id: "1", item1: "🐶", item2: "Bone" },
                { id: "2", item1: "🐱", item2: "Yarn" },
                { id: "3", item1: "🌧️", item2: "Umbrella" },
                { id: "4", item1: "🐝", item2: "Flower" }
            ]
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
        const themes = ["Animals", "Space", "Jobs", "Weather", "Food", "Sports"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const prompt = `
        Create a matching pairs game database for kids. Theme: ${randomTheme}.
        Generate 6 conceptual pairs (not identical images).
        Example: If theme is "Ocean", pairs could be "Shark"/"Meat" or "Fish"/"Water" or "Ship"/"Anchor".
        Use Emojis for item1 and simple Words (or Emojis) for item2.

        Response Format (JSON):
        {
            "theme": "${randomTheme}",
            "pairs": [
                { "id": "1", "item1": "emoji", "item2": "text/emoji" }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr) as MysteryMatchConfig;

    } catch (error) {
        console.error("Discovery error:", error);
        return {
            theme: "Error Fallback",
            pairs: [
                { id: "1", item1: "🚀", item2: "Moon" },
                { id: "2", item1: "👨‍🚀", item2: "Suit" },
                { id: "3", item1: "☀️", item2: "Hot" },
                { id: "4", item1: "❄️", item2: "Cold" },
                { id: "5", item1: "🔥", item2: "Fire" },
                { id: "6", item1: "💧", item2: "Water" }
            ]
        };
    }
};

export const generateOddOneOut = async (): Promise<OddOneOutConfig> => {
    if (!genAI) {
        return {
            items: [
                { id: "1", content: "🐶", isOutlier: false },
                { id: "2", content: "🐱", isOutlier: false },
                { id: "3", content: "🐮", isOutlier: false },
                { id: "4", content: "🚗", isOutlier: true }
            ],
            explanation: "The car is a machine, the others are animals! (Offline)"
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

        // Randomize the category to prevent repetitive "Animal/Car" puzzles
        const categories = [
            "Fruits vs Vegetables",
            "Flying things vs Ground things",
            "Hot things vs Cold things",
            "Tools vs Toys",
            "Furniture vs Vehicles",
            "Water animals vs Land animals",
            "Round shapes vs Square shapes"
        ];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const prompt = `
        Create an "Odd One Out" puzzle for a 6-year-old.
        Category Idea: ${randomCategory} (or choose a similar simple concept).
        Generate 4 items: 3 share a common property, 1 does not.
        Use Emojis as content.

        Response Format (JSON):
        {
            "items": [
                { "id": "1", "content": "emoji", "isOutlier": boolean }
            ],
            "explanation": "Simple, child-friendly sentence explaining why it is the outlier."
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr) as OddOneOutConfig;

    } catch (error) {
        console.error("OddOneOut error:", error);
        return {
            items: [
                { id: "1", content: "🍎", isOutlier: false },
                { id: "2", content: "🍌", isOutlier: false },
                { id: "3", content: "🍇", isOutlier: false },
                { id: "4", content: "🍕", isOutlier: true }
            ],
            explanation: "Pizza is junk food (or cooked), others are raw fruits!"
        };
    }
};

// Emoji Equator Configuration
export interface EmojiEquatorConfig {
    equations: string[]; // e.g., ["🍎 + 🍎 = 10", "🍎 + 🍌 = 8"]
    question: string;    // e.g., "🍌 = ?"
    options: number[];   // e.g., [3, 4, 5, 2]
    correctAnswer: number;
    explanation: string;
}

export const generateEmojiEquator = async (): Promise<EmojiEquatorConfig> => {
    // Offline fallback
    if (!genAI) {
        return {
            equations: ["🍎 + 🍎 = 10", "🍎 + 🍌 = 8"],
            question: "🍌 = ?",
            options: [2, 3, 4, 5],
            correctAnswer: 3,
            explanation: "Since 🍎 + 🍎 = 10, 🍎 is 5. Then 5 + 🍌 = 8, so 🍌 must be 3!"
        };
    }

    try {
        // Step 1: Get Creative Content from AI (Reliable)
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
        const themes = ["Fruit", "Animals", "Space", "Fast Food", "Sports", "Nature"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const prompt = `
        Generate 2 different related Emojis for the theme: "${randomTheme}".
        Return JSON: { "emoji1": "char", "emoji2": "char" }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const content = JSON.parse(jsonStr) as { emoji1: string, emoji2: string };

        // Step 2: Generate Math Logic Programmatically (Infallible)
        const val1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const val2 = Math.floor(Math.random() * 9) + 1; // 1 to 9 (different from val1 ideally, but ok)

        const sum1 = val1 * 2;
        const sum2 = val1 + val2;

        const eq1 = `${content.emoji1} + ${content.emoji1} = ${sum1}`;
        const eq2 = `${content.emoji1} + ${content.emoji2} = ${sum2}`;

        // Generate unique options including correct answer
        const optionsSet = new Set<number>();
        optionsSet.add(val2);
        while (optionsSet.size < 4) {
            const wrong = val2 + (Math.floor(Math.random() * 10) - 5); // +/- 5
            if (wrong > 0 && wrong !== val2) optionsSet.add(wrong);
        }
        const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

        return {
            equations: [eq1, eq2],
            question: `${content.emoji2} = ?`,
            options: options,
            correctAnswer: val2,
            explanation: `First: ${content.emoji1} + ${content.emoji1} = ${sum1}, so ${content.emoji1} is ${val1}. Then: ${val1} + ${content.emoji2} = ${sum2}, so ${content.emoji2} is ${val2}!`
        };

    } catch (error) {
        console.error("Emoji Equator error:", error);
        return {
            equations: ["⭐ + ⭐ = 4", "⭐ + 🌙 = 5"],
            question: "🌙 = ?",
            options: [1, 2, 3, 4],
            correctAnswer: 3,
            explanation: "Star is 2. 2 + Moon = 5, so Moon is 3."
        };
    }
};
