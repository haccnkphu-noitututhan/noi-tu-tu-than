import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, AlertTriangle, Star } from 'lucide-react';
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

  // Focus input on my turn safely
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
    <div className="w-full flex flex-col gap-4 pb-16 sm:pb-8">
      {/* Top Match Bar: Mode, Live Score & Quit Button */}
      <div className="w-full bg-white neo-border-thick rounded-3xl p-3 sm:p-4 shadow-neo flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#FEE227] neo-border flex items-center gap-1.5">
            {gameState.mode === 'bomb' ? (
              <>
                <ComicBomb className="w-4 h-4 inline" />
                <span>BOM HẸN GIỜ CHUYỀN TAY</span>
              </>
            ) : gameState.mode === 'boss' ? (
              <>
                <ComicSkull className="w-4 h-4 inline" />
                <span>SOLO THẦN CHẾT AI</span>
              </>
            ) : (
              <span>SINH TỬ ĐẾM NGƯỢC</span>
            )}
          </span>
          <span className="hidden sm:inline text-xs font-bold text-gray-500">
            • Vòng thi đấu thứ {gameState.history.length + 1}
          </span>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-black uppercase text-amber-900 bg-amber-100 neo-border rounded-full px-3 py-1 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span>ĐIỂM CỦA BẠN:</span>
            <span className="text-black font-extrabold text-sm">{myPlayer?.score || 0}</span>
          </div>

          <button
            onClick={onLeaveMatch}
            className="neo-btn bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-1 rounded-full text-xs font-extrabold uppercase cursor-pointer"
          >
            [ RỜI ĐẤU TRƯỜNG ]
          </button>
        </div>
      </div>

      {/* Dead-End Instant Kill / Timeout Alert Banner */}
      {announcement && (
        <div className="w-full bg-rose-500 text-white neo-border-thick rounded-2xl p-3 shadow-neo text-center font-black text-xs sm:text-sm uppercase tracking-wide animate-bounce">
          {announcement}
        </div>
      )}

      {/* Arena Center: The Bomb / Clock & Current Word */}
      <div className="w-full bg-white neo-border-thick rounded-3xl p-5 sm:p-8 shadow-neo flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Urgent Pulse Background if time < 4s */}
        {gameState.turnTimeLeft <= 3 && (
          <div className="absolute inset-0 bg-rose-500/10 pointer-events-none animate-pulse" />
        )}

        {/* 2D Flat Vector Bomb / Skull Graphic */}
        <div className="relative mb-2">
          {gameState.mode === 'bomb' ? (
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-100 neo-border-thick flex items-center justify-center shadow-neo ${gameState.turnTimeLeft <= 3 ? 'animate-bomb-shake' : 'animate-bomb-pulse'}`}>
              <ComicBomb className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FEE227] neo-border-thick flex items-center justify-center shadow-neo">
              <ComicSkull className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Turn Timer Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Clock className={`w-4 h-4 ${gameState.turnTimeLeft <= 3 ? 'text-rose-600 animate-spin' : 'text-gray-700'}`} />
          <span className={`text-sm sm:text-base font-black uppercase tracking-wider px-3.5 py-1 rounded-full neo-border ${gameState.turnTimeLeft <= 3 ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-100 text-black'}`}>
            [ THỜI GIAN CÒN: {gameState.turnTimeLeft}s ]
          </span>
        </div>

        {/* Turn Announcer with Custom Comic Avatar */}
        <div className="mb-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase text-gray-500">
            LƯỢT RA ĐÒN CỦA:
          </span>
          <div className="text-lg sm:text-xl font-black uppercase tracking-tight text-black flex items-center justify-center gap-2 mt-1">
            <div className="w-8 h-8 bg-white neo-border rounded-lg flex items-center justify-center shadow-neo-sm shrink-0">
              <RenderAvatar avatarId={activePlayer?.avatar || 'reaper'} className="w-6 h-6" />
            </div>
            <span className="underline decoration-wavy decoration-amber-400">
              {activePlayer?.name} {isMyTurn ? '(BẠN!)' : ''}
            </span>
          </div>
        </div>

        {/* Current Word to Match */}
        <div className="mt-2 flex flex-col items-center gap-1">
          <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
            TỪ HIỆN TẠI TRÊN SÂN
          </span>
          <div className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-black bg-[#FEE227] neo-border-thick rounded-2xl px-6 py-2 shadow-neo transform -rotate-1 hover:rotate-0 transition-transform">
            {gameState.currentWord || 'BẮT ĐẦU VÁN'}
          </div>

          {requiredFirstSyllable && (
            <div className="mt-2 text-xs sm:text-sm font-black text-rose-600 uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              [ YÊU CẦU ] Nối chữ tiếp theo bắt đầu bằng: <span className="underline text-black font-extrabold">{requiredFirstSyllable.toUpperCase()} ...</span>
            </div>
          )}
        </div>

        {/* Suffix-Only Dedicated Input Form for Active Player */}
        <div className="w-full max-w-lg mt-5">
          {isMyTurn ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  {/* Locked Prefix Syllable Pill if required */}
                  {requiredFirstSyllable ? (
                    <div className="shrink-0 bg-[#FEE227] text-black neo-border-thick rounded-xl sm:rounded-full px-3 py-2 sm:px-4 sm:py-3 font-black text-xs sm:text-base uppercase flex items-center shadow-neo-sm select-none">
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
                    placeholder={requiredFirstSyllable ? 'Gõ từ đuôi (VD: nuối)...' : 'Gõ từ 2 chữ mở đầu (VD: tử thần)...'}
                    className="w-full neo-border-thick bg-white rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-base font-black text-black placeholder:text-gray-400 focus:outline-none focus:bg-amber-50 shadow-neo-sm min-w-0"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="neo-btn bg-[#10B981] hover:bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black uppercase shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-sm"
                >
                  <span>[ BẮN ]</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Helpful auto-combine hint text */}
              {requiredFirstSyllable && (
                <div className="text-[11px] font-bold text-gray-500 text-left px-2">
                  * Chỉ cần nhập chữ đuôi (VD: gõ <span className="font-black text-black">"nuối"</span> hệ thống tự ghép thành <span className="font-black text-black">"{requiredFirstSyllable} nuối"</span>).
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="text-xs font-black text-rose-700 bg-rose-100 neo-border rounded-xl px-3 py-1.5 animate-bounce flex items-center gap-1.5 justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forfeit / Give Up Turn Button */}
              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={onForfeitTurn}
                  className="neo-btn flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-800 px-3.5 py-1 rounded-full text-xs font-black uppercase cursor-pointer"
                  title="Không đoán được từ? Bỏ lượt và trừ 1 tim ngay"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>[ BÍ TỪ: CHỊU PHẠT -1 TIM ]</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-gray-50 neo-border rounded-2xl text-xs sm:text-sm font-extrabold text-gray-600 animate-pulse flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-gray-400" />
              <span>Đang chờ <span className="text-black underline">{activePlayer?.name}</span> ra đòn...</span>
            </div>
          )}
        </div>
      </div>

      {/* Players Hearts, Avatars & Live Scores Strip */}
      <div className="w-full bg-white neo-border-thick rounded-3xl p-4 shadow-neo">
        <div className="text-xs font-black uppercase text-gray-400 mb-2 tracking-wider flex items-center justify-between">
          <span>DANH SÁCH ĐẤU SĨ SINH TỬ ({gameState.players.length} NGƯỜI)</span>
          <span className="text-gray-500 font-bold hidden sm:inline">Nối từ đúng: +10đ • Bẫy tử thần: +35đ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gameState.players.map((p, idx) => {
            const isTurn = idx === gameState.currentTurnIndex;

            return (
              <div
                key={p.id}
                className={`neo-border rounded-2xl p-2.5 flex items-center justify-between gap-2 ${
                  isTurn ? 'bg-[#FEF08A] ring-2 ring-black shadow-neo-sm' : p.isAlive ? 'bg-white' : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden w-full">
                  <div className="w-10 h-10 bg-white neo-border rounded-xl flex items-center justify-center shadow-neo-sm shrink-0">
                    <RenderAvatar avatarId={p.avatar} className="w-8 h-8" />
                  </div>
                  <div className="truncate flex-1">
                    <div className="text-xs font-black uppercase text-black truncate flex items-center justify-between">
                      <span className="truncate">{p.name} {p.id === myPlayerId ? '(Tôi)' : ''}</span>
                    </div>

                    {/* Vector Comic Hearts */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {p.isAlive ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <ComicHeart
                            key={i}
                            filled={i < p.hp}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          />
                        ))
                      ) : (
                        <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-300">
                          ĐÃ BỊ LOẠI
                        </span>
                      )}
                    </div>

                    {/* Live Score Tag */}
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        {p.score || 0} ĐIỂM
                      </span>
                    </div>
                  </div>
                </div>

                {isTurn && (
                  <span className="text-xs font-black text-rose-600 animate-ping shrink-0">
                    ●
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Word Chain History */}
      {gameState.history.length > 0 && (
        <div className="w-full bg-white neo-border-thick rounded-3xl p-4 shadow-neo">
          <div className="text-xs font-black uppercase text-gray-400 mb-2 tracking-wider">
            CHUỖI TỪ ĐÃ NỐI ({gameState.history.length} TỪ)
          </div>
          <div className="flex flex-wrap items-center gap-2 max-h-32 overflow-y-auto p-1">
            {gameState.history.map((item, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase neo-border ${
                  item.isTrap ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span>{item.authorName}:</span>
                <span className="text-black underline">{item.word}</span>
                {item.isTrap && <span className="text-[10px] bg-rose-500 text-white rounded px-1">BẪY!</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
