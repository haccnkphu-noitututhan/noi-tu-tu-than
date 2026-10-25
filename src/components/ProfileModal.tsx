import React, { useState } from 'react';
import { X, Check, User, Sparkles } from 'lucide-react';
import { AVATAR_OPTIONS, RenderAvatar } from './ComicAvatars';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), selectedAvatar);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] neo-border-thick rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-neo-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="neo-btn absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-black hover:bg-rose-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FEE227] neo-border flex items-center justify-center">
            <User className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
              [ HỒ SƠ ĐẤU SĨ ]
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-950">
              ĐỔI TÊN & AVATAR ĐẤU SĨ
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Live Preview Card */}
          <div className="p-3 bg-amber-50/70 neo-border rounded-2xl flex items-center gap-3">
            <div className="w-14 h-14 bg-white neo-border rounded-xl flex items-center justify-center shrink-0 shadow-neo-sm">
              <RenderAvatar avatarId={selectedAvatar} className="w-11 h-11" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] font-bold text-gray-500 uppercase">Xem trước hiển thị:</div>
              <div className="text-base font-black uppercase text-black truncate">
                {name || 'Chưa đặt tên'}
              </div>
              <div className="text-xs font-semibold text-emerald-600">Đã sẵn sàng mở tòa</div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs font-black uppercase text-gray-700 block mb-1">
              TÊN HIỂN THỊ CỦA BẠN:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Nhập tên đấu sĩ..."
              className="w-full neo-border bg-white rounded-full px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-amber-50"
              required
            />
          </div>

          {/* Avatar Grid Selection */}
          <div>
            <label className="text-xs font-black uppercase text-gray-700 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CHỌN AVATAR (THIẾT KẾ 2D COMIC):</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedAvatar === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedAvatar(opt.id)}
                    className={`neo-border rounded-2xl p-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FEE227] ring-2 ring-black shadow-neo-sm scale-105'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <RenderAvatar avatarId={opt.id} className="w-9 h-9" />
                    </div>
                    <span className="text-[9px] font-black uppercase text-gray-800 text-center leading-tight truncate w-full">
                      {opt.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="neo-btn w-full bg-[#10B981] hover:bg-emerald-600 text-white py-3 rounded-full font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer shadow-neo mt-1"
          >
            <Check className="w-4 h-4" />
            <span>[ LƯU THAY ĐỔI ]</span>
          </button>
        </form>
      </div>
    </div>
  );
};
