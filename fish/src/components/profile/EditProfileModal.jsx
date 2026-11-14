import React, { useState } from 'react';
import { X, Check, User, Sparkles } from 'lucide-react';
import soundService from '../../services/soundService';
const PRESET_AVATARS = [
    { id: 'av_default', type: 'image', value: '/game-assets/swimmer-avatar.png', label: 'Classic Swimmer' },
    { id: 'av_champ', type: 'image', value: '/game-assets/swimmer-champion-3d.png', label: '3D Champion' },
    { id: 'av_girl', type: 'emoji', value: '🏊‍♀️', label: 'Speed Queen' },
    { id: 'av_diver', type: 'emoji', value: '🤿', label: 'Scuba Pro' },
    { id: 'av_dolphin', type: 'emoji', value: '🐬', label: 'Dolphin' },
    { id: 'av_turtle', type: 'emoji', value: '🐢', label: 'Sea Turtle' },
    { id: 'av_fish', type: 'emoji', value: '🐠', label: 'Tropical Fish' },
    { id: 'av_pirate', type: 'emoji', value: '🏴‍☠️', label: 'Ocean Pirate' },
];
export const EditProfileModal = ({ isOpen, currentName, currentTitle = '⭐ Pro Swimmer', currentAvatar = '/game-assets/swimmer-avatar.png', onClose, onSave, }) => {
    const [name, setName] = useState(currentName);
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSave = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter a valid player name');
            return;
        }
        if (trimmed.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        soundService.playFanfare();
        onSave(trimmed, currentTitle, selectedAvatar);
        onClose();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-5 text-white shadow-2xl border-2 border-cyan-400/60 overflow-hidden" style={{
            background: 'linear-gradient(165deg, rgba(3, 35, 70, 0.97) 0%, rgba(2, 20, 42, 0.99) 100%)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.25)',
        }}>

        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"/>

        <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md border border-white/30">
              <User size={18} className="text-white"/>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">Edit Profile</h2>
              <p className="text-[11px] text-cyan-300 font-medium">Update player name or select an avatar</p>
            </div>
          </div>

          <button onClick={() => {
            soundService.playClick();
            onClose();
        }} className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={16}/>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">

          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-sky-950/60 border border-cyan-500/30">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-200 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
              {selectedAvatar && (selectedAvatar.startsWith('/') || selectedAvatar.startsWith('http')) ? (<img src={selectedAvatar} alt="Avatar Preview" className="w-full h-full object-cover" onError={(e) => {
                ;
                e.currentTarget.src = '/game-assets/swimmer-avatar.png';
            }}/>) : (<span className="text-3xl leading-none">{selectedAvatar}</span>)}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-black text-cyan-200 uppercase tracking-wide">Selected Avatar</span>
              <p className="text-[12px] text-slate-300 font-medium">
                Click any character below to choose your avatar
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-400"/> Choose Swimmer Avatar
            </label>

            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {PRESET_AVATARS.map((av) => {
            const isSelected = selectedAvatar === av.value;
            return (<button key={av.id} type="button" onClick={() => {
                    soundService.playClick();
                    setSelectedAvatar(av.value);
                }} className={`relative h-14 rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${isSelected
                    ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 border-2 border-white shadow-lg scale-105'
                    : 'bg-slate-900/70 hover:bg-slate-800 border border-cyan-500/30'}`} title={av.label}>
                    {av.type === 'image' ? (<img src={av.value} alt={av.label} className="w-9 h-9 object-contain"/>) : (<span className="text-2xl leading-none">{av.value}</span>)}
                    {isSelected && (<div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                        <Check size={10} className="text-white stroke-[3]"/>
                      </div>)}
                  </button>);
        })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="playerNameInput" className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span>Player Name</span>
              <span className="text-[10px] text-slate-400 font-normal">{name.length}/18</span>
            </label>
            <input id="playerNameInput" type="text" value={name} maxLength={18} onChange={(e) => {
            setName(e.target.value);
            if (error)
                setError(null);
        }} placeholder="Enter your name" className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border-2 border-cyan-400/40 focus:border-cyan-300 text-white font-bold text-sm outline-none transition-colors shadow-inner"/>
            {error && <span className="text-xs text-rose-400 font-semibold">{error}</span>}
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-cyan-400/20">
            <button type="button" onClick={() => {
            soundService.playClick();
            onClose();
        }} className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl font-black text-xs text-white tracking-wide cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5" style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
        }}>
              <Check size={14}/>
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
export default EditProfileModal;
