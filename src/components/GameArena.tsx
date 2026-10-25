import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, AlertTriangle, Star, X } from 'lucide-react';
import type { GameState } from '../types/game';
import { getSyllables, validateCandidateWord } from '../engine/wordValidator';
import { AudioManager } from '../engine/audioManager';
import { ComicHeart, ComicBomb, ComicSkull } from './ComicIcons';
import { RenderAvatar } from './ComicAvatars';

interface GameArenaProps {
  gameState: GameState;
  myPlayerId: string;
  onSubmitWord: (word: string, isTrap?: boolean, isDeadEnd?: boolean, endingSyllable?: string) => void;
  onForfeitTurn: () => void;
  onLeaveMatch: () => void;
  announcement?: string;
}

export const GameArena: React.FC<GameArenaProps> = ({
  gameState,
  myPlayerId,
  onSubmitWord,
  onForfeitTurn,
  onLeaveMatch,
  announcement,
}) => {
  const [inputWord, setInputWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activePlayer = gameState.players[gameState.currentTurnIndex];
  const myPlayer = gameState.players.find(p => p.id === myPlayerId);
  const isMyTurn = activePlayer?.id === myPlayerId && activePlayer?.isAlive;

  // Extract previous required syllable
  const prevSyllables = gameState.currentWord ? getSyllables(gameState.currentWord) : [];
  const requiredFirstSyllable = prevSyllables.length > 0 ? prevSyllables[prevSyllables.length - 1] : '';

  // AUTOMATICALLY CLEAR PREVIOUS INPUT ON TURN OR WORD CHANGE (No more manual deleting!)
  useEffect(() => {
    setInputWord('');
    setErrorMessage('');
  }, [gameState.currentTurnIndex, gameState.currentWord]);

  // Safe focus on turn change (avoid jarring mobile virtual keyboard popups)
  useEffect(() => {
    if (isMyTurn) {
      setErrorMessage('');
      if (window.innerWidth > 640) {
        inputRef.current?.focus();
      }
    }
  }, [isMyTurn]);

  // Submit word (auto combines prefix + suffix)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMyTurn) return;

    let candidate = inputWord.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (!candidate) return;
    
    // If user only typed 1 word (suffix) and we have a required syllable, auto-prepend it
    const parts = candidate.split(/\s+/).filter(Boolean);
    if (parts.length === 1 && requiredFirstSyllable) {
      candidate = `${requiredFirstSyllable} ${parts[0]}`;
    }

    const usedWords = gameState.history.map(h => h.word);
    const result = validateCandidateWord(candidate, gameState.currentWord, usedWords);

    if (!result.valid) {
      setErrorMessage(result.reason || 'Từ không hợp lệ!');
      AudioManager.playBuzzer();
      return;
    }

    // Valid word submitted
    AudioManager.playDing();
    setErrorMessage('');
    setInputWord('');
    const finalWord = result.resolvedWord || candidate;
    onSubmitWord(finalWord, result.isTrap, result.isDeadEnd, result.endingSyllable);
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-24 sm:pb-16 max-w-4xl mx-auto">
      {/* Top Match Bar: Mode, Live Score & Quit Button */}
      <div className="w-full bg-white neo-border-thick rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-neo flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-black uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FEE227] neo-border flex items-center gap-1">
            {gameState.mode === 'bomb' ? (
              <>
                <ComicBomb className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" />
                <span>BOM HẸN GIỜ</span>
              </>
            ) : gameState.mode === 'boss' ? (
              <>
                <ComicSkull className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" />
                <span>SOLO BOSS THẦN CHẾT</span>
              </>
            ) : (
              <span>SINH TỬ ĐẾM NGƯỢC</span>
            )}
          </span>
          <span className="hidden sm:inline text-xs font-bold text-gray-500">
            • Vòng {gameState.history.length + 1}
          </span>
        </div>

        {/* Live Score & Quit */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] sm:text-xs font-black uppercase text-amber-900 bg-amber-100 neo-border rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-600 fill-amber-400" />
            <span>ĐIỂM:</span>
            <span className="text-black font-extrabold">{myPlayer?.score || 0}</span>
          </div>

          <button
            onClick={onLeaveMatch}
            className="neo-btn bg-gray-100 hover:bg-gray-200 text-black px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase cursor-pointer"
          >
            [ RỜI ĐẤU TRƯỜNG ]
          </button>
        </div>
      </div>

      {/* Dead-End Instant Kill / Timeout Alert Banner */}
      {announcement && (
        <div className="w-full bg-rose-500 text-white neo-border-thick rounded-2xl p-2.5 sm:p-3 shadow-neo text-center font-black text-xs sm:text-sm uppercase tracking-wide animate-bounce">
          {announcement}
        </div>
      )}

      {/* Arena Center: Mobile-Optimized Compact Card */}
      <div className="w-full bg-white neo-border-thick rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-neo flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Urgent Pulse Background if time < 4s */}
        {gameState.turnTimeLeft <= 3 && (
          <div className="absolute inset-0 bg-rose-500/10 pointer-events-none animate-pulse" />
        )}

        {/* Compact Header Row: Mini Bomb + Timer Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {gameState.mode === 'bomb' ? (
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-100 neo-border flex items-center justify-center ${gameState.turnTimeLeft <= 3 ? 'animate-bomb-shake' : 'animate-bomb-pulse'}`}>
              <ComicBomb className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FEE227] neo-border flex items-center justify-center">
              <ComicSkull className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${gameState.turnTimeLeft <= 3 ? 'text-rose-600 animate-spin' : 'text-gray-700'}`} />
            <span className={`text-xs sm:text-sm font-black uppercase px-3 py-0.5 rounded-full neo-border ${gameState.turnTimeLeft <= 3 ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-100 text-black'}`}>
              [ THỜI GIAN: {gameState.turnTimeLeft}s ]
            </span>
          </div>
        </div>

        {/* Turn Announcer with Comic Avatar */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-[10px] sm:text-xs font-black uppercase text-gray-400">
            LƯỢT ĐÁNH:
          </span>
          <div className="flex items-center gap-1.5 bg-gray-50 neo-border rounded-full px-2.5 py-0.5">
            <div className="w-5 h-5 bg-white neo-border-sm rounded-full flex items-center justify-center shrink-0">
              <RenderAvatar avatarId={activePlayer?.avatar || 'reaper'} className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase text-black">
              {activePlayer?.name} {isMyTurn ? '(BẠN!)' : ''}
            </span>
          </div>
        </div>

        {/* Current Word on Field (Hero element) */}
        <div className="my-1 sm:my-2 flex flex-col items-center gap-1 w-full max-w-md">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            TỪ HIỆN TẠI TRÊN SÂN
          </span>
          <div className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-black bg-[#FEE227] neo-border-thick rounded-2xl px-5 py-1.5 sm:py-2 shadow-neo max-w-full truncate">
            {gameState.currentWord || 'BẮT ĐẦU VÁN'}
          </div>

          {requiredFirstSyllable && (
            <div className="mt-1 text-[11px] sm:text-xs font-black text-rose-600 uppercase bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Nối từ bắt đầu bằng: <span className="underline text-black font-extrabold">{requiredFirstSyllable.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Mobile-Friendly Input Form for Active Player */}
        <div className="w-full max-w-md mt-2.5 sm:mt-4">
          {isMyTurn ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0 bg-white neo-border-thick rounded-full p-1 shadow-neo-sm">
                  {/* Locked Prefix Syllable Badge if required */}
                  {requiredFirstSyllable ? (
                    <div className="shrink-0 bg-[#FEE227] text-black neo-border rounded-full px-3 py-1 font-black text-xs sm:text-sm uppercase flex items-center shadow-neo-xs select-none">
                      <span>{requiredFirstSyllable.toUpperCase()}</span>
                    </div>
                  ) : null}

                  {/* Suffix input field */}
                  <input
                    ref={inputRef}
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    placeholder={requiredFirstSyllable ? 'Gõ từ đuôi (VD: nuối)...' : 'Gõ từ mở đầu...'}
                    className="w-full bg-transparent px-2.5 py-1.5 text-base font-black text-black placeholder:text-gray-400 focus:outline-none min-w-0"
                  />

                  {/* One-tap Clear Button (X) if input has text */}
                  {inputWord && (
                    <button
                      type="button"
                      onClick={() => setInputWord('')}
                      className="p-1 text-gray-400 hover:text-black cursor-pointer shrink-0"
                      title="Xóa trắng"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="neo-btn bg-[#10B981] hover:bg-emerald-600 text-white px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black uppercase shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-sm"
                >
                  <span>[ BẮN ]</span>
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-xs font-black text-rose-700 bg-rose-100 neo-border rounded-xl px-3 py-1 animate-bounce flex items-center gap-1.5 justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forfeit / Give Up Turn Button */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 pt-0.5">
                <span>* Tự ghép chữ đuôi vào tiền tố</span>
                <button
                  type="button"
                  onClick={onForfeitTurn}
                  className="neo-btn flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase cursor-pointer"
                  title="Không đoán được từ? Bỏ lượt và trừ 1 tim ngay"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>[ BÍ TỪ: -1 TIM ]</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-2.5 bg-gray-50 neo-border rounded-2xl text-xs sm:text-sm font-extrabold text-gray-600 animate-pulse flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 animate-spin text-gray-400" />
              <span>Đang chờ <span className="text-black underline">{activePlayer?.name}</span> ra đòn...</span>
            </div>
          )}
        </div>
      </div>

      {/* Players Hearts, Avatars & Live Scores Strip */}
      <div className="w-full bg-white neo-border-thick rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-neo">
        <div className="text-[10px] sm:text-xs font-black uppercase text-gray-400 mb-2 tracking-wider flex items-center justify-between">
          <span>ĐẤU SĨ SINH TỬ ({gameState.players.length} NGƯỜI)</span>
          <span className="text-gray-500 font-bold hidden sm:inline">Nối đúng: +10đ • Bẫy: +35đ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {gameState.players.map((p, idx) => {
            const isTurn = idx === gameState.currentTurnIndex;

            return (
              <div
                key={p.id}
                className={`neo-border rounded-xl p-2 flex items-center justify-between gap-1.5 ${
                  isTurn ? 'bg-[#FEF08A] ring-2 ring-black shadow-neo-sm' : p.isAlive ? 'bg-white' : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden w-full">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white neo-border rounded-lg flex items-center justify-center shadow-neo-xs shrink-0">
                    <RenderAvatar avatarId={p.avatar} className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="truncate flex-1">
                    <div className="text-[11px] sm:text-xs font-black uppercase text-black truncate">
                      {p.name} {p.id === myPlayerId ? '(Tôi)' : ''}
                    </div>

                    {/* Vector Comic Hearts */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {p.isAlive ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <ComicHeart
                            key={i}
                            filled={i < p.hp}
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                          />
                        ))
                      ) : (
                        <span className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 px-1 rounded border border-rose-300">
                          BỊ LOẠI
                        </span>
                      )}
                    </div>

                    {/* Live Score */}
                    <div className="text-[9px] font-black uppercase text-amber-800">
                      {p.score || 0} ĐIỂM
                    </div>
                  </div>
                </div>

                {isTurn && (
                  <span className="text-[10px] font-black text-rose-600 animate-ping shrink-0">
                    ●
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Word Chain History (Compact scrollable) */}
      {gameState.history.length > 0 && (
        <div className="w-full bg-white neo-border-thick rounded-2xl sm:rounded-3xl p-3 shadow-neo">
          <div className="text-[10px] sm:text-xs font-black uppercase text-gray-400 mb-1.5 tracking-wider">
            CHUỖI TỪ ĐÃ NỐI ({gameState.history.length} TỪ)
          </div>
          <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto p-1 no-scrollbar">
            {gameState.history.map((item, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase neo-border ${
                  item.isTrap ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span>{item.authorName}:</span>
                <span className="text-black underline">{item.word}</span>
                {item.isTrap && <span className="text-[8px] bg-rose-500 text-white rounded px-1">BẪY!</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
