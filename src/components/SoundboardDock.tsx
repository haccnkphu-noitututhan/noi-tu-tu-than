import React from 'react';
import { Megaphone, MessageSquare, RotateCw, AlertTriangle, Crosshair, Zap, Frown, ShieldAlert } from 'lucide-react';
import { AudioManager } from '../engine/audioManager';

export type ReactionType = 'oan' | 'latmat' | 'xaovua' | 'phandoi' | 'nokia' | 'tratien';

interface SoundboardDockProps {
  onTriggerReaction: (type: ReactionType, soundKey: string) => void;
  onToggleChat?: () => void;
}

interface ReactionBtn {
  id: ReactionType;
  label: string;
  icon: React.ReactNode;
  soundKey: string;
  bgClass: string;
  textClass: string;
}

const REACTIONS: ReactionBtn[] = [
  {
    id: 'oan',
    label: 'OAN QUÁ!',
    icon: <Frown className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'oan',
    bgClass: 'bg-[#F43F5E] hover:bg-rose-600',
    textClass: 'text-white',
  },
  {
    id: 'latmat',
    label: 'LẬT MẶT!',
    icon: <RotateCw className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'latmat',
    bgClass: 'bg-[#FEE227] hover:bg-yellow-400',
    textClass: 'text-black',
  },
  {
    id: 'xaovua',
    label: 'XẠO VỪA!',
    icon: <AlertTriangle className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'xaovua',
    bgClass: 'bg-[#FB923C] hover:bg-orange-500',
    textClass: 'text-white',
  },
  {
    id: 'phandoi',
    label: 'PHẢN ĐỐI!',
    icon: <ShieldAlert className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'phandoi',
    bgClass: 'bg-[#DC2626] hover:bg-red-700',
    textClass: 'text-white',
  },
  {
    id: 'nokia',
    label: 'NÓ KÌA!',
    icon: <Crosshair className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'nokia',
    bgClass: 'bg-[#BE123C] hover:bg-rose-800',
    textClass: 'text-white',
  },
  {
    id: 'tratien',
    label: 'CHẾT MÀY!',
    icon: <Zap className="w-3.5 h-3.5 inline" strokeWidth={2.5} />,
    soundKey: 'tratien',
    bgClass: 'bg-[#10B981] hover:bg-emerald-600',
    textClass: 'text-white',
  },
];

export const SoundboardDock: React.FC<SoundboardDockProps> = ({
  onTriggerReaction,
  onToggleChat,
}) => {
  const handleClick = (item: ReactionBtn) => {
    AudioManager.playReactionSound(item.soundKey);
    onTriggerReaction(item.id, item.soundKey);
  };

  return (
    <div className="fixed bottom-2.5 inset-x-0 mx-auto max-w-5xl px-2 sm:px-4 z-40 pointer-events-auto">
      <div className="bg-white neo-border-thick rounded-2xl sm:rounded-full shadow-neo-lg px-2.5 sm:px-3 py-1.5 flex items-center gap-2 overflow-hidden">
        {/* Left: Branding badge */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1.5 sm:pr-2 border-r border-gray-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEE227] neo-border flex items-center justify-center shrink-0">
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-black uppercase tracking-tight text-black leading-tight">
              HỘI ĐỒNG PHẢN ỨNG
            </span>
            <span className="text-[9px] font-semibold text-gray-500 leading-tight">
              Biểu cảm & Tiếng lòng tức thì
            </span>
          </div>
        </div>

        {/* Reaction Pill Buttons with Clean Vector Icons - Free scrolling without overlap */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {REACTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`neo-btn flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase whitespace-nowrap cursor-pointer shrink-0 select-none ${item.bgClass} ${item.textClass}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right side icon: Separated Chat drawer toggle button */}
        <div className="shrink-0 border-l-2 border-black pl-2 pr-0.5 flex items-center">
          {onToggleChat && (
            <button
              onClick={onToggleChat}
              className="neo-btn flex items-center gap-1 bg-[#FEE227] hover:bg-yellow-400 text-black px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase cursor-pointer shrink-0 shadow-neo-sm"
              title="Mở phòng chat trực tiếp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CHAT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
