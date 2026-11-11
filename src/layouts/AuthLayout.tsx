import { ThemeToggle } from '../components/common/ThemeToggle';
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChefHat, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="min-h-screen bg-canvas relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      {/* Decorative Warm Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-orange-300/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[650px] h-[650px] bg-brand-200/20 rounded-full blur-[170px]" />
      </div>

      {/* TOP HEADER TRANG NHÃ */}
      <header className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-16 pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-action flex items-center justify-center text-on-action shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
            <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 font-heading block leading-none">
              Smart<span className="text-slate-700">Cook</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 tracking-widest uppercase">
              AI Culinary Companion
            </span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      {/* MAIN CONTENT CONTAINER RỘNG 2 CỘT */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* CỘT TRÁI (6-7 cols): HÌNH ẢNH ĐẦU BẾP & KHU VỰC MÔ TẢ GIỚI THIỆU HIỆN ĐẠI */}
          <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col items-center lg:items-start justify-center relative space-y-4">
            
            {/* Header giới thiệu thương hiệu ngắn gọn, hiện đại */}
            <div className="space-y-2 max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/90 text-slate-900 text-xs font-black tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-slate-800 animate-pulse" />
                <span>Nền Tảng Nấu Ăn Thông Minh Hàng Đầu</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-black text-slate-900 font-heading leading-tight tracking-tight">
                Vào Bếp Dễ Dàng <br />
                <span className="text-slate-700">
                  Ngon Chuẩn Vị Cùng SmartCook
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tự động tối ưu hóa thực phẩm sẵn có trong tủ lạnh, tính toán calo chuẩn xác theo mục tiêu sức khỏe và đồng hành cùng hơn <strong>25,000+</strong> người yêu bếp trên khắp cả nước.
              </p>
            </div>

            <div className="relative w-full max-w-2xl">
              <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                <img
                  src="/realistic_chef_cooking.jpg"
                  alt="Đầu bếp chế biến món ăn với nguyên liệu tươi"
                  width={1024}
                  height={1024}
                  className="block w-full h-auto select-none"
                />
              </div>
            </div>

            {/* Các điểm nổi bật ngắn gọn bên dưới ảnh */}
            <div className="pt-1 flex items-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Gợi ý 100% nguyên liệu sẵn có</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Cân bằng dinh dưỡng tự động</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Kết nối cộng đồng yêu ẩm thực</span>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (5-6 cols): FORM ĐĂNG NHẬP / ĐĂNG KÝ HÒA TAN 100% VÀO NỀN TRANG WEB */}
          <div className="lg:col-span-5 xl:col-span-5 w-full max-w-md mx-auto lg:mx-0">
            <div className="relative px-2 sm:px-4 py-2">
              {/* Outlet nội dung trang Login hoặc Register */}
              <Outlet />
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER ĐƠN GIẢN */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400">
        © 2026 SmartCook Platform. Đồng hành cùng bữa cơm ấm cúng của mọi gia đình Việt.
      </footer>
    </div>
  );
};
