import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Utensils,
  ChevronDown,
  ChefHat,
  MessageSquare,
  Bot,
  Flame,
  Clock,
  ArrowRight,
  Lock,
  LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { aiApi, type ChatMessageContext } from '../../api/ai.api';
import { useAuthStore } from '../../store/useAuthStore';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedDishes?: string[];
  quickPrompts?: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Xin chào bạn! Mình là **Đầu Bếp Trợ Lý AI** của SmartCook 👩‍🍳.\n\nHôm nay bạn muốn nấu món gì, cần gợi ý thực đơn, hay đang băn khoăn cách chế biến nguyên liệu nào?',
    time: 'Vừa xong',
    suggestedDishes: ['Cơm Gà Teriyaki Áp Chảo', 'Bò Bít Tết Sốt Tiêu Măng Tây', 'Canh Chua Cá Hồi'],
    quickPrompts: [
      'Hôm nay ăn gì nhanh gọn?',
      'Món thanh đạm ít dầu',
      'Cách ướp thịt bò mềm',
      'Gợi ý bữa tối 2 người'
    ]
  }
];

const DEFAULT_QUICK_PROMPTS = [
  'Hôm nay ăn gì nhanh gọn?',
  'Món thanh đạm ít dầu',
  'Cách ướp thịt bò mềm',
  'Gợi ý bữa tối 2 người',
  'Món ngon từ ức gà',
  'Nấu gì dưới 20 phút?'
];

