import React from 'react';
export const Player = React.memo(({ lane, isGhostMode }) => {

    const getLaneLeftPercent = (l) => {
        if (l === 0)
            return '23.3%';
        if (l === 1)
            return '50%';
        return '76.7%';
    };
    return (<div className="absolute top-[72%] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-20 pointer-events-none select-none" style={{
            left: getLaneLeftPercent(lane),
        }}>
      <div className={`relative flex flex-col items-center transition-all ${isGhostMode
            ? 'filter drop-shadow-[0_0_24px_rgba(103,232,249,0.95)] opacity-95'
            : 'filter drop-shadow-[0_4px_12px_rgba(2,29,56,0.3)]'}`}>

        {isGhostMode && (<div className="absolute -inset-4 rounded-full bg-cyan-400/25 blur-lg animate-pulse"/>)}

        <div className="w-24 h-32 sm:w-28 sm:h-36 relative flex items-center justify-center z-10 animate-swimmer-stroke">
          <img src="/game-assets/swimmer-overhead.png" alt="Swimmer Character" className="w-full h-full object-contain select-none pointer-events-none" onError={(e) => {
            ;
            e.currentTarget.src = '/game-assets/swimmer.svg';
        }}/>
        </div>
      </div>
    </div>);
});
export default Player;
