import React from 'react';
import { X, Skull, Flame, Shield, Clock } from 'lucide-react';
import { ComicHeart } from './ComicIcons';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] neo-border-thick rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-neo-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="neo-btn absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-black hover:bg-rose-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEE227] neo-border flex items-center justify-center">
            <Skull className="w-7 h-7 text-black" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase text-rose-600 tracking-wider">
              [ HƯỚNG DẪN & BÍ QUYẾT ]
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950">
              LUẬT CHƠI NỐI TỪ TỬ THẦN
            </h2>
          </div>
        </div>

        {/* Content list */}
        <div className="flex flex-col gap-3.5 text-xs sm:text-sm font-semibold text-gray-800">
          <div className="p-3 bg-white neo-border rounded-xl">
            <h4 className="font-black uppercase text-black mb-1 flex items-center gap-1.5">
              <span>1. NỐI TỪ CHUẨN 2 ÂM TIẾT</span>
            </h4>
            <p className="text-gray-600">
              Người đi sau phải nối bằng từ có chữ cái đầu trùng với chữ cuối của người đi trước (Ví dụ: <b className="text-black">tử thần</b> -&gt; <b className="text-black">thần chết</b> -&gt; <b className="text-black">chết tiệt</b>). Từ phải có nghĩa trong từ điển tiếng Việt!
            </p>
          </div>

          <div className="p-3 bg-rose-50 neo-border rounded-xl">
            <h4 className="font-black uppercase text-rose-800 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>2. ĐỒNG HỒ TỬ THẦN & 3 MẠNG SINH TỬ</span>
            </h4>
            <p className="text-gray-600">
              Mỗi lượt có đồng hồ đếm ngược. Hết giờ, lặp lại từ cũ, hoặc gõ từ vô nghĩa sẽ bị Thần Chết trừ 1 tim <ComicHeart filled className="w-4 h-4 inline mx-0.5 text-rose-500" />. Khi hết 3 tim, bạn sẽ biến thành "Hồn Ma Khán Giả" để spam Soundboard troll đối thủ!
            </p>
          </div>

          <div className="p-3 bg-amber-50 neo-border rounded-xl">
            <h4 className="font-black uppercase text-amber-800 mb-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>3. BẪY CHỮ TỬ THẦN (DEAD-END WORDS)</span>
            </h4>
            <p className="text-gray-600">
              Tung ra các từ kết thúc bằng âm tiết hiểm hóc (ví dụ: <b className="text-black">quắp, toét, nghẽn, ruốc, ngoằn, ngoẵng, ngoằm, sượng</b>) sẽ khiến người chơi sau gần như không còn đường nối và mất mạng ngay lập tức!
            </p>
          </div>

          <div className="p-3 bg-purple-50 neo-border rounded-xl">
            <h4 className="font-black uppercase text-purple-800 mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>4. HỘI ĐỒNG PHẢN ĐỐI & TÒA ÁN BÓC PHỐT</span>
            </h4>
            <p className="text-gray-600">
              Nếu ai đó gõ từ "lóng", từ "chế" vô lý, hãy nhấn ngay nút <b className="text-rose-600">[ PHẢN ĐỐI! ]</b> ở thanh Hội Đồng Phản Ứng bên dưới để bắt bẻ đối thủ!
            </p>
          </div>
        </div>

        {/* Footer button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="neo-btn bg-[#FEE227] text-black px-6 py-2 rounded-full font-black text-xs uppercase cursor-pointer hover:bg-yellow-400"
          >
            [ ĐÃ HIỂU, VÀO CHIẾN! ]
          </button>
        </div>
      </div>
    </div>
  );
};
