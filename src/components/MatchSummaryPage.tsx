import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Award, Scale, Crown, Trophy } from 'lucide-react';
import type { Player, WordItem } from '../types/game';
import { RenderAvatar } from './ComicAvatars';
import { ComicHeart, ComicSkull } from './ComicIcons';

interface MatchSummaryPageProps {
  winner?: Player;
  players: Player[];
  history: WordItem[];
  activePunishment?: string;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
  isHost: boolean;
}

export const MatchSummaryPage: React.FC<MatchSummaryPageProps> = ({
  winner,
  players,
  history,
  activePunishment,
  onPlayAgain,
  onReturnToLobby,
  isHost,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.5 }
    });
  }, []);

  // Safe sort players by score & alive status
  const safePlayers = Array.isArray(players) ? players : [];
  const sortedPlayers = [...safePlayers].sort((a, b) => {
    if (a.isAlive && !b.isAlive) return -1;
    if (!a.isAlive && b.isAlive) return 1;
    return (b.score || 0) - (a.score || 0);
  });

  // Identify loser (lowest score or first eliminated)
  const loser = sortedPlayers.length > 1 ? sortedPlayers[sortedPlayers.length - 1] : undefined;

  // Find most lethal trap word
  const lethalWord = Array.isArray(history) ? history.find(h => h.isTrap) : undefined;

  return (
    <div className="w-full flex flex-col gap-5 py-4 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="w-full bg-white neo-border-thick rounded-3xl p-6 sm:p-8 shadow-neo text-center flex flex-col items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-amber-800 border-2 border-dashed border-amber-600 bg-amber-100 px-4 py-1.5 rounded-full">
          [ TỔNG HỢP PHÁN QUYẾT PHIÊN TÒA TỬ THẦN ]
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-950">
          {winner ? 'PHIÊN TÒA ĐÃ CÓ PHÁN QUYẾT CHUNG CUỘC!' : 'TẤT CẢ ĐẤU SĨ ĐÃ BỊ THẦN CHẾT LOẠI!'}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 max-w-md">
          Cuộc chiến sinh tử đã khép lại. Dưới đây là bảng xếp hạng thứ hạng, điểm số thu thập và bản án hình phạt!
        </p>

        {/* Action Buttons right at top and bottom */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onReturnToLobby}
            className="neo-btn bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase flex items-center gap-2 cursor-pointer shadow-neo"
          >
            <Home className="w-4 h-4" />
            <span>[ QUAY LẠI SẢNH CHỜ CHÍNH ]</span>
          </button>

          {isHost && (
            <button
              onClick={onPlayAgain}
              className="neo-btn bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase flex items-center gap-2 cursor-pointer shadow-neo"
            >
              <RotateCcw className="w-4 h-4" />
              <span>[ BẮT ĐẦU VÁN MỚI ]</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Winner Highlight Card */}
      {winner ? (
        <div className="w-full bg-[#FEE227] neo-border-thick rounded-3xl p-5 sm:p-6 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white neo-border-thick rounded-2xl flex items-center justify-center shadow-neo shrink-0">
              <RenderAvatar avatarId={winner.avatar} className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase">
                <Crown className="w-4 h-4 fill-amber-500 text-black inline" />
                <span>QUÁN QUÂN SINH TỬ VÔ ĐỊCH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black">
                {winner.name}
              </h2>
              <div className="text-xs font-bold text-gray-800 mt-0.5">
                Tổng điểm ván đấu: <span className="font-black text-base text-rose-700">{(winner.score || 0) + 50} pts</span> (Đã cộng +50 điểm chiến thắng)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 border-t sm:border-t-0 sm:border-l border-black/20 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] font-black uppercase text-gray-800">Số máu còn lại:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <ComicHeart key={i} filled={i < winner.hp} className="w-5 h-5" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-emerald-800 mt-1">Sống sót đến cuối cùng</span>
          </div>
        </div>
      ) : (
        <div className="w-full bg-rose-100 neo-border-thick rounded-3xl p-6 shadow-neo flex items-center gap-4">
          <ComicSkull className="w-14 h-14" />
          <div>
            <h2 className="text-xl font-black uppercase text-rose-900">
              TẤT CẢ NGƯỜI CHƠI ĐÃ BỊ THẦN CHẾT QUÉT SẠCH!
            </h2>
            <p className="text-xs font-bold text-rose-700">
              Không có ai sống sót qua được kho từ tử thần hiểm hóc của trận đấu này!
            </p>
          </div>
        </div>
      )}

      {/* 3. Punishment for the Loser Card (Requested by User) */}
      {loser && activePunishment && (
        <div className="w-full bg-rose-50 border-3 border-rose-600 rounded-3xl p-5 sm:p-6 shadow-neo flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 neo-border flex items-center justify-center shrink-0 text-white shadow-neo mt-1">
            <Scale className="w-8 h-8" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
              [ BẢN ÁN HÌNH PHẠT DÀNH CHO KẺ ĐỨNG BÉT BẢNG ]
            </span>
            <h3 className="text-base sm:text-lg font-black uppercase text-black mt-0.5">
              Đấu Sĩ <span className="underline decoration-wavy decoration-rose-500 text-rose-700">{loser.name}</span> phải thi hành án:
            </h3>
            <div className="bg-white neo-border rounded-2xl p-3.5 mt-2 text-sm sm:text-base font-black text-rose-950 shadow-neo-sm border-rose-300">
              "{activePunishment}"
            </div>
          </div>
        </div>
      )}

      {/* 4. Match Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white neo-border-thick rounded-3xl p-4 sm:p-5 shadow-neo flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 neo-border rounded-2xl flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">Tổng số từ đã nối thành công</div>
            <div className="text-2xl font-black text-black">{(history || []).length} TỪ</div>
          </div>
        </div>

        <div className="bg-white neo-border-thick rounded-3xl p-4 sm:p-5 shadow-neo flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-100 neo-border rounded-2xl flex items-center justify-center shrink-0">
            <ComicSkull className="w-7 h-7" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Từ tử thần hiểm hóc nhất ván</div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 truncate">
              {lethalWord ? lethalWord.word.toUpperCase() : 'KHÔNG CÓ'}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detailed Leaderboard */}
      <div className="w-full bg-white neo-border-thick rounded-3xl p-5 sm:p-6 shadow-neo flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-black uppercase tracking-tight text-gray-950">
            BẢNG TỔNG HỢP XẾP HẠNG & ĐIỂM SỐ
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {sortedPlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-3 rounded-2xl neo-border transition-all ${
                idx === 0 && p.isAlive
                  ? 'bg-amber-50 ring-2 ring-black shadow-neo-sm'
                  : 'bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="font-black text-sm w-7 text-center text-gray-600">
                  #{idx + 1}
                </span>
                <div className="w-10 h-10 bg-white neo-border rounded-xl flex items-center justify-center shrink-0 shadow-neo-sm">
                  <RenderAvatar avatarId={p.avatar} className="w-8 h-8" />
                </div>
                <div className="truncate">
                  <div className="font-black text-sm uppercase text-black truncate">
                    {p.name} {idx === sortedPlayers.length - 1 ? '(Bét bảng)' : ''}
                  </div>
                  <div className="text-[11px] font-bold text-gray-500">
                    {p.isAlive ? 'Sống sót' : 'Đã bị loại'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ComicHeart key={i} filled={i < p.hp} className="w-4 h-4" />
                  ))}
                </div>
                <div className="text-right min-w-[70px]">
                  <span className="font-black text-base text-black">
                    {p.isAlive && p.id === winner?.id ? (p.score || 0) + 50 : (p.score || 0)}
                  </span>
                  <span className="text-xs font-bold text-gray-500 ml-1">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
