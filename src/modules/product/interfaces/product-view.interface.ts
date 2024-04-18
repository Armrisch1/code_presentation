import { Product } from 'models/product';
import { Breadcrumb } from 'common/types/breadcrumb.type';

export interface ProductViewInterface {
  product: Product;
  bestsellers: Product[];
  breadcrumbs: Breadcrumb[];
}
