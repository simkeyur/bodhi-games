import { doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useGameScore = (gameId: string) => {
    const { user } = useAuth();

    const saveScore = async (score: number) => {
        if (!user) return; // Don't save if not logged in

        try {
            const userScoreRef = doc(db, 'users', user.uid, 'scores', gameId);

            // Check if doc exists to decide set vs update (or just set with merge)
            // We want to keep the high score
            const docSnap = await getDoc(userScoreRef);

            if (docSnap.exists()) {
                const currentBest = docSnap.data().bestScore || 0;
                if (score > currentBest) {
                    await updateDoc(userScoreRef, {
                        bestScore: score,
                        lastPlayed: new Date(),
                        totalPlays: increment(1)
                    });
                } else {
                    await updateDoc(userScoreRef, {
                        lastPlayed: new Date(),
                        totalPlays: increment(1)
                    });
                }
            } else {
                await setDoc(userScoreRef, {
                    bestScore: score,
                    lastPlayed: new Date(),
                    totalPlays: 1
                });
            }
            console.log(`Score saved for ${gameId}: ${score}`);
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    return { saveScore };
};
