import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { ComicBomb, ComicSkull } from './ComicIcons';

interface SecretTrapBoxProps {
  trapWords: string[];
  onAddTrapWord: (word: string) => void;
  onRemoveTrapWord: (word: string) => void;
}

const TRAP_SUGGESTIONS = [
  'quắp', 'toét', 'nghẽn', 'ruốc', 'ngoằn', 'ngoẵng', 'ngoằm', 'sượng',
  'kễnh', 'khoắng', 'bẵng', 'ngỗng', 'khọm', 'bộp', 'khuất'
];

export const SecretTrapBox: React.FC<SecretTrapBoxProps> = ({
  trapWords,
  onAddTrapWord,
  onRemoveTrapWord,
}) => {
  const [inputWord, setInputWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWord.trim()) {
      onAddTrapWord(inputWord.trim());
      setInputWord('');
    }
  };

  const handleSuggest = () => {
    const random = TRAP_SUGGESTIONS[Math.floor(Math.random() * TRAP_SUGGESTIONS.length)];
    setInputWord(random);
  };

  return (
    <div className="w-full bg-[#FFFDF8] neo-border-thick rounded-3xl p-4 sm:p-5 shadow-neo flex flex-col gap-3">
      {/* Header with dashed badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-dashed border-rose-500 text-rose-600 bg-rose-50 tracking-wider">
            [ HÒM THƯ BÍ MẬT ]
          </span>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900">
            TỰ SOẠN TỪ BẪY TỬ THẦN CHO BẠN BÈ ({trapWords.length} TỪ ĐÃ NỘP)
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs font-semibold text-gray-500">
          Hệ thống sẽ lấy chính các từ hiểm này để ép đối thủ vào đường cùng!
        </p>
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="VD: quắp, ngoằn, toét, ruốc, nghẽn, sượng, khoắng..."
            className="w-full neo-border bg-white rounded-full px-4 py-2 text-xs sm:text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:bg-amber-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSuggest}
            className="neo-btn flex items-center gap-1 bg-[#FEE227] text-black px-3.5 py-2 rounded-full text-xs font-black uppercase cursor-pointer hover:bg-yellow-400"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>[ GỢI Ý TỪ ]</span>
          </button>

          <button
            type="submit"
            className="neo-btn flex items-center gap-1.5 bg-[#F43F5E] text-white px-4 py-2 rounded-full text-xs font-black uppercase cursor-pointer hover:bg-rose-600"
          >
            <ComicBomb className="w-4 h-4" />
            <span>[ NỘP BẪY TỬ THẦN ]</span>
          </button>
        </div>
      </form>

      {/* Traps submitted list */}
      {trapWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-500 uppercase">Từ bẫy đã cài:</span>
          {trapWords.map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 neo-border rounded-full px-2.5 py-0.5 text-xs font-black uppercase"
            >
              <ComicSkull className="w-3.5 h-3.5 inline" />
              <span>{word}</span>
              <button
                type="button"
                onClick={() => onRemoveTrapWord(word)}
                className="text-rose-500 hover:text-black font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
