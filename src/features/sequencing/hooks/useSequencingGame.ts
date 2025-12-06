import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Command = Direction;

interface Position {
    x: number;
    y: number;
}

interface GameState {
    robotPos: Position;
    goalPos: Position;
    gridSize: number;
    isPlaying: boolean;
    isWon: boolean;
    sequence: Command[];
    currentStepIndex: number; // For highlighting active command
}

export const useSequencingGame = () => {
    // Level 1 configuration
    const [gameState, setGameState] = useState<GameState>({
        robotPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 2 }, // Fixed goal for now
        gridSize: 4,
        isPlaying: false,
        isWon: false,
        sequence: [],
        currentStepIndex: -1,
    });

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            robotPos: { x: 0, y: 0 },
            isPlaying: false,
            isWon: false,
            currentStepIndex: -1,
        }));
    }, []);

    const clearSequence = useCallback(() => {
        setGameState(prev => ({ ...prev, sequence: [] }));
        resetGame();
    }, [resetGame]);

    const addCommand = useCallback((cmd: Command) => {
        if (gameState.isPlaying) return;
        setGameState(prev => ({
            ...prev,
            sequence: [...prev.sequence, cmd]
        }));
    }, [gameState.isPlaying]);

    const removeCommand = useCallback((index: number) => {
        if (gameState.isPlaying) return;
        setGameState(prev => ({
            ...prev,
            sequence: prev.sequence.filter((_, i) => i !== index)
        }));
    }, [gameState.isPlaying]);

    const runSequence = useCallback(() => {
        if (gameState.sequence.length === 0) return;
        setGameState(prev => ({ ...prev, isPlaying: true, isWon: false, robotPos: { x: 0, y: 0 }, currentStepIndex: -1 }));
    }, [gameState.sequence]);

    // Game Loop
    const stepRef = useRef(0);

    // Calculate Ghost Position (Preview)
    const ghostPos = (() => {
        let { x, y } = { x: 0, y: 0 }; // Assume starting at 0,0 for Level 1
        for (const cmd of gameState.sequence) {
            if (cmd === 'up') y = Math.max(0, y - 1);
            if (cmd === 'down') y = Math.min(gameState.gridSize - 1, y + 1);
            if (cmd === 'left') x = Math.max(0, x - 1);
            if (cmd === 'right') x = Math.min(gameState.gridSize - 1, x + 1);
        }
        return { x, y };
    })();

    useEffect(() => {
        if (!gameState.isPlaying || gameState.isWon) return;

        stepRef.current = 0;

        // Initial delay to let the robot reset to 0,0 visually before moving
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setGameState(prev => {
                    const currentStep = stepRef.current;

                    if (currentStep >= prev.sequence.length) {
                        clearInterval(interval);
                        // Check win condition based on FINAL position after last move
                        const won = prev.robotPos.x === prev.goalPos.x && prev.robotPos.y === prev.goalPos.y;
                        return { ...prev, isPlaying: false, isWon: won, currentStepIndex: -1 };
                    }

                    const cmd = prev.sequence[currentStep];
                    let { x, y } = prev.robotPos;

                    // Move logic
                    if (cmd === 'up') y = Math.max(0, y - 1);
                    if (cmd === 'down') y = Math.min(prev.gridSize - 1, y + 1);
                    if (cmd === 'left') x = Math.max(0, x - 1);
                    if (cmd === 'right') x = Math.min(prev.gridSize - 1, x + 1);

                    stepRef.current++; // Increment for next tick

                    return {
                        ...prev,
                        robotPos: { x, y },
                        currentStepIndex: currentStep
                    };
                });
            }, 600); // Faster 600ms per step

            return () => clearInterval(interval);
        }, 500); // 500ms initial pause

        return () => clearTimeout(startTimeout);
    }, [gameState.isPlaying, gameState.isWon]); // dependencies simplified as sequence doesn't change during play

    return {
        gameState,
        ghostPos,
        addCommand,
        removeCommand,
        clearSequence,
        runSequence,
        resetGame
    };
};
