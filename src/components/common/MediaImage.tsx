import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';

type MediaImageProps = Pick<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className' | 'loading'> & {
  compact?: boolean;
};

export function MediaImage({ src, alt, className = '', loading = 'lazy', compact = false }: MediaImageProps) {
  const [failedSource, setFailedSource] = useState<string>();

  if (!src || failedSource === src) {
    return (
      <span className={`grid min-w-0 place-content-center gap-1 bg-slate-100 text-center text-xs text-slate-600 ${compact ? '' : 'min-h-16 p-2'} ${className}`}>
        <ImageOff size={compact ? 14 : 18} className="mx-auto" aria-hidden="true" />
        <span className={compact ? 'sr-only' : undefined}>Ảnh không khả dụng</span>
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailedSource(src)} />;
}
