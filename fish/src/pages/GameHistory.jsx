import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import soundService from '../services/soundService';
export const GameHistory = () => {
    const navigate = useNavigate();
    const { recentGames } = useGame();
    return (<div className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat p-4 sm:p-8 flex flex-col items-center select-none" style={{
            backgroundImage: "url('/ocean-bg.jpg')",
            backgroundColor: '#023859',
        }}>

      <div className="absolute inset-0 bg-[#022646]/75 backdrop-blur-[2px] pointer-events-none"/>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">

        <div className="w-full relative flex items-center justify-center mb-6 sm:mb-8 min-h-[52px]">

          <button onClick={() => {
            soundService.playClick();
            navigate(-1);
        }} className="absolute left-0 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-black text-sm sm:text-base shadow-2xl border-3 border-white flex items-center gap-2 cursor-pointer transition-all z-20 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
            <span>Back</span>
          </button>

          <div className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 border-3 border-white shadow-2xl flex items-center gap-3">
            <History size={26} className="text-cyan-300"/>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-md">
              Game History
            </h1>
          </div>
        </div>

        <div className="w-full rounded-[32px] p-5 sm:p-7 bg-[#034475]/95 backdrop-blur-md border-4 border-cyan-400/80 shadow-2xl flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-cyan-100">
              <thead>
                <tr className="border-b border-cyan-400/30 text-xs uppercase text-cyan-300 font-black">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Fishes</th>
                  <th className="py-3.5 px-4">Treasures</th>
                  <th className="py-3.5 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-400/20 font-bold">
                {recentGames.length === 0 ? (<tr>
                    <td colSpan={5} className="py-10 text-center text-cyan-200/80 text-sm">
                      🏊 No games recorded yet. Play a game to see your history here!
                    </td>
                  </tr>) : (recentGames.map((game) => (<tr key={game.id} className="hover:bg-sky-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-white">{game.date}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-amber-300 text-base">{game.score}</td>
                      <td className="py-3.5 px-4 text-cyan-200">{game.fishes}</td>
                      <td className="py-3.5 px-4 text-amber-200">{game.treasures}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${game.result === 'Won'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                : 'bg-rose-500/20 text-rose-300 border border-rose-400/50'}`}>
                          {game.result === 'Won' ? <Trophy size={14} className="text-amber-400"/> : '🛑'}
                          <span>{game.result}</span>
                        </span>
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
};
export default GameHistory;
