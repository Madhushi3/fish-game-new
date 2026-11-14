import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import soundService from '../services/soundService';
import leaderboardService from '../services/leaderboardService';
import confetti from 'canvas-confetti';
const getPlayerStorageKey = (name) => `swimming_player_${name.toLowerCase().trim()}`;
const getSavedPlayerState = (name) => {
    if (!name)
        return null;
    const saved = localStorage.getItem(getPlayerStorageKey(name));
    if (saved) {
        try {
            return JSON.parse(saved);
        }
        catch {
            return null;
        }
    }
    return null;
};
const GameContext = createContext(undefined);
export const GameProvider = ({ children }) => {
    const [playerName, setPlayerName] = useState(() => {
        return sessionStorage.getItem('swimming_active_player') || 'Madhushi';
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return sessionStorage.getItem('swimming_active_session') === 'true';
    });

    const activePlayer = sessionStorage.getItem('swimming_active_player') || 'Madhushi';
    const initialSaved = getSavedPlayerState(activePlayer);
    const [playerTitle, setPlayerTitle] = useState(() => initialSaved?.playerTitle || '⭐ Pro Swimmer');
    const [playerAvatar, setPlayerAvatar] = useState(() => initialSaved?.playerAvatar || '/game-assets/swimmer-avatar.png');
    const [totalFish, setTotalFish] = useState(() => initialSaved?.totalFish ?? 0);
    const [totalTreasures, setTotalTreasures] = useState(() => initialSaved?.totalTreasures ?? 0);
    const [highestScore, setHighestScore] = useState(() => initialSaved?.highestScore ?? 0);
    const [recentGames, setRecentGames] = useState(() => initialSaved?.recentGames ?? []);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const playerNameRef = useRef(playerName);
    playerNameRef.current = playerName;
    const playerTitleRef = useRef(playerTitle);
    playerTitleRef.current = playerTitle;
    const playerAvatarRef = useRef(playerAvatar);
    playerAvatarRef.current = playerAvatar;
    const totalFishRef = useRef(totalFish);
    totalFishRef.current = totalFish;
    const totalTreasuresRef = useRef(totalTreasures);
    totalTreasuresRef.current = totalTreasures;
    const highestScoreRef = useRef(highestScore);
    highestScoreRef.current = highestScore;
    const recentGamesRef = useRef(recentGames);
    recentGamesRef.current = recentGames;
    const lastRecordTimestampRef = useRef(0);

    useEffect(() => {
        if (!playerName || !isLoggedIn)
            return;
        fetch(`/api/history?playerName=${encodeURIComponent(playerName)}`)
            .then((res) => res.json())
            .then((data) => {
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {

                const uniqueGames = [];
                for (const item of data.data) {
                    const isDuplicate = uniqueGames.some((u) => u.score === item.score &&
                        u.fishes === item.fishes &&
                        u.treasures === item.treasures &&
                        u.date === item.date &&
                        u.result === item.result);
                    if (!isDuplicate) {
                        uniqueGames.push(item);
                    }
                }
                setRecentGames(uniqueGames);

                const totalF = uniqueGames.reduce((acc, g) => acc + (g.fishes || 0), 0);
                const totalT = uniqueGames.reduce((acc, g) => acc + (g.treasures || 0), 0);
                const maxS = uniqueGames.reduce((acc, g) => Math.max(acc, g.score || 0), 0);
                setTotalFish(totalF);
                setTotalTreasures(totalT);
                setHighestScore((prev) => Math.max(prev, maxS));

                const key = getPlayerStorageKey(playerName);
                const current = getSavedPlayerState(playerName) || {};
                localStorage.setItem(key, JSON.stringify({
                    ...current,
                    playerName,
                    totalFish: totalF,
                    totalTreasures: totalT,
                    highestScore: Math.max(current.highestScore || 0, maxS),
                    recentGames: uniqueGames,
                }));
            }
        })
            .catch(() => { });
    }, [playerName, isLoggedIn]);
    const toggleSound = () => {
        setSoundEnabled((prev) => !prev);
    };
    const updateProfile = (newName, newTitle, newAvatar) => {
        const finalName = newName.trim() || playerName;
        setPlayerName(finalName);
        if (newTitle)
            setPlayerTitle(newTitle);
        if (newAvatar)
            setPlayerAvatar(newAvatar);
        const key = getPlayerStorageKey(finalName);
        const current = getSavedPlayerState(finalName) || {};
        localStorage.setItem(key, JSON.stringify({
            ...current,
            playerName: finalName,
            playerTitle: newTitle || playerTitle,
            playerAvatar: newAvatar || playerAvatar,
        }));
        const token = localStorage.getItem('fish_escape_auth_token');
        if (token) {
            fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: finalName, title: newTitle, avatar: newAvatar }),
            }).catch(() => { });
        }
    };
    const login = (name, stats) => {
        const finalName = name.trim() || 'Madhushi';
        setPlayerName(finalName);
        setIsLoggedIn(true);
        sessionStorage.setItem('swimming_active_session', 'true');
        sessionStorage.setItem('swimming_active_player', finalName);
        const saved = getSavedPlayerState(finalName);
        if (saved) {
            setTotalFish(saved.totalFish ?? 0);
            setTotalTreasures(saved.totalTreasures ?? 0);
            setHighestScore(saved.highestScore ?? 0);
            setRecentGames(Array.isArray(saved.recentGames) ? saved.recentGames : []);
            if (saved.playerAvatar)
                setPlayerAvatar(saved.playerAvatar);
            if (saved.playerTitle)
                setPlayerTitle(saved.playerTitle);
        }
        else {

            const initialFish = stats?.totalFish ?? 0;
            const initialTreasures = stats?.totalTreasures ?? 0;
            const initialScore = stats?.score ?? 0;
            const initialAvatar = stats?.avatar || '/game-assets/swimmer-avatar.png';
            const initialTitle = stats?.title || '⭐ Pro Swimmer';
            setTotalFish(initialFish);
            setTotalTreasures(initialTreasures);
            setHighestScore(initialScore);
            setRecentGames([]);
            setPlayerAvatar(initialAvatar);
            setPlayerTitle(initialTitle);
            localStorage.setItem(getPlayerStorageKey(finalName), JSON.stringify({
                playerName: finalName,
                playerTitle: initialTitle,
                playerAvatar: initialAvatar,
                totalFish: initialFish,
                totalTreasures: initialTreasures,
                highestScore: initialScore,
                recentGames: [],
            }));
        }

        fetch(`/api/history?playerName=${encodeURIComponent(finalName)}`)
            .then((res) => res.json())
            .then((data) => {
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                setRecentGames(data.data);
            }
        })
            .catch(() => { });
        soundService.playFanfare();
    };
    const register = (name) => {
        login(name);
    };
    const logout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('swimming_active_session');
        sessionStorage.removeItem('swimming_active_player');
        localStorage.removeItem('fish_escape_auth_user');
        localStorage.removeItem('fish_escape_auth_token');
        setTotalFish(0);
        setTotalTreasures(0);
        setHighestScore(0);
        setRecentGames([]);
        soundService.playClick();
    };
    const recordGameResult = (score, fishes, treasures, result) => {
        const now = Date.now();

        if (now - lastRecordTimestampRef.current < 2000) {
            return;
        }
        lastRecordTimestampRef.current = now;
        const curPlayer = playerNameRef.current || 'Madhushi';
        const curTitle = playerTitleRef.current;
        const curAvatar = playerAvatarRef.current;
        const safeScore = score || 0;
        const safeFishes = fishes || 0;
        const safeTreasures = treasures || 0;
        const updatedFish = (totalFishRef.current || 0) + safeFishes;
        const updatedTreasures = (totalTreasuresRef.current || 0) + safeTreasures;
        const updatedScore = Math.max(highestScoreRef.current || 0, safeScore);
        const newEntry = {
            id: 'game_' + now,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            score: safeScore,
            fishes: safeFishes,
            treasures: safeTreasures,
            result,
        };

        const existingGames = recentGamesRef.current || [];
        const updatedGames = [
            newEntry,
            ...existingGames.filter((g) => !(g.score === safeScore &&
                g.fishes === safeFishes &&
                g.treasures === safeTreasures &&
                g.result === result &&
                g.date === newEntry.date)),
        ].slice(0, 10);

        setTotalFish(updatedFish);
        setTotalTreasures(updatedTreasures);
        setHighestScore(updatedScore);
        setRecentGames(updatedGames);

        const key = getPlayerStorageKey(curPlayer);
        const stateToSave = {
            playerName: curPlayer,
            playerTitle: curTitle,
            playerAvatar: curAvatar,
            totalFish: updatedFish,
            totalTreasures: updatedTreasures,
            highestScore: updatedScore,
            recentGames: updatedGames,
        };
        localStorage.setItem(key, JSON.stringify(stateToSave));

        fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerName: curPlayer,
                score: safeScore,
                fishes: safeFishes,
                treasures: safeTreasures,
                result,
            }),
        }).catch(() => { });

        if (safeScore > 0) {
            leaderboardService.submitScore(curPlayer, safeScore);
        }
    };
    const triggerCelebration = () => {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
        });
    };
    return (<GameContext.Provider value={{
            playerName,
            playerTitle,
            playerAvatar,
            isLoggedIn,
            totalFish,
            totalTreasures,
            highestScore,
            recentGames,
            soundEnabled,
            toggleSound,
            login,
            logout,
            register,
            updateProfile,
            recordGameResult,
            triggerCelebration,
        }}>
      {children}
    </GameContext.Provider>);
};
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
export default GameContext;
