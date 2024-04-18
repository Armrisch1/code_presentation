import { Category } from 'models/category';
import { Property } from 'models/property';

export interface CategoryEditPageInterface {
  category: Category;
  categories: Category[];
  properties: Property[];
}
