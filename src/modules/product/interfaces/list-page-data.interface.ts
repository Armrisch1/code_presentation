import { Category } from 'models/category';
import { Property } from 'models/property';
import { Breadcrumb } from 'common/types/breadcrumb.type';
import { PaginationResponseInterface } from 'common/interfaces/pagination.interface';
import { Product } from 'models/product';

export interface ListPageDataInterface {
  breadcrumbs: Breadcrumb[];
  subCategories: Category[];
  properties: Property[];
  products: PaginationResponseInterface<Product>;
}
