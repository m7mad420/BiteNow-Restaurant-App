// Menu types

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular?: boolean;
  allergens?: string[];
  calories?: number;
}

export interface MenuResponse {
  restaurantId: string;
  categories: MenuCategory[];
}
