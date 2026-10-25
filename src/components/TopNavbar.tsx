import React from 'react';
import { Skull, PlusCircle } from 'lucide-react';

interface TopNavbarProps {
  roomId: string;
  isHost: boolean;
  statusText: string;
  onNewRoom: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  roomId,
  statusText,
  onNewRoom,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-2 px-1">
      {/* Left Badge */}
      <div className="flex items-center gap-2.5 bg-white neo-border rounded-full px-3.5 py-1.5 shadow-neo-sm">
        <div className="w-7 h-7 rounded-full bg-[#FEE227] neo-border flex items-center justify-center">
          <Skull className="w-4 h-4 text-black" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-tight text-sm uppercase">NỐI TỪ TỬ THẦN</span>
          <span className="text-xs font-bold border border-black/40 rounded px-1.5 py-0.5 bg-gray-50">
            {roomId}
          </span>
          <span className="hidden sm:inline text-xs text-gray-500 font-medium">
            • {statusText}
          </span>
        </div>
      </div>

      {/* Right Button */}
      <button
        onClick={onNewRoom}
        className="neo-btn flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase hover:bg-gray-50 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 text-black" />
        <span>[ TẠO PHÒNG MỚI ]</span>
      </button>
    </header>
  );
};
