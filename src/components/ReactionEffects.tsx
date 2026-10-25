import React from 'react';
import { RotateCw, AlertTriangle, Crosshair, Zap, Frown, ShieldAlert } from 'lucide-react';

export interface FloatingReaction {
  id: string;
  type: 'oan' | 'latmat' | 'xaovua' | 'phandoi' | 'nokia' | 'tratien';
  authorName: string;
  leftPercent: number;
}

interface ReactionEffectsProps {
  reactions: FloatingReaction[];
}

export const ReactionEffects: React.FC<ReactionEffectsProps> = ({ reactions }) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {reactions.map((r) => {
        let bgClass = 'bg-[#F43F5E] text-white';
        let label = 'OAN QUÁ!';
        let icon = <Frown className="w-4 h-4 inline" strokeWidth={3} />;

        switch (r.type) {
          case 'oan':
            bgClass = 'bg-[#F43F5E] text-white';
            label = 'OAN QUÁ!';
            icon = <Frown className="w-4 h-4 inline" strokeWidth={3} />;
            break;
          case 'latmat':
            bgClass = 'bg-[#FEE227] text-black';
            label = 'LẬT MẶT!';
            icon = <RotateCw className="w-4 h-4 inline" strokeWidth={3} />;
            break;
          case 'xaovua':
            bgClass = 'bg-[#FB923C] text-white';
            label = 'XẠO VỪA!';
            icon = <AlertTriangle className="w-4 h-4 inline" strokeWidth={3} />;
            break;
          case 'phandoi':
            bgClass = 'bg-[#DC2626] text-white';
            label = 'PHẢN ĐỐI!';
            icon = <ShieldAlert className="w-4 h-4 inline" strokeWidth={3} />;
            break;
          case 'nokia':
            bgClass = 'bg-[#D946EF] text-white';
            label = 'NÓ KÌA!';
            icon = <Crosshair className="w-4 h-4 inline" strokeWidth={3} />;
            break;
          case 'tratien':
            bgClass = 'bg-[#10B981] text-white';
            label = 'CHẾT MÀY!';
            icon = <Zap className="w-4 h-4 inline" strokeWidth={3} />;
            break;
        }

        return (
          <div
            key={r.id}
            className="absolute bottom-24 pointer-events-none select-none transition-all"
            style={{
              left: `${Math.max(10, Math.min(85, r.leftPercent))}%`,
            }}
          >
            <div className={`-translate-x-1/2 neo-border-thick rounded-full px-4 py-2 font-black text-xs sm:text-sm uppercase shadow-neo flex items-center gap-1.5 animate-float-reaction whitespace-nowrap ${bgClass}`}>
              {icon}
              <span>{label}</span>
              <span className="text-[10px] opacity-90 font-extrabold">({r.authorName})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
