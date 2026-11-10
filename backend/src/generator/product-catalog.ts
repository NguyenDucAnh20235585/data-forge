import type { DataLocale } from './faker-locale';

type Localized<T> = Record<DataLocale, T>;

type Category = 'electronics' | 'fashion' | 'home';

export type CatalogProduct = {
  category: Category;
  name: Localized<string>;
  price: Localized<number>;
};

export const CATEGORY_LABELS: Record<Category, Localized<string>> = {
  electronics: {
    en: 'Electronics',
    vi: 'Điện tử',
    ja: '家電',
  },
  fashion: {
    en: 'Fashion',
    vi: 'Thời trang',
    ja: 'ファッション',
  },
  home: {
    en: 'Home & Living',
    vi: 'Gia dụng',
    ja: 'ホーム・生活用品',
  },
};

export const CURRENCY_BY_LOCALE = {
  en: 'USD',
  vi: 'VND',
  ja: 'JPY',
} as const;

export const COLOR_VARIANTS: Localized<string>[] = [
  { en: 'Black', vi: 'Đen', ja: 'ブラック' },
  { en: 'White', vi: 'Trắng', ja: 'ホワイト' },
  { en: 'Blue', vi: 'Xanh dương', ja: 'ブルー' },
];
export const PRODUCT_CATALOG: CatalogProduct[] = [
  {
    category: 'electronics',
    name: {
      en: 'Nova X2 Wireless Headphones',
      vi: 'Tai nghe không dây Nova X2',
      ja: 'Nova X2 ワイヤレスヘッドホン',
    },
    price: { en: 79, vi: 1490000, ja: 8900 },
  },
  {
    category: 'electronics',
    name: {
      en: 'Volt 10000mAh Power Bank',
      vi: 'Pin sạc dự phòng Volt 10000mAh',
      ja: 'Volt 10000mAh モバイルバッテリー',
    },
    price: { en: 29, vi: 590000, ja: 3900 },
  },
  {
    category: 'electronics',
    name: {
      en: 'Orbit Wireless Earbuds',
      vi: 'Tai nghe Bluetooth Orbit',
      ja: 'Orbit ワイヤレスイヤホン',
    },
    price: { en: 49, vi: 890000, ja: 5900 },
  },
  {
    category: 'electronics',
    name: {
      en: 'Pulse Mini Bluetooth Speaker',
      vi: 'Loa Bluetooth Pulse Mini',
      ja: 'Pulse Mini Bluetoothスピーカー',
    },
    price: { en: 59, vi: 1190000, ja: 6900 },
  },
  {
    category: 'fashion',
    name: {
      en: 'Essential Cotton T-Shirt',
      vi: 'Áo thun cotton Essential',
      ja: 'Essential コットンTシャツ',
    },
    price: { en: 19, vi: 249000, ja: 1990 },
  },
  {
    category: 'fashion',
    name: {
      en: 'Urban Zip Hoodie',
      vi: 'Áo hoodie khóa kéo Urban',
      ja: 'Urban ジップパーカー',
    },
    price: { en: 49, vi: 699000, ja: 5900 },
  },
  {
    category: 'fashion',
    name: {
      en: 'Everyday Canvas Tote',
      vi: 'Túi tote vải canvas Everyday',
      ja: 'Everyday キャンバストート',
    },
    price: { en: 15, vi: 179000, ja: 1490 },
  },
  {
    category: 'fashion',
    name: {
      en: 'Urban Commuter Backpack',
      vi: 'Ba lô đi học Urban',
      ja: 'Urban 通勤バックパック',
    },
    price: { en: 39, vi: 549000, ja: 4900 },
  },
  {
    category: 'home',
    name: {
      en: 'Luma LED Desk Lamp',
      vi: 'Đèn bàn LED Luma',
      ja: 'Luma LEDデスクライト',
    },
    price: { en: 39, vi: 490000, ja: 4990 },
  },
  {
    category: 'home',
    name: {
      en: 'Thermal Steel Bottle 750ml',
      vi: 'Bình giữ nhiệt inox 750ml',
      ja: 'ステンレス保温ボトル 750ml',
    },
    price: { en: 24, vi: 299000, ja: 2990 },
  },
  {
    category: 'home',
    name: {
      en: 'Aero Travel Mug',
      vi: 'Cốc giữ nhiệt Aero',
      ja: 'Aero トラベルマグ',
    },
    price: { en: 19, vi: 249000, ja: 1990 },
  },
  {
    category: 'home',
    name: {
      en: 'Soft Cotton Cushion',
      vi: 'Gối tựa cotton mềm',
      ja: 'ソフトコットンクッション',
    },
    price: { en: 22, vi: 319000, ja: 2490 },
  },
];
