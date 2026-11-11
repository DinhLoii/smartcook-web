import { ThemeToggle } from '../common/ThemeToggle';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChefHat, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Smartphone, 
  Menu, 
  X, 
  ChevronDown,
  Compass,
  Utensils,
  Camera,
  MessageCircle,
  Flame,
  Award,
  ShoppingCart,
  Refrigerator,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useChatStore } from '../../store/useChatStore';
import { GroceryCartDrawer } from './GroceryCartDrawer';
import { CulinaryChatModal } from '../chat/CulinaryChatModal';
import { getUserAvatarUrl, handleAvatarError } from '../../utils/avatar';

interface UserHeaderProps {
  isLandingPage?: boolean;
}

export const UserHeader: React.FC<UserHeaderProps> = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { items: cartItems, toggleCart, openCart, getTotalPrice } = useCartStore();
  const { toggleChat, conversations, initSocket, loadConversations } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      initSocket();
      loadConversations();
    }
  }, [isAuthenticated, initSocket, loadConversations]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReminderDismissed, setIsReminderDismissed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartTotalCount = isAuthenticated ? cartItems.length : 0;
  const totalPrice = isAuthenticated ? getTotalPrice() : 0;
  const totalUnreadChats = isAuthenticated 
    ? conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    : 0;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    logout();
    navigate('/');
  };

  // Các phân hệ chính
  const authenticatedNavItems = [
    {
      label: 'Khám Phá',
      path: '/',
      icon: Compass,
    },
    {
      label: 'Nguyên Liệu',
      path: '/recipes',
      icon: Utensils,
    },
    {
      label: 'Bếp Của Tôi',
      path: '/my-kitchen',
      icon: Refrigerator,
      sparkle: true,
    },
    {
      label: 'Scan Ảnh AI',
      path: '/scan',
      icon: Camera,
    },
    {
      label: 'Siêu Thị',
      path: '/supermarkets',
      icon: MapPin,
    },
    {
      label: 'Cộng Đồng',
      path: '/community',
      icon: MessageCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all">
      {/* BĂNG RÔN DÀI NHẮC NHỞ USER MUA KHI CÓ NGUYÊN LIỆU TRONG GIỎ HÀNG */}
      {cartTotalCount > 0 && !isReminderDismissed && (
        <div className="w-full bg-brand-600 text-white text-xs sm:text-sm py-2 px-4 shadow-md flex items-center justify-between border-b border-brand-300/30 animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-[1920px] mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-surface"></span>
              </span>
              <ShoppingCart className="w-4 h-4 text-white shrink-0 hidden sm:inline" />
              <p className="font-semibold truncate">
                <span>Bạn đang có <strong className="underline decoration-white font-extrabold">{cartTotalCount} nguyên liệu</strong> trong giỏ đi chợ ({totalPrice.toLocaleString('vi-VN')} đ) chưa xác nhận mua!</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openCart}
                className="px-3.5 py-1 bg-surface text-slate-800 hover:bg-orange-50 font-extrabold text-xs rounded-xl shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Xem & Đặt Mua Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsReminderDismissed(true)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                title="Đóng thông báo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="backdrop-blur-2xl bg-canvas/92 border-b border-slate-200 shadow-xs">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 2xl:px-10 h-20 flex items-center justify-between gap-3">
          
          {/* 1. CỘT TRÁI: LOGO & THƯƠNG HIỆU */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-action flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all duration-300">
              <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-on-action" />
            </div>
          <div className="hidden min-[360px]:block">
            <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 flex items-center font-heading">
              Smart<span className="text-slate-700">Cook</span>
            </span>
          </div>
        </Link>

        {/* 2. CỘT GIỮA: NAVIGATION THOÁNG ĐÃNG, CHỮ NẰM NGANG, KHÔNG ĐÓNG KHUNG MÀU */}
        <nav className="hidden 2xl:flex items-center gap-4 min-[1800px]:gap-6 h-full whitespace-nowrap" aria-label="Điều hướng chính">
          {isAuthenticated ? (
            authenticatedNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-accent-ink'
                      : 'text-slate-600 hover:text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 duration-200 ${
                    isActive ? 'text-accent-ink' : 'text-slate-400 group-hover:text-slate-700'
                  }`} />
                  
                  <span>{item.label}</span>

                  {item.sparkle && (
                    <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  )}

                  {/* VẠCH MÀU CHỈ BÁO NẰM DƯỚI ĐÁY HEADER */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink animate-in fade-in duration-300" />
                  )}

                  {/* Vạch mờ khi hover */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] rounded-full bg-orange-400 opacity-0 group-hover:w-full group-hover:opacity-60 transition-all duration-200" />
                  )}
                </Link>
              );
            })
          ) : (
            <div className="flex items-center gap-4 min-[1800px]:gap-6 h-full">
              <Link 
                to="/"
                aria-current={location.pathname === '/' ? "page" : undefined}
                className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight transition-colors ${
                  location.pathname === '/' ? 'text-accent-ink' : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Khám Phá</span>
                {location.pathname === '/' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink" />
                )}
              </Link>

              <Link 
                to="/recipes"
                aria-current={location.pathname.startsWith('/recipes') ? "page" : undefined}
                className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight transition-colors ${
                  location.pathname.startsWith('/recipes') ? 'text-accent-ink' : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Kho Món Ăn</span>
                {location.pathname.startsWith('/recipes') && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink" />
                )}
              </Link>

              <Link 
                to="/my-kitchen"
                aria-current={location.pathname === '/my-kitchen' ? "page" : undefined}
                className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight transition-colors ${
                  location.pathname === '/my-kitchen' ? 'text-accent-ink' : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <Refrigerator className="w-4 h-4 text-slate-700" />
                <span>Tủ Lạnh Thông Minh</span>
                {location.pathname === '/my-kitchen' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink" />
                )}
              </Link>

              <Link 
                to="/scan"
                aria-current={location.pathname === '/scan' ? "page" : undefined}
                className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight transition-colors ${
                  location.pathname === '/scan' ? 'text-accent-ink' : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <Camera className="w-4 h-4 text-slate-700" />
                <span>AI Camera</span>
                {location.pathname === '/scan' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink" />
                )}
              </Link>

              <Link 
                to="/community"
                aria-current={location.pathname === '/community' ? "page" : undefined}
                className={`group relative flex items-center gap-2 py-7 text-sm font-bold tracking-tight transition-colors ${
                  location.pathname === '/community' ? 'text-accent-ink' : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-slate-700" />
                <span>Cộng Đồng</span>
                {location.pathname === '/community' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-accent-ink" />
                )}
              </Link>
            </div>
          )}
          {!isAuthenticated && <Link to="/supermarkets" className={`flex items-center gap-2 py-7 text-sm font-bold whitespace-nowrap ${location.pathname === '/supermarkets' ? 'text-slate-800' : 'text-slate-600 hover:text-slate-700'}`}><MapPin className="w-4 h-4" />Siêu thị</Link>}
        </nav>

        {/* 3. CỘT PHẢI: TẢI APP, GIỎ HÀNG & TÀI KHOẢN NGƯỜI DÙNG */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          
          {/* NÚT TIN NHẮN BẾP (CULINARY CHAT LOUNGE) */}
          <button
            onClick={toggleChat}
            aria-label="Nhắn tin"
            className={`relative hidden sm:inline-flex min-h-10 min-w-10 items-center justify-center gap-2 px-2.5 min-[1800px]:px-3.5 py-2.5 rounded-xl transition-colors group cursor-pointer ${
              isAuthenticated
                ? 'bg-surface hover:bg-orange-50/80 border border-slate-200/90 hover:border-orange-300'
                : 'bg-brand-50 hover:bg-brand-100 border border-orange-200/90 hover:border-orange-300 text-slate-800 hover:scale-[1.02] active:scale-95'
            }`}
            title={isAuthenticated ? "Mở phòng chat giao lưu ẩm thực" : "Giao lưu bếp & Nhắn tin đầu bếp (Yêu cầu đăng nhập)"}
          >
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-slate-800 group-hover:scale-110 transition-transform" />
              {totalUnreadChats > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-action text-on-action text-[10px] font-black flex items-center justify-center shadow-md shadow-brand-500/25 ring-2 ring-white">
                  <span className="absolute -inset-0.5 rounded-full bg-brand-400 animate-ping opacity-50"></span>
                  <span className="relative z-10">{totalUnreadChats}</span>
                </span>
              )}
              {!isAuthenticated && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </div>
            <span className="hidden min-[1800px]:inline font-bold text-xs text-slate-800">
              Nhắn tin
            </span>
          </button>

          {/* NÚT GIỎ HÀNG ĐI CHỢ (NỔI BẬT Ở HEADER) */}
          <button
            onClick={toggleCart}
            aria-label="Mở giỏ đi chợ"
            className="relative inline-flex min-h-10 min-w-10 items-center justify-center gap-2 px-2.5 min-[1800px]:px-3.5 py-2.5 rounded-xl bg-surface hover:bg-slate-100 border border-slate-200 transition-colors group"
            title="Mở giỏ hàng đi chợ"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-slate-800 group-hover:scale-110 transition-transform" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-action text-on-action text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="hidden min-[1800px]:inline font-bold text-xs text-slate-800">
              Giỏ đi chợ
            </span>
          </button>

          {/* Nút Tải App: Hiện đại, thanh thoát */}
          <a
            href="/#download"
            aria-label="Tải ứng dụng SmartCook"
            className="hidden sm:inline-flex min-h-10 min-w-10 items-center justify-center gap-2 px-2.5 min-[1800px]:px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-surface hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Tải ứng dụng SmartCook trên điện thoại di động"
          >
            <Smartphone className="w-4 h-4 text-slate-700" />
            <span className="hidden min-[1800px]:inline">Tải App</span>
          </a>

          {/* Dành cho Admin portal (nếu là Admin) */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {isAuthenticated && user ? (
            // USER ĐÃ ĐĂNG NHẬP: Dropdown hồ sơ gọn gàng
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-surface hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-300 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="relative shrink-0">
                  <img
                    src={getUserAvatarUrl(user)}
                    alt={user.fullName || user.firstName}
                    onError={handleAvatarError}
                    className="w-8 h-8 rounded-full object-cover border border-orange-300 group-hover:scale-105 transition-transform bg-slate-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                </div>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {user.fullName || `${user.lastName || ''} ${user.firstName || 'Bếp Trưởng'}`.trim()}
                  </span>
                  <span className="text-[10px] text-slate-800 font-semibold">
                    {user.level || 'Đầu Bếp'}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu thả xuống */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-surface shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.fullName || `${user.lastName || ''} ${user.firstName || ''}`.trim()}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-slate-900 text-[10px] font-bold border border-orange-200/60">
                      <Flame className="w-3 h-3 text-slate-700" />
                      <span>{user.chefExp || 120} Điểm kinh nghiệm (XP)</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Hồ sơ & Khẩu vị</span>
                    </Link>

                    <Link
                      to="/recipes"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-slate-800 transition-colors"
                    >
                      <Utensils className="w-4 h-4 text-slate-400" />
                      <span>Món ăn yêu thích</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-900 hover:bg-brand-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-700" />
                        <span>Quản Trị Admin</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-700" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // USER CHƯA ĐĂNG NHẬP: Nút Đăng nhập & Đăng ký
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-800 hover:bg-orange-100/50 transition-all"
              >
                <LogIn className="w-4 h-4 text-slate-700" />
                <span>Đăng nhập</span>
              </Link>

              <Link
                to="/auth/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-on-action bg-action hover:bg-action-hover shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký</span>
              </Link>
            </div>
          )}

          {/* Nút Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="2xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-orange-50 transition-colors"
            aria-label="Menu điều hướng" aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden bg-canvas border-b border-orange-200/80 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {isAuthenticated ? (
              authenticatedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-action text-on-action shadow-md shadow-orange-500/25'
                        : 'text-slate-800 hover:bg-orange-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="space-y-1">
                <Link to="/supermarkets" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-orange-50"><MapPin className="w-4 h-4" />Siêu thị gần bạn</Link>
                <Link
                  to="/"
                  aria-current={location.pathname === '/' ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                    location.pathname === '/' ? 'bg-orange-500 text-white' : 'text-slate-800 hover:bg-orange-50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Khám Phá SmartCook</span>
                </Link>

                <Link
                  to="/recipes"
                  aria-current={location.pathname.startsWith('/recipes') ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                    location.pathname.startsWith('/recipes') ? 'bg-orange-500 text-white' : 'text-slate-800 hover:bg-orange-50'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Kho Món Ăn</span>
                </Link>

                <Link
                  to="/my-kitchen"
                  aria-current={location.pathname === '/my-kitchen' ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                    location.pathname === '/my-kitchen' ? 'bg-orange-500 text-white' : 'text-slate-800 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Refrigerator className="w-4 h-4" />
                    <span>Tủ Lạnh Thông Minh</span>
                  </div>
                  <Sparkles className="w-4 h-4" />
                </Link>

                <Link
                  to="/scan"
                  aria-current={location.pathname === '/scan' ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                    location.pathname === '/scan' ? 'bg-orange-500 text-white' : 'text-slate-800 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Camera className="w-4 h-4" />
                    <span>AI Camera Scan</span>
                  </div>
                  <Sparkles className="w-4 h-4" />
                </Link>

                <Link
                  to="/community"
                  aria-current={location.pathname === '/community' ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                    location.pathname === '/community' ? 'bg-orange-500 text-white' : 'text-slate-800 hover:bg-orange-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cộng Đồng Ẩm Thực</span>
                </Link>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-orange-200/60 space-y-2">
            <a
              href="/#download"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-orange-100/80 hover:bg-orange-200"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải App SmartCook Mobile</span>
            </a>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-rose-700" />
                <span>Đăng xuất</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-surface border border-slate-200"
                >
                  <LogIn className="w-4 h-4 text-slate-700" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-on-action bg-action shadow-md shadow-orange-500/25"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KHUNG TO DÀI CHI TIẾT GIỎ HÀNG ĐI CHỢ (DRAWER SLIDE-OUT HIỆN ĐẠI) */}
      <GroceryCartDrawer />

      {/* MODAL TRÒ CHUYỆN BẾP (CULINARY CHAT LOUNGE - RỘNG GẦN FULL MÀN HÌNH) */}
      <CulinaryChatModal />
    </header>
  );
};
