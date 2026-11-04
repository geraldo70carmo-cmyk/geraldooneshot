import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, AlertCircle } from 'lucide-react';
import { AUDIO_ASSET_PATH, SONG_TITLE, SONG_TRANSLATION } from '../data/lyrics';

interface AudioPlayerProps {
  initialMuted?: boolean;
  onAudioToggle?: (playing: boolean) => void;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  initialMuted = false,
  onAudioToggle,
  compact = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(initialMuted);
  const [volume, setVolume] = useState<number>(0.6);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(compact);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError('Áudio em carregamento ou verificação.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onAudioToggle?.(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setAudioError(null);
        onAudioToggle?.(true);
      } catch (err) {
        console.warn('Playback error:', err);
        setAudioError('Clique novamente para autorizar a reprodução de áudio.');
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-lg shadow-cyan-950/40 text-white transition-all duration-300">
      <audio
        ref={audioRef}
        src={AUDIO_ASSET_PATH}
        preload="metadata"
        loop
      />

      {isMinimized ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono tracking-wider focus:outline-none"
            title="Expandir reprodutor de trilha sonora"
          >
            <Music className={`w-4 h-4 ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{SONG_TITLE}</span>
          </button>
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40"
            aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/50">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-cyan-300 truncate tracking-wide">{SONG_TITLE}</h4>
                  {isPlaying && (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-cyan-400 animate-pulse rounded-full" />
                      <span className="w-1 h-3.5 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                      <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150 rounded-full" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">{SONG_TRANSLATION}</p>
              </div>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60"
            >
              Minimizar
            </button>
          </div>

          {audioError && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-600/30">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{audioError}</span>
            </div>
          )}

          {/* Progress Slider */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              aria-label="Progresso da música"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition-transform active:scale-95"
                aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tocar Trilha</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                aria-label={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 w-24">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                aria-label="Volume da música"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
