import { Product } from 'models/product';
import { Property } from 'models/property';
import { Category } from 'models/category';

export interface ProductEditPageInterface {
  product: Product;
  products: Product[];
  properties: Property[];
  categories: Category[];
}