export const FloatingChefAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus ô input khi mở modal (chỉ khi đã đăng nhập)
  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleSendMessage = async (queryToSend?: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const query = (queryToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Cập nhật giao diện tin nhắn của user
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Chuẩn bị lịch sử hội thoại gửi lên backend
    const conversationHistory: ChatMessageContext[] = messages
      .slice(-6)
      .map((m) => ({ sender: m.sender, text: m.text }));

    try {
      const reply = await aiApi.assistantChat(query, conversationHistory);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedDishes: reply.suggestedDishes,
        quickPrompts: reply.quickPrompts
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Lỗi khi trò chuyện với AI:', error);
      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Bếp xin lỗi, hệ thống AI đang bận trong giây lát. Bạn hãy thử lại câu hỏi nhé!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
  };

  const handleSuggestedDishClick = (dishName: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    handleSendMessage(`Hãy hướng dẫn tôi công thức chi tiết và các bước nấu món "${dishName}" nhé!`);
  };

  // Helper format bold text trong tin nhắn markdown
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <aside aria-label="Đầu Bếp Trợ Lý AI" className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* ========================================================================= */}
      {/* 1. NÚT MASCOT ĐẦU BẾP AI NỔI TRÒN (FLOATING CHEF BOT BUTTON)              */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="relative group">
          {/* Mascot Button Nổi Bật */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Mở Trợ lý Ảo SmartCook"
            className="relative size-14 rounded-full bg-surface p-1 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {/* Ảnh Avatar Đầu Bếp Robot Tròn Trị Chuẩn Mobile */}
            <img
              src="/ai-chef-avatar.png"
              alt="Đầu Bếp Trợ Lý AI"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none drop-shadow-sm"
            />

            {/* Online Status Dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-xs" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CỬA SỔ HỘI THOẠI TRỢ LÝ AI CHUẨN HIỆN ĐẠI (AI CHAT WINDOW MODAL)         */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="w-[min(360px,calc(100vw_-_2rem))] sm:w-[410px] md:w-[430px] h-[580px] max-h-[calc(100dvh_-_2rem)] bg-surface/95 backdrop-blur-xl rounded-[28px] shadow-[0_16px_50px_rgba(0,0,0,0.18)] border border-orange-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* HEADER CHAT XỊN SÒ */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-brand-500 p-4 px-5 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white/20 p-0.5 border-2 border-white/60 shrink-0 overflow-hidden shadow-inner">
                <img
                  src="/ai-chef-avatar.png"
                  alt="Đầu Bếp Trợ Lý AI"
                  className="w-full h-full object-cover rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base tracking-tight font-heading leading-none">
                    Đầu Bếp Trợ Lý AI
                  </h3>
                  <Sparkles className="w-4 h-4 text-media-muted fill-current" />
                </div>
                <p className="text-[11px] text-media-muted font-medium mt-0.5">
                  SmartCook • Tư vấn thực đơn & nấu nướng
                </p>
              </div>
            </div>

            {/* Các Nút Điều Khiển */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Làm mới đoạn chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* THÔNG TIN NGỮ CẢNH TỦ LẠNH & KHẨU VỊ */}
          {isAuthenticated && (
            <div className="bg-orange-50/80 border-b border-orange-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-900">
              <span className="flex items-center gap-1 font-medium truncate">
                <span>🥗</span>
                <span>Đã kết nối tủ lạnh & khẩu vị: <b>{user?.firstName || 'Bạn'}</b></span>
              </span>
              <Link to="/my-kitchen" className="text-slate-800 hover:underline font-bold shrink-0 text-[10px]">
                Xem tủ lạnh →
              </Link>
            </div>
          )}

          {/* DANH SÁCH TIN NHẮN (MESSAGE LIST) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-gradient-to-b from-orange-50/20 to-transparent">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Avatar AI nhỏ bên trái */}
                  {isAI && (
                    <div className="w-8 h-8 rounded-full border border-slate-200 shrink-0 overflow-hidden bg-surface shadow-2xs mt-0.5">
                      <img
                        src="/ai-chef-avatar.png"
                        alt="Chef Bot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isAI ? 'items-start' : 'items-end flex flex-col'}`}>
                    {/* Bong bóng tin nhắn */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isAI
                          ? 'bg-brand-50 border border-orange-200/70 text-slate-800 rounded-tl-sm'
                          : 'bg-gradient-to-r from-orange-500 to-brand-500 text-white rounded-tr-sm font-medium shadow-orange-500/20'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Gợi Ý Món Ăn Bấm Được Trực Tiếp (Clickable Suggested Dishes) */}
                      {isAI && msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-orange-200/60 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            <span>Món ăn gợi ý liên quan:</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedDishes.map((dish) => (
                              <button
                                key={dish}
                                onClick={() => handleSuggestedDishClick(dish)}
                                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-orange-500 hover:text-white border border-orange-300 text-slate-900 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1"
                              >
                                <span>{dish}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick prompts kèm theo phản hồi của AI */}
                    {isAI && msg.quickPrompts && msg.quickPrompts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.quickPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleSendMessage(prompt)}
                            className="px-2.5 py-1 rounded-full bg-orange-100/70 hover:bg-orange-200 text-slate-900 text-[10px] font-bold transition-colors text-left"
                          >
                            💬 {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}

            {/* Hiệu ứng đang gõ phản hồi */}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-500 animate-pulse">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                  <img src="/ai-chef-avatar.png" alt="Chef Bot" className="w-full h-full object-cover" />
                </div>
                <div className="bg-brand-50 border border-orange-200/70 px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-900">Đầu bếp AI đang soạn câu trả lời</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* THÔNG BÁO YÊU CẦU ĐĂNG NHẬP (UNAUTHENTICATED LOCK CARD) */}
            {!isAuthenticated && (
              <div className="my-2 p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-orange-50 to-orange-100/60 border border-orange-200/80 shadow-xs text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/10 border border-orange-200 flex items-center justify-center text-slate-800 shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Đăng nhập để trò chuyện với Đầu Bếp AI
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1 max-w-[280px] mx-auto">
                    Hỏi đáp công thức món ăn, tính toán calo và nhận gợi ý chuẩn khẩu vị theo tủ lạnh của bạn!
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng Nhập</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-2 rounded-xl bg-surface hover:bg-orange-50 border border-orange-200 text-slate-800 font-bold text-xs transition-all active:scale-95"
                  >
                    Tạo Tài Khoản
                  </Link>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* THANH GỢI Ý CÂU HỎI NHANH TRÊN Ô INPUT */}
          <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Hỏi nhanh:</span>
            {DEFAULT_QUICK_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  handleSendMessage(p);
                }}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-slate-800 text-[10px] font-medium whitespace-nowrap transition-colors shadow-2xs shrink-0 flex items-center gap-1"
              >
                {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                <span>{p}</span>
              </button>
            ))}
          </div>

          {/* INPUT FORM GỬI TIN NHẮN / KHÓA KHI CHƯA ĐĂNG NHẬP */}
          <div className="p-3 bg-surface border-t border-orange-100">
            {!isAuthenticated ? (
              <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-orange-50/80 border border-orange-200/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-orange-100 text-slate-800 flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-700 font-medium truncate">
                    Vui lòng đăng nhập để hỏi đáp
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-2.5 py-1.5 rounded-xl bg-surface hover:bg-orange-50 border border-orange-200 text-slate-900 font-bold text-xs transition-all active:scale-95"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi đầu bếp AI về món ăn, calo, mẹo nấu..."
                    disabled={isTyping}
                    className="w-full pl-3.5 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-focus focus:bg-surface text-xs font-medium text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                  />
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="w-10 h-10 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-orange-500/20 active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      )}
    </aside>
  );
};
