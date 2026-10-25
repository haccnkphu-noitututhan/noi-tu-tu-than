import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';

interface RoomManagerBarProps {
  currentRoomId: string;
  inviterName?: string;
  onJoinRoom: (targetRoomId: string) => void;
}

export const RoomManagerBar: React.FC<RoomManagerBarProps> = ({
  currentRoomId,
  inviterName,
  onJoinRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${currentRoomId}`;
    const author = inviterName ? inviterName : 'Một đấu sĩ bí ẩn';

    const uniqueInviteMessage = `[ TRÁT TRIỆU TẬP: NỐI TỪ TỬ THẦN ]
Bạn đã được mời tham gia Đấu Trường Nối Từ Sinh Tử (Phòng: ${currentRoomId})!
• Người thách đấu: ${author}
• Luật chơi: 3 tim đếm ngược, nối từ thần tốc, dính bẫy tử thần là mất mạng!
• Bản án: Kẻ đứng bét bảng sẽ phải thi hành hình phạt trước hội đồng!

Nhấp link để bước lên sàn đấu ngay:
${url}`;

    navigator.clipboard.writeText(uniqueInviteMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      onJoinRoom(inputRoomId.trim().toUpperCase());
      setInputRoomId('');
    }
  };

  return (
    <div className="w-full bg-white neo-border-thick rounded-3xl p-3 sm:p-4 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Current room + Copy Link button */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="neo-border bg-gray-50 rounded-full px-4 py-1.5 text-xs sm:text-sm font-black uppercase text-gray-800">
          PHÒNG HIỆN TẠI: <span className="text-black underline tracking-wide">{currentRoomId}</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="neo-btn flex items-center gap-1.5 bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase cursor-pointer"
          title="Sao chép lời mời độc đáo kèm link gửi cho bạn bè"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              <span>[ ĐÃ CHÉP LỜI MỜI ĐỘC ĐÁO! ]</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <Copy className="w-3.5 h-3.5" />
              <span>[ SAO CHÉP LỜI MỜI BẠN BÈ ]</span>
            </>
          )}
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
          className="neo-btn flex items-center gap-1 bg-[#FEE227] hover:bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase cursor-pointer"
        >
          <span>[ VÀO PHÒNG ]</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
