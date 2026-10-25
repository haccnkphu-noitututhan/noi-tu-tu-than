import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { RenderAvatar } from './ComicAvatars';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  myPlayerId: string;
}

const QUICK_PHRASES = [
  'Từ này ai chơi má!',
  'Cứu tao với!',
  'Gáy to lên nào!',
  'Bí từ rồi đúng không?',
  'Chịu phạt đi bạn ơi!',
  'Thần Chết tha cho em!',
];

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  myPlayerId,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleSendQuick = (phrase: string) => {
    onSendMessage(phrase);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FFFDF8] neo-border-thick shadow-neo-xl flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FEE227] neo-border flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
              [ PHÒNG TRÒ CHUYỆN ]
            </span>
            <h3 className="text-sm font-black uppercase tracking-tight text-black">
              CHAT TRỰC TIẾP
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="neo-btn w-7 h-7 rounded-full bg-rose-200 flex items-center justify-center text-black hover:bg-rose-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Phrases */}
      <div className="py-2 flex flex-wrap gap-1.5 border-b border-gray-100">
        {QUICK_PHRASES.map((phrase, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendQuick(phrase)}
            className="neo-btn bg-gray-50 hover:bg-[#FEE227] text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer text-gray-800"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5 pr-1">
        {messages.length === 0 ? (
          <div className="text-center text-xs font-semibold text-gray-400 my-auto py-8">
            Chưa có tin nhắn nào. Hãy gửi lời chào hoặc gáy sớm với đối thủ!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myPlayerId;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isMe ? 'flex-row-reverse self-end' : 'self-start'}`}
              >
                <div className="w-7 h-7 bg-white neo-border rounded-lg flex items-center justify-center shrink-0">
                  <RenderAvatar avatarId={msg.senderAvatar} className="w-5 h-5" />
                </div>
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {msg.senderName}
                  </span>
                  <div
                    className={`neo-border rounded-2xl px-3 py-1.5 text-xs font-bold max-w-[240px] break-words shadow-neo-sm ${
                      isMe ? 'bg-[#FEE227] text-black' : 'bg-white text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t-2 border-black">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="w-full neo-border bg-white rounded-full px-3.5 py-2 text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
        />
        <button
          type="submit"
          className="neo-btn bg-[#10B981] hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
