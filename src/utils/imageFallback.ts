import type { SyntheticEvent } from 'react';

export const DEFAULT_RECIPE_IMAGE = '/hero_culinary_dish.jpg';

const recipeImages = {
  teriyaki: '/recipe-images/chicken-teriyaki.webp',
  crispyChicken: '/recipe-images/crispy-chicken.webp',
  pasta: '/recipe-images/pasta-bolognese.webp',
  salad: '/recipe-images/salmon-salad.webp',
  steak: '/recipe-images/steak-asparagus.webp',
} as const;

// URL ảnh test hỏng đã biết (ảnh 149-byte màn hình đen hoặc ảnh sai món do upload test)
const CORRUPTED_IMAGE_SUBSTRINGS = [
  'vdbbuq7e02m0iqfekhrn',
  'photo-1621996346565-e3d5d6281541',
  'photo-1546069901-d8a9599a7e63?',
  'photo-1534422298391-e4f8c172dddb', // Ảnh sủi cảo bị nhầm vào canh chua
  'nczyq5mqjoeoq6qcmt10', // 149-byte black JPEG Cloudinary test
  'rt1wbawdw5k9jh6yoo9g', // 149-byte black JPEG Cloudinary test
  'mtd4yy6yrysi9cwwhsvg', // 149-byte black JPEG Cloudinary test
  'zqfvl9unkmumkity1rky', // 149-byte black JPEG Cloudinary test
];

/**
 * Kiểm tra và giải quyết ảnh hợp lệ ngay từ lúc render
 */
export function resolveRecipeImage(url?: string | null, titleOrCategory?: string): string {
  const source = typeof url === 'string' ? url.trim() : '';
  return source && !CORRUPTED_IMAGE_SUBSTRINGS.some((fragment) => source.includes(fragment))
    ? source
    : getFallbackByKeyword(titleOrCategory);
}

/**
 * Tìm ảnh phù hợp theo từ khóa tên món hoặc danh mục
 */
export function getFallbackByKeyword(keyword?: string): string {
  const name = keyword?.toLowerCase() ?? '';
  if (/cơm gà|teriyaki/.test(name)) return recipeImages.teriyaki;
  if (/gà rán|gà chiên giòn/.test(name)) return recipeImages.crispyChicken;
  if (/m[ìỳ] ý|pasta|spaghetti|bolognese/.test(name)) return recipeImages.pasta;
  if (/salad|healthy|eat clean/.test(name)) return recipeImages.salad;
  if (/bít tết|steak/.test(name)) return recipeImages.steak;

  return DEFAULT_RECIPE_IMAGE;
}

/**
 * Event handler xử lý khi ảnh gặp lỗi tải (onError)
 * Ưu tiên ảnh minh họa theo tên món, sau đó dùng ảnh chung đi kèm ứng dụng.
 */
export function handleImageError(
  { currentTarget }: SyntheticEvent<HTMLImageElement>,
  fallbackUrl = DEFAULT_RECIPE_IMAGE
): void {
  const failedSource = currentTarget.src;
  const defaultSource = new URL(DEFAULT_RECIPE_IMAGE, currentTarget.baseURI).href;
  const fallbackSource = new URL(fallbackUrl, currentTarget.baseURI).href;
  if (failedSource === defaultSource) return;
  currentTarget.src = failedSource === fallbackSource ? defaultSource : fallbackSource;
}
