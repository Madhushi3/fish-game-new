import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import soundService from '../services/soundService';
import authService from '../services/authService';
export const Login = () => {
    const navigate = useNavigate();
    const { login } = useGame();

    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const [username, setUsername] = useState('Madhushi');
    const [password, setPassword] = useState('madhushi123');
    const [email, setEmail] = useState('madhushi@fishescape.io');
    const [confirmPassword, setConfirmPassword] = useState('madhushi123');

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 4500);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 4500);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        const trimmedUser = username.trim();
        const trimmedPass = password.trim();
        if (!trimmedUser) {
            setErrorMessage('Please enter your username or email.');
            soundService.playLose();
            return;
        }
        if (!trimmedPass) {
            setErrorMessage('Please enter your password.');
            soundService.playLose();
            return;
        }
        setIsLoading(true);
        soundService.playClick();
        try {
            const user = await authService.login(trimmedUser, trimmedPass);
            soundService.playVictory();
            setSuccessMessage(`Welcome back, ${user.name}! Diving in...`);
            login(user.name, user);
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
            setErrorMessage(message);
            soundService.playLose();
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        const trimmedUser = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPass = password.trim();
        if (!trimmedUser || !trimmedEmail || !trimmedPass) {
            setErrorMessage('Please fill in all fields.');
            soundService.playLose();
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            soundService.playLose();
            return;
        }
        setIsLoading(true);
        soundService.playClick();
        try {
            const user = await authService.register(trimmedUser, trimmedEmail, trimmedPass);
            soundService.playVictory();
            setSuccessMessage(`🎉 Account created for ${user.name}! Please login with your password.`);
            setUsername(user.name);
            setPassword('');
            setConfirmPassword('');
            setIsRegisterMode(false);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
            setErrorMessage(message);
            soundService.playLose();
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="h-screen max-h-screen w-full relative flex flex-col items-center justify-center p-2 sm:p-4 bg-cover bg-center bg-no-repeat overflow-hidden select-none" style={{
            backgroundImage: "url('/ocean-bg.jpg')",
            backgroundColor: '#034475',
        }}>

      {(successMessage || errorMessage) && (<div className="fixed top-5 right-5 z-50 w-[350px] max-w-[calc(100vw-2.5rem)] pointer-events-auto animate-toast-in">
          <div className={`w-full p-3.5 rounded-2xl flex items-start gap-3 shadow-[0_14px_35px_rgba(2,26,54,0.6)] border-2 backdrop-blur-md transition-all ${successMessage
                ? 'bg-[#033457]/95 border-emerald-400/90 text-white'
                : 'bg-[#033457]/95 border-rose-400/90 text-white'}`}>

            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${successMessage
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-400/40'}`}>
              {successMessage ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
            </div>

            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-wider block ${successMessage ? 'text-emerald-300' : 'text-rose-300'}`}>
                {successMessage ? 'Success' : 'Notice'}
              </span>
              <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                {successMessage || errorMessage}
              </p>
            </div>

            <button type="button" onClick={() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer" title="Close">
              <X size={15}/>
            </button>
          </div>
        </div>)}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7]/20 via-transparent to-[#011a33]/50 pointer-events-none"/>

      <div className="absolute inset-x-0 top-0 h-96 opacity-40 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.7) 0%, rgba(125,211,252,0.3) 40%, transparent 80%)',
        }}/>

      <div className="absolute top-[18%] left-4 sm:left-14 opacity-85 pointer-events-none animate-bob">
        <img src="/game-assets/fish-clownfish.png" alt="Clownfish" className="w-12 h-10 object-contain filter drop-shadow-md" onError={(e) => {
            ;
            e.currentTarget.src = '/game-assets/fish.svg';
        }}/>
      </div>
      <div className="absolute top-[28%] right-4 sm:right-16 opacity-85 pointer-events-none animate-bob" style={{ animationDelay: '1.4s' }}>
        <img src="/game-assets/fish-clownfish.png" alt="Clownfish" className="w-14 h-12 object-contain -scale-x-100 filter drop-shadow-md" onError={(e) => {
            ;
            e.currentTarget.src = '/game-assets/fish.svg';
        }}/>
      </div>

      <div className="relative z-10 w-full max-w-3xl px-3 sm:px-4 flex flex-col items-center">

        <div className="flex justify-center mb-2 sm:mb-3 shrink-0">
          <img src="/game-assets/logo.svg" alt="Swimming – Dive, Collect & Survive" className="w-48 sm:w-56 object-contain drop-shadow-[0_8px_16px_rgba(2,26,54,0.6)] animate-bob"/>
        </div>

        <div className="w-full bg-[#034475]/95 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] shadow-[0_20px_50px_rgba(2,26,54,0.85),0_0_30px_rgba(34,211,238,0.3)] border-3 sm:border-4 border-cyan-400/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">

          <div className="relative w-full h-48 sm:h-64 md:h-full min-h-[200px] md:min-h-[340px] max-h-[380px] overflow-hidden border-b-2 md:border-b-0 md:border-r-3 border-cyan-400/50 bg-[#022646] group">
            <img src="/game-assets/login-hero-3d.jpg" alt="3D Swimmer Hero" className="w-full h-full object-cover object-center select-none pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out" onError={(e) => {
            ;
            e.currentTarget.src = '/game-assets/swimmer-champion-3d.png';
        }}/>

            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-transparent to-sky-300/10 pointer-events-none"/>
          </div>

          <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-center bg-[#034475]/95 text-white">

            <div className="bg-[#022646]/90 p-1 rounded-xl flex items-center mb-3 border border-cyan-400/30 shadow-inner">
              <button type="button" onClick={() => {
            soundService.playClick();
            setIsRegisterMode(false);
            setErrorMessage(null);
        }} className={`flex-1 py-1.5 sm:py-2 rounded-lg font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${!isRegisterMode
            ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 text-white shadow-md border border-white/50 scale-[1.01]'
            : 'text-cyan-200 hover:text-white'}`}>
                Login
              </button>
              <button type="button" onClick={() => {
            soundService.playClick();
            setIsRegisterMode(true);
            setErrorMessage(null);
            setUsername('');
            setPassword('');
            setEmail('');
            setConfirmPassword('');
        }} className={`flex-1 py-1.5 sm:py-2 rounded-lg font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${isRegisterMode
            ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 text-white shadow-md border border-white/50 scale-[1.01]'
            : 'text-cyan-200 hover:text-white'}`}>
                Register
              </button>
            </div>

            <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit}>

              <div className="relative mb-2.5">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
                  <User size={16}/>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username or Email" className="w-full bg-[#022646]/90 border-2 border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 rounded-xl py-2 sm:py-2.5 pl-10 pr-3.5 text-white placeholder:text-cyan-200/50 font-bold text-xs sm:text-sm outline-none transition-all shadow-inner" autoComplete="username"/>
              </div>

              {isRegisterMode && (<div className="relative mb-2.5 animate-fade-in">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
                    <Mail size={16}/>
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#022646]/90 border-2 border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 rounded-xl py-2 sm:py-2.5 pl-10 pr-3.5 text-white placeholder:text-cyan-200/50 font-bold text-xs sm:text-sm outline-none transition-all shadow-inner" autoComplete="email"/>
                </div>)}

              <div className="relative mb-2.5">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
                  <Lock size={16}/>
                </div>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-[#022646]/90 border-2 border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 rounded-xl py-2 sm:py-2.5 pl-10 pr-9 text-white placeholder:text-cyan-200/50 font-bold text-xs sm:text-sm outline-none transition-all shadow-inner" autoComplete={isRegisterMode ? 'new-password' : 'current-password'}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-white cursor-pointer p-0.5" title={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              {isRegisterMode && (<div className="relative mb-2.5 animate-fade-in">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
                    <Lock size={16}/>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full bg-[#022646]/90 border-2 border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 rounded-xl py-2 sm:py-2.5 pl-10 pr-3.5 text-white placeholder:text-cyan-200/50 font-bold text-xs sm:text-sm outline-none transition-all shadow-inner" autoComplete="new-password"/>
                </div>)}

              <button type="submit" disabled={isLoading} className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 hover:from-sky-400 hover:to-blue-600 active:scale-98 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-900/60 border-2 border-white/60 transition-all cursor-pointer flex items-center justify-center gap-2 mt-3">
                {isLoading ? (<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>) : (<span>{isRegisterMode ? 'Register Now' : 'Dive In (Login)'}</span>)}
              </button>
            </form>

            <div className="text-center text-[11px] sm:text-xs font-semibold text-cyan-200/80 mt-3">
              {!isRegisterMode ? (<span>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => {
                soundService.playClick();
                setIsRegisterMode(true);
                setErrorMessage(null);
                setUsername('');
                setPassword('');
                setEmail('');
                setConfirmPassword('');
            }} className="text-cyan-300 font-extrabold hover:text-white hover:underline cursor-pointer ml-1">
                    Register here
                  </button>
                </span>) : (<span>
                  Already have an account?{' '}
                  <button type="button" onClick={() => {
                soundService.playClick();
                setIsRegisterMode(false);
                setErrorMessage(null);
            }} className="text-cyan-300 font-extrabold hover:text-white hover:underline cursor-pointer ml-1">
                    Login here
                  </button>
                </span>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default Login;
