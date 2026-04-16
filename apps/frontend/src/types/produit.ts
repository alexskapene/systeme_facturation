export interface Product {
  id: string;
  name: string;
  description?: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  stockQuantity: number;
  active: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Produit A',
    description: 'Produit exemple',
    priceHT: 50,
    tvaRate: 16,
    priceTTC: 58,
    stockQuantity: 150,
    active: true,
  },
];
