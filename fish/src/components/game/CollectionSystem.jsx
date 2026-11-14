import React from 'react';
export const CollectionSystem = ({ notifications, splashes = [], }) => {
    return (<div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none">

      {splashes.map((splash) => (<div key={splash.id} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center" style={{
                left: splash.x,
                top: `${splash.y}%`,
            }}>

          <div className="w-16 h-16 rounded-full border-2 animate-ping" style={{ borderColor: splash.color, opacity: 0.85 }}/>

          <div className="absolute w-8 h-8 rounded-full blur-[2px] animate-pulse" style={{ backgroundColor: splash.color, opacity: 0.6 }}/>

          <span className="absolute text-xl animate-bounce">✨</span>
        </div>))}

      {notifications.map((notif) => (<div key={notif.id} className="absolute -translate-x-1/2 -translate-y-1/2 animate-float-score select-none font-black text-base sm:text-xl font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] z-40" style={{
                left: notif.x,
                top: `${notif.y}%`,
                color: notif.color,
            }}>
          {notif.text}
        </div>))}
    </div>);
};
export default CollectionSystem;
