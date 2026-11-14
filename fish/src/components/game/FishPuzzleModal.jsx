import React, { useState, useEffect } from 'react';
import soundService from '../../services/soundService';

export const FishPuzzleModal = ({
    isOpen,
    puzzle,
    isLoading,
    roundNumber,
    lives,
    onSolveCorrect,
    onTimeOut,
}) => {
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);

    useEffect(() => {
        setSelectedNumber(null);
        setErrorMessage(null);
        setIsSuccess(false);
        setTimeLeft(45);
    }, [puzzle]);

    useEffect(() => {
        if (!isOpen || isLoading || isSuccess || !puzzle)
            return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    soundService.playIncorrect();
                    if (onTimeOut) {
                        onTimeOut();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, isLoading, isSuccess, puzzle, onTimeOut]);

    useEffect(() => {
        if (!isOpen)
            return;
        const handleKey = (e) => {
            if (isLoading || isSuccess)
                return;
            const num = parseInt(e.key, 10);
            if (!isNaN(num) && num >= 0 && num <= 9) {
                soundService.playClick();
                setSelectedNumber(num);
                setErrorMessage(null);
            }
            else if (e.key === 'Enter' && selectedNumber !== null) {
                e.preventDefault();
                verifyAnswer(selectedNumber);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, isLoading, isSuccess, selectedNumber, puzzle]);

    const verifyAnswer = (num) => {
        if (!puzzle)
            return;
        if (num === puzzle.fishCount) {
            setIsSuccess(true);
            setErrorMessage(null);
            soundService.playVictory();
            setTimeout(() => {
                onSolveCorrect(puzzle.fishCount, puzzle.chestCount);
            }, 650);
        }
        else {
            soundService.playIncorrect();
            setErrorMessage('Incorrect, look closely at the image!');
        }
    };

    const handleSelectNumber = (num) => {
        soundService.playClick();
        setSelectedNumber(num);
        setErrorMessage(null);
    };

    const handleSubmit = () => {
        if (selectedNumber === null) {
            setErrorMessage('Please select a number first.');
            return;
        }
        verifyAnswer(selectedNumber);
    };

    if (!isOpen)
        return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none">
            <div
                className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-3.5 text-white shadow-2xl border-2 border-cyan-400/60 overflow-hidden"
                style={{
                    background: 'linear-gradient(165deg, rgba(3, 29, 58, 0.97) 0%, rgba(2, 18, 38, 0.99) 100%)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.25)',
                }}
            >
                <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-400/30">
                            Round {roundNumber}
                        </span>
                        <div
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                                timeLeft <= 10
                                    ? 'bg-red-500/25 text-red-400 border border-red-500/50 animate-pulse'
                                    : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
                            }`}
                        >
                            <span>⏱️</span>
                            <span>{timeLeft}s</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3].map((heart) => (
                            <span
                                key={heart}
                                className={`text-sm transition-opacity duration-300 ${
                                    heart <= lives ? 'opacity-100' : 'opacity-20 grayscale'
                                }`}
                            >
                                ❤️
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative w-full h-[200px] rounded-2xl bg-slate-950/80 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center overflow-hidden shadow-inner">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                            <span>Loading puzzle...</span>
                        </div>
                    ) : puzzle?.imageData ? (
                        <img src={puzzle.imageData} alt="Fish puzzle" className="w-full h-full object-contain p-2" />
                    ) : (
                        <span className="text-xs text-slate-500">Failed to load puzzle.</span>
                    )}

                    {isSuccess && (
                        <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-emerald-300 animate-fade-in">
                            <span className="text-3xl">✓</span>
                            <span className="text-sm font-bold">Correct! Starting round...</span>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-white tracking-wide">
                        How many fish do you see?
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleSelectNumber(num)}
                                disabled={isLoading || isSuccess}
                                className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                                    selectedNumber === num
                                        ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/40 scale-105 border border-white/60'
                                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 border border-cyan-400/20'
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {[5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleSelectNumber(num)}
                                disabled={isLoading || isSuccess}
                                className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                                    selectedNumber === num
                                        ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/40 scale-105 border border-white/60'
                                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 border border-cyan-400/20'
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-center text-rose-400 text-xs font-bold animate-shake">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || isSuccess || selectedNumber === null}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 hover:from-sky-400 text-white font-black text-sm shadow-lg shadow-blue-900/60 border border-white/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                    Submit Answer
                </button>
            </div>
        </div>
    );
};

export default FishPuzzleModal;
