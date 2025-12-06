import { useState, useEffect, useCallback, useRef } from 'react';

export type ItemType = 'red' | 'blue' | 'star' | 'circle';
export type BinType = 'red' | 'blue' | 'shape';

export interface GameItem {
    id: string;
    type: ItemType;
    x: number; // Position on belt (0 to 100%)
}

interface SortingGameState {
    items: GameItem[];
    score: number;
    lives: number;
    level: number;
    isPlaying: boolean;
    gameOver: boolean;
}

export const useSortingGame = () => {
    const [gameState, setGameState] = useState<SortingGameState>({
        items: [],
        score: 0,
        lives: 3,
        level: 1,
        isPlaying: false,
        gameOver: false,
    });

    const spawnInterval = useRef<number | null>(null);

    const startGame = useCallback(() => {
        setGameState({
            items: [],
            score: 0,
            lives: 3,
            level: 1,
            isPlaying: true,
            gameOver: false,
        });
    }, []);

    const spawnItem = useCallback(() => {
        const types: ItemType[] = ['red', 'blue']; // Level 1 types
        const randomType = types[Math.floor(Math.random() * types.length)];

        const newItem: GameItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: randomType,
            x: -20, // Start off-screen
        };

        setGameState(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));
    }, []);

    const verifySort = useCallback((itemId: string, binType: BinType) => {
        setGameState(prev => {
            const item = prev.items.find(i => i.id === itemId);
            if (!item) return prev;

            let isCorrect = false;
            if (binType === 'red' && item.type === 'red') isCorrect = true;
            if (binType === 'blue' && item.type === 'blue') isCorrect = true;

            return {
                ...prev,
                items: prev.items.filter(i => i.id !== itemId),
                score: isCorrect ? prev.score + 10 : prev.score,
                lives: isCorrect ? prev.lives : Math.max(0, prev.lives - 1),
                gameOver: (!isCorrect && prev.lives <= 1) ? true : prev.gameOver,
                isPlaying: (!isCorrect && prev.lives <= 1) ? false : prev.isPlaying,
            };
        });
    }, []);

    // Game Loop (Conveyor Belt)
    useEffect(() => {
        if (!gameState.isPlaying || gameState.gameOver) return;

        const loop = setInterval(() => {
            setGameState(prev => {
                // Move items
                const newItems = prev.items.map(item => ({
                    ...item,
                    x: item.x + 0.5 // Speed
                })).filter(item => item.x < 120); // Remove if off screen

                // Simple check if missed (reached end without sort)
                const missedItems = prev.items.filter(item => item.x >= 100 && item.x < 101);
                const lostLife = missedItems.length > 0;

                if (lostLife) {
                    // TODO: Flash screen or sound
                }

                return {
                    ...prev,
                    items: newItems,
                    lives: lostLife ? Math.max(0, prev.lives - missedItems.length) : prev.lives,
                    gameOver: (lostLife && prev.lives <= missedItems.length) ? true : prev.gameOver,
                    isPlaying: (lostLife && prev.lives <= missedItems.length) ? false : prev.isPlaying
                };
            });
        }, 50);

        return () => clearInterval(loop);
    }, [gameState.isPlaying, gameState.gameOver]);

    // Spawner
    useEffect(() => {
        if (!gameState.isPlaying || gameState.gameOver) {
            if (spawnInterval.current) clearInterval(spawnInterval.current);
            return;
        }

        spawnInterval.current = setInterval(spawnItem, 3000); // New item every 3s
        return () => {
            if (spawnInterval.current) clearInterval(spawnInterval.current);
        };
    }, [gameState.isPlaying, gameState.gameOver, spawnItem]);

    return {
        gameState,
        startGame,
        verifySort
    };
};
