import React, { useState } from 'react';
import { Scale, Dices, Check } from 'lucide-react';

export interface PunishmentConfig {
  totalRounds: number;
  activeRoundIndex: number;
  roundPunishments: string[];
}

export const PRESET_PUNISHMENTS = [
  'Bao cả phòng 1 ly trà sữa / nước ngọt lần tới',
  'Hát 1 bài hoặc ngâm thơ 4 câu do phòng chỉ định',
  'Đổi ảnh đại diện mạng xã hội thành hình bựa trong 24h',
  'Uống cạn 1 cốc nước lọc trong 10 giây',
  'Kể một bí mật xấu hổ chưa từng tiết lộ cho ai',
  'Gọi điện cho bạn bè / người yêu cũ nói 1 câu ngớ ngẩn',
  'Chụp ảnh selfie mặt xấu nhất gửi ngay vào nhóm chat',
  'Bắt chước tiếng kêu của 3 con vật khác nhau',
  'Tự nhận mình là kẻ ngốc nhất bàn và cúi đầu xin lỗi 3 lần',
  'Làm mặt quỷ giữ nguyên trong 30 giây cho cả phòng chụp ảnh',
  'Bật cam múa phụ họa theo 1 điệu nhảy hot trend TikTok',
  'Đọc rap 1 đoạn giới thiệu bản thân cực ngáo ngơ',
];

interface RoundPunishmentConfigProps {
  config: PunishmentConfig;
  onChange: (newConfig: PunishmentConfig) => void;
  isHost: boolean;
}

