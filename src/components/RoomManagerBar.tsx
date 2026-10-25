import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';

interface RoomManagerBarProps {
  currentRoomId: string;
  onJoinRoom: (targetRoomId: string) => void;
}

export const RoomManagerBar: React.FC<RoomManagerBarProps> = ({
  currentRoomId,
  onJoinRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${currentRoomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      onJoinRoom(inputRoomId.trim().toUpperCase());
      setInputRoomId('');
    }
  };

  return (
    <div className="w-full bg-white neo-border-thick rounded-3xl p-2.5 sm:p-3.5 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Current room + Copy Link button */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="neo-border bg-gray-50 rounded-full px-4 py-1.5 text-xs sm:text-sm font-black uppercase text-gray-800">
          PHÒNG HIỆN TẠI: <span className="text-black underline tracking-wide">{currentRoomId}</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="neo-btn flex items-center gap-1.5 bg-[#10B981] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase cursor-pointer hover:bg-emerald-600"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '[ ĐÃ SAO CHÉP LINK! ]' : '[ SAO CHÉP LINK MỜI BẠN BÈ ]'}</span>
        </button>
      </div>

      {/* Right: Join room input */}
      <form onSubmit={handleJoin} className="flex items-center gap-2">
        <input
          type="text"
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
          placeholder="NHẬP MÃ PHÒNG BẠN BÈ..."
          className="neo-border bg-gray-50 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black placeholder:text-gray-400 focus:outline-none focus:bg-white w-48 sm:w-56"
        />
        <button
          type="submit"
          className="neo-btn flex items-center gap-1 bg-[#FEE227] text-black px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase hover:bg-yellow-400 cursor-pointer"
        >
          <span>[ VÀO PHÒNG ]</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
