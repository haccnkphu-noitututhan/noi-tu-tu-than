import React from 'react';

interface StatusTickerProps {
  roomId: string;
  isHost: boolean;
  playerCount: number;
}

export const StatusTicker: React.FC<StatusTickerProps> = ({
  roomId,
  isHost,
  playerCount,
}) => {
  return (
    <div className="w-full bg-white neo-border rounded-full px-4 sm:px-6 py-2 shadow-neo-sm flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800">
      {/* Left indicator */}
      <div className="flex items-center gap-2 overflow-hidden truncate">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="truncate">
          {isHost
            ? `Đang làm Thần Chết chủ phòng ${roomId}. Đã có ${playerCount} người trong phòng, sẵn sàng mở đấu trường!`
            : `Đang kết nối phòng ${roomId}. Chờ Thần Chết chủ phòng bấm bắt đầu!`}
        </span>
      </div>

      {/* Right role */}
      <div className="shrink-0 text-[11px] sm:text-xs font-black uppercase tracking-wider text-gray-500 ml-2">
        VAI TRÒ: <span className="text-black underline">{isHost ? 'CHỦ TỌA' : 'NGƯỜI CHƠI'}</span>
      </div>
    </div>
  );
};
