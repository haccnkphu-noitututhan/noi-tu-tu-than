import React from 'react';
import { Skull, Music, Volume2, VolumeX, HelpCircle, Zap } from 'lucide-react';

interface HeroBannerProps {
  isSoundOn: boolean;
  isBgmOn: boolean;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  onOpenRules: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  isSoundOn,
  isBgmOn,
  onToggleSound,
  onToggleBgm,
  onOpenRules,
}) => {
  return (
    <div className="w-full bg-white neo-border-thick rounded-3xl p-4 sm:p-5 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Branding & Tag */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Big Yellow Square Avatar with Flat 2D Vector Skull */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#FEE227] neo-border rounded-2xl flex items-center justify-center shadow-neo-sm relative">
          <Skull className="w-9 h-9 sm:w-11 sm:h-11 text-black" strokeWidth={2.5} />
          {/* Small 2D comic tag */}
          <div className="absolute -top-1.5 -right-1.5 bg-rose-500 neo-border rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-[10px] text-white font-black">!</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-400">
              PARTY ONLINE 2-8 NGƯỜI TỪ XA
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full border-2 border-dashed border-purple-500 text-purple-700 bg-purple-50 flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-600 inline" />
              <span>P2P WEBRTC MESH</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111827] truncate">
            NỐI TỪ TỬ THẦN
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-600 line-clamp-1">
            Đấu trường nối từ sinh tử nghẹt thở • Mở link trên điện thoại hoặc máy tính!
          </p>
        </div>
      </div>

      {/* Right: Audio & Help Controls (Strictly single horizontal row, never wrapped) */}
      <div className="flex flex-row items-center gap-2 shrink-0 flex-nowrap self-start md:self-center overflow-x-auto no-scrollbar max-w-full py-1">
        {/* BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className={`neo-btn flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black uppercase whitespace-nowrap cursor-pointer shrink-0 ${
            isBgmOn ? 'bg-amber-300 text-black' : 'bg-white text-gray-700'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>[ NHẠC NỀN{isBgmOn ? ': BẬT' : ''} ]</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          className={`neo-btn flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black uppercase whitespace-nowrap cursor-pointer shrink-0 ${
            isSoundOn ? 'bg-emerald-300 text-black' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>[ LOA: {isSoundOn ? 'BẬT' : 'TẮT'} ]</span>
        </button>

        {/* Rules button - ALWAYS ON SAME LINE */}
        <button
          onClick={onOpenRules}
          className="neo-btn flex items-center gap-1 bg-sky-200 text-black px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black uppercase hover:bg-sky-300 whitespace-nowrap cursor-pointer shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>[ CÁCH CHƠI TỪ XA? ]</span>
        </button>
      </div>
    </div>
  );
};
