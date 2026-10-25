import React from 'react';
import { Check } from 'lucide-react';
import type { GameMode } from '../types/game';

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isHost: boolean;
}

interface ModeCard {
  id: GameMode;
  tag1: string;
  tag1Bg: string;
  tag1Text: string;
  tag2: string;
  title: string;
  desc: string;
}

const MODES: ModeCard[] = [
  {
    id: 'standard',
    tag1: '[ TIÊU CHUẨN ]',
    tag1Bg: 'bg-[#FEE227]',
    tag1Text: 'text-black',
    tag2: '[ SINH TỬ ]',
    title: 'SINH TỬ ĐẾM NGƯỢC',
    desc: 'Mỗi lượt 10s (giảm dần còn 5s). Hết giờ mất 1 tim, ai hết tim trước sẽ bị Thần Chết loại!',
  },
  {
    id: 'bomb',
    tag1: '[ SIÊU HỖN LOẠN ]',
    tag1Bg: 'bg-rose-100',
    tag1Text: 'text-rose-700',
    tag2: '[ BOM NỔ ]',
    title: 'BOM HẸN GIỜ',
    desc: 'Quả bom nổ ngẫu nhiên 15-40s. Nối đúng từ để chuyền bom cho người sau, nổ trên tay ai người đó bay màu!',
  },
  {
    id: 'curse',
    tag1: '[ ĐẠI CHIẾN BÙA ]',
    tag1Bg: 'bg-purple-100',
    tag1Text: 'text-purple-700',
    tag2: '[ LỜI NGUYỀN ]',
    title: 'BÙA CHÚ & LỜI NGUYỀN',
    desc: 'Nối từ tích Mana tung chiêu: Đảo chiều xoay vòng, Đóng băng thời gian, Cấm phụ âm cực hiểm!',
  },
  {
    id: 'boss',
    tag1: '[ SOLO / CO-OP ]',
    tag1Bg: 'bg-sky-100',
    tag1Text: 'text-sky-700',
    tag2: '[ ĐẤU TRÙM ]',
    title: 'ĐẠI CHIẾN THẦN CHẾT',
    desc: 'Đấu solo 1vs1 hoặc cả hội đồng hợp sức đánh bại Thần Chết AI với kho từ ma mị siêu gắt!',
  },
];

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  isHost,
}) => {
  return (
    <div className="w-full bg-white neo-border-thick rounded-3xl p-4 sm:p-5 shadow-neo flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-dashed border-amber-600 text-amber-700 bg-amber-50 tracking-wider">
            [ CHẾ ĐỘ SINH TỬ ]
          </span>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900">
            CHỌN THỂ THỨC ĐẤU TRƯỜNG (4 CHẾ ĐỘ)
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-gray-500">
          {isHost ? 'Chủ tọa chọn thể thức thi đấu' : 'Chủ tọa đang chọn thể thức'}
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => isHost && onSelectMode(mode.id)}
              className={`neo-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 relative ${
                isSelected
                  ? 'bg-amber-50/70 border-black shadow-neo-sm ring-2 ring-black'
                  : 'bg-white hover:bg-gray-50'
              } ${isHost ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div>
                {/* Top tags row */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neo-border ${mode.tag1Bg} ${mode.tag1Text}`}
                  >
                    {mode.tag1}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {mode.tag2}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-950 mb-1.5">
                  {mode.title}
                </h3>

                {/* Desc */}
                <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-4">
                  {mode.desc}
                </p>
              </div>

              {/* Selection footer */}
              <div className="pt-2 border-t border-gray-200">
                {isSelected ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 inline text-black" strokeWidth={3} />
                      <span>[ ĐANG CHỌN ]</span>
                    </span>
                    <div className="w-full h-1 bg-[#FEE227] rounded-full"></div>
                  </div>
                ) : (
                  <span className="text-xs font-bold uppercase text-gray-400">
                    [ BẤM ĐỂ CHỌN ]
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
