import { Property } from 'models/property';
import { Category } from 'models/category';
import { Product } from 'models/product';

export interface ProductCreateDataInterface {
  properties: Property[];
  categories: Category[];
  products: Product[];
}