export const RoundPunishmentConfig: React.FC<RoundPunishmentConfigProps> = ({
  config,
  onChange,
  isHost,
}) => {
  const [customText, setCustomText] = useState('');

  const currentRoundPunishment = config.roundPunishments[config.activeRoundIndex] || PRESET_PUNISHMENTS[0];

  // Change total rounds (2 to 5)
  const handleSelectTotalRounds = (rounds: number) => {
    if (!isHost) return;
    const newPunishments = [...config.roundPunishments];
    while (newPunishments.length < rounds) {
      const randomPreset = PRESET_PUNISHMENTS[Math.floor(Math.random() * PRESET_PUNISHMENTS.length)];
      newPunishments.push(randomPreset);
    }
    onChange({
      ...config,
      totalRounds: rounds,
      activeRoundIndex: Math.min(config.activeRoundIndex, rounds - 1),
      roundPunishments: newPunishments.slice(0, rounds),
    });
  };

  // Change which round is being edited
  const handleSelectActiveRound = (idx: number) => {
    onChange({
      ...config,
      activeRoundIndex: idx,
    });
    setCustomText('');
  };

  // Choose a punishment for the active round
  const handleChoosePunishment = (text: string) => {
    if (!isHost) return;
    const newPunishments = [...config.roundPunishments];
    newPunishments[config.activeRoundIndex] = text;
    onChange({
      ...config,
      roundPunishments: newPunishments,
    });
  };

  // Save custom punishment text
  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHost || !customText.trim()) return;
    handleChoosePunishment(customText.trim());
    setCustomText('');
  };

  // Randomize all rounds
  const handleRandomizeAll = () => {
    if (!isHost) return;
    const shuffled = [...PRESET_PUNISHMENTS].sort(() => 0.5 - Math.random());
    const newPunishments = Array.from({ length: config.totalRounds }).map(
      (_, i) => shuffled[i % shuffled.length]
    );
    onChange({
      ...config,
      roundPunishments: newPunishments,
    });
  };

  return (
    <div className="w-full bg-[#FFFDF8] neo-border-thick rounded-3xl p-4 sm:p-6 shadow-neo flex flex-col gap-4">
      {/* 1. Header matching user image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 neo-border flex items-center justify-center shrink-0 shadow-neo-sm">
            <Scale className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900">
                HÌNH PHẠT THEO TỪNG HIỆP ĐẤU ({config.totalRounds} HIỆP = {config.totalRounds} HÌNH PHẠT)
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-dashed border-rose-500 text-rose-600 bg-rose-50">
                [ MỖI HIỆP 1 PHẠT ]
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-gray-500">
              Số hình phạt tương ứng chính xác số hiệp diễn ra. Bạn có thể cài đặt hình phạt riêng biệt cho từng hiệp!
            </p>
          </div>
        </div>

        {isHost && (
          <button
            type="button"
            onClick={handleRandomizeAll}
            className="neo-btn flex items-center gap-1.5 bg-[#FEE227] hover:bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black uppercase whitespace-nowrap cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Dices className="w-4 h-4" />
            <span>[ NGẪU NHIÊN TẤT CẢ HIỆP ]</span>
          </button>
        )}
      </div>

      {/* 2. Number of rounds selector */}
      <div className="bg-white neo-border rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-neo-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-gray-800">
            SỐ HIỆP THI ĐẤU TRONG TRẬN:
          </span>
          {[2, 3, 4, 5].map((num) => {
            const isSelected = config.totalRounds === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectTotalRounds(num)}
                className={`neo-btn px-3.5 py-1 rounded-full text-xs font-black uppercase cursor-pointer ${
                  isSelected
                    ? 'bg-[#F43F5E] text-white ring-2 ring-black'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {num} Hiệp {num === 3 ? '(Chuẩn)' : ''}
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-semibold text-gray-400">
          Mỗi hiệp thêm vào sẽ tự động có 1 hình phạt riêng tương ứng
        </span>
      </div>

      {/* 3. Choose which round to edit */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase text-gray-800">
          CHỌN HIỆP ĐỂ CHỈNH:
        </span>
        {Array.from({ length: config.totalRounds }).map((_, i) => {
          const isSelected = config.activeRoundIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectActiveRound(i)}
              className={`neo-btn px-4 py-1.5 rounded-full text-xs font-black uppercase cursor-pointer ${
                isSelected
                  ? 'bg-[#F43F5E] text-white ring-2 ring-black'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              HIỆP {i + 1} {isSelected ? '(SỬA)' : ''}
            </button>
          );
        })}
      </div>

      {/* 4. Active round punishment editor card */}
      <div className="bg-white neo-border-thick rounded-2xl p-4 sm:p-5 shadow-neo-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2">
          <span className="text-xs sm:text-sm font-black uppercase text-gray-900">
            CÀI ĐẶT HÌNH PHẠT CHO <span className="text-rose-600 underline">HIỆP {config.activeRoundIndex + 1}</span>:
          </span>
          <span className="text-xs font-bold text-gray-600 truncate max-w-md">
            Đang chọn: <span className="text-rose-600 font-black">"{currentRoundPunishment}"</span>
          </span>
        </div>

        {/* 12 Preset punishment pills */}
        <div className="flex flex-wrap gap-2 py-1">
          {PRESET_PUNISHMENTS.map((item, idx) => {
            const isChosen = currentRoundPunishment === item;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChoosePunishment(item)}
                className={`neo-btn text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isChosen
                    ? 'bg-rose-500 text-white border-black ring-1 ring-black font-black'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                {isChosen && <Check className="w-3.5 h-3.5 inline mr-1" strokeWidth={3} />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Punishment Input */}
        {isHost && (
          <form onSubmit={handleSaveCustom} className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`Hoặc gõ hình phạt tự chế cho Hiệp ${config.activeRoundIndex + 1} rồi bấm Áp dụng...`}
              className="w-full neo-border bg-gray-50 rounded-full px-4 py-2 text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              className="neo-btn bg-[#F43F5E] hover:bg-rose-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase whitespace-nowrap cursor-pointer shrink-0"
            >
              [ LƯU HIỆP {config.activeRoundIndex + 1} ]
            </button>
          </form>
        )}
      </div>

      {/* 5. Summary strip of all rounds at bottom */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
          <span>DANH SÁCH HÌNH PHẠT CÁC HIỆP THI ĐẤU:</span>
          <span>(bấm vào hiệp bất kỳ bên dưới để chỉnh sửa)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: config.totalRounds }).map((_, i) => {
            const isEditing = config.activeRoundIndex === i;
            const punishment = config.roundPunishments[i] || PRESET_PUNISHMENTS[i % PRESET_PUNISHMENTS.length];

            return (
              <div
                key={i}
                onClick={() => handleSelectActiveRound(i)}
                className={`neo-border rounded-2xl p-3 flex flex-col justify-between gap-2 cursor-pointer transition-all ${
                  isEditing
                    ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-500 shadow-neo-sm'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-black bg-gray-100 neo-border rounded-md px-2 py-0.5">
                    HIỆP {i + 1}
                  </span>
                  {isEditing && (
                    <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                      ĐANG CHỌN
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-relaxed">
                  {punishment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
