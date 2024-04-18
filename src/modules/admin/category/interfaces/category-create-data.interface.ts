import { Category } from 'models/category';
import { Property } from 'models/property';

export interface CategoryCreateDataInterface {
  categories: Category[];
  properties: Property[];
}
