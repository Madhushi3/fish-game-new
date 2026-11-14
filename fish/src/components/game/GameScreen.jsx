import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameEngine from './GameEngine';

export const GameScreen = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat p-1 sm:p-3 flex flex-col justify-center items-center overflow-x-hidden relative"
            style={{
                backgroundImage: "url('/ocean-bg.jpg')",
                backgroundColor: '#0284c7',
            }}
        >
            <div className="absolute inset-0 bg-sky-950/25 backdrop-blur-[1px] pointer-events-none"/>
            <div className="relative z-10 w-full flex justify-center">
                <GameEngine
                    onMainMenu={() => navigate('/dashboard')}
                    onLeaderboard={() => navigate('/leaderboard')}
                />
            </div>
        </div>
    );
};
export default GameScreen;
