import { Module } from '@nestjs/common';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AdminModule } from 'modules/admin/main/admin.module';
import { DatabaseModule } from 'database/database.module';
import { CategoryAdminModule } from 'modules/admin/category/category.admin.module';
import { ProductModule } from 'modules/product/product.module';
import { PropertyAdminModule } from 'modules/admin/property/property.admin.module';
import { TransactionInterceptor } from 'interceptors/transaction.interceptor';
import { FileModule as FileHelperModule } from 'shared/file/file.module';
import { FileModule } from 'modules/file/file.module';
import { ProductAdminModule } from 'modules/admin/product/product.admin.module';
import { OrderAdminModule } from 'modules/admin/order/order.admin.module';
import { CategoryModule } from 'modules/category/category.module';
import { BasketModule } from 'modules/basket/basket.module';
import { OrderModule } from 'modules/order/order.module';
import { StatusCodeInterceptor } from 'interceptors/status-code.interceptor';
import { PaymentModule } from 'modules/payment/payment.module';
import { CacheModuleGlobal } from 'shared/cache/cache.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusCodeInterceptor,
    },
  ],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
    CacheModuleGlobal,
    DatabaseModule,
    FileModule,
    FileHelperModule,
    AdminModule,
    CategoryAdminModule,
    PropertyAdminModule,
    ProductAdminModule,
    OrderAdminModule,
    ProductModule,
    CategoryModule,
    BasketModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
