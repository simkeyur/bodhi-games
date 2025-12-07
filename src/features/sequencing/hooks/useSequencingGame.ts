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
    obstacles: Position[];
    gridSize: number;
    isPlaying: boolean;
    isWon: boolean;
    isFailed: boolean; // New state
    sequence: Command[];
    currentStepIndex: number; // For highlighting active command
}

export const useSequencingGame = () => {
    // Level 1 configuration
    const [gameState, setGameState] = useState<GameState>({
        robotPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 2 },
        obstacles: [],
        gridSize: 4,
        isPlaying: false,
        isWon: false,
        isFailed: false,
        sequence: [],
        currentStepIndex: -1,
    });

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            robotPos: { x: 0, y: 0 },
            isPlaying: false,
            isWon: false,
            isFailed: false,
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
        setGameState(prev => ({ ...prev, isPlaying: true, isWon: false, isFailed: false, robotPos: { x: 0, y: 0 }, currentStepIndex: -1 }));
    }, [gameState.sequence]);

    // Game Loop
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Calculate Ghost Position (Preview)
    const ghostPos = (() => {
        let { x, y } = { x: 0, y: 0 };
        for (const cmd of gameState.sequence) {
            if (cmd === 'up') y = Math.max(0, y - 1);
            if (cmd === 'down') y = Math.min(gameState.gridSize - 1, y + 1);
            if (cmd === 'left') x = Math.max(0, x - 1);
            if (cmd === 'right') x = Math.min(gameState.gridSize - 1, x + 1);
        }
        return { x, y };
    })();

    useEffect(() => {
        // Cleanup function first to handle re-renders/unmounts
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!gameState.isPlaying || gameState.isWon || gameState.isFailed) return;

        // Reset step index implicitly by starting logic
        // We rely on currentStepIndex initialized to -1 in runSequence

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                setGameState(prev => {
                    const nextStep = prev.currentStepIndex + 1;

                    // Execute move
                    if (nextStep < prev.sequence.length) {
                        const cmd = prev.sequence[nextStep];
                        let { x, y } = prev.robotPos;

                        if (cmd === 'up') y = Math.max(0, y - 1);
                        if (cmd === 'down') y = Math.min(prev.gridSize - 1, y + 1);
                        if (cmd === 'left') x = Math.max(0, x - 1);
                        if (cmd === 'right') x = Math.min(prev.gridSize - 1, y + 1);

                        // Check Obstacle Collision
                        const hitObstacle = prev.obstacles.some(obs => obs.x === x && obs.y === y);

                        if (hitObstacle) {
                            if (intervalRef.current) clearInterval(intervalRef.current);
                            return {
                                ...prev,
                                robotPos: { x, y },
                                currentStepIndex: nextStep,
                                isPlaying: false,
                                isFailed: true
                            };
                        }

                        return {
                            ...prev,
                            robotPos: { x, y },
                            currentStepIndex: nextStep
                        };
                    } else {
                        // Sequence finished
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        const won = prev.robotPos.x === prev.goalPos.x && prev.robotPos.y === prev.goalPos.y;
                        return { ...prev, isPlaying: false, isWon: won, isFailed: !won, currentStepIndex: -1 };
                    }
                });
            }, 600);
        }, 500); // 500ms initial pause

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gameState.isPlaying, gameState.isWon, gameState.isFailed]);

    // Level Management
    const loadLevel = useCallback((config: { gridSize: number, robotPos: Position, goalPos: Position, obstacles?: Position[] }) => {
        setGameState(prev => ({
            ...prev,
            gridSize: config.gridSize,
            robotPos: config.robotPos,
            goalPos: config.goalPos,
            obstacles: config.obstacles || [],
            sequence: [],
            isPlaying: false,
            isWon: false,
            isFailed: false,
            currentStepIndex: -1
        }));
    }, []);

    return {
        gameState,
        ghostPos,
        addCommand,
        removeCommand,
        clearSequence,
        runSequence,
        resetGame,
        loadLevel
    };
};
