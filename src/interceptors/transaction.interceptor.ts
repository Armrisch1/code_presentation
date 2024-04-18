import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { Transaction } from 'sequelize';
import { sequelizeHK } from 'database/connection';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    return from(
      sequelizeHK.transaction(async (transaction: Transaction) => {
        req.transaction = transaction;

        try {
          return next.handle().toPromise();
        } catch (err) {
          await transaction.rollback();
          throw new HttpException(err.response, err.status);
        }
      }),
    );
  }
}

// @Injectable()
// export class TransactionInterceptor implements NestInterceptor {
//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//     const ctx = GqlExecutionContext.create(context);
//     const req = ctx.getContext().req;
//     logger('created');
//
//     const transaction: Transaction = await sequelizeTMU.transaction({
//       logging: true,
//       // isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
//     });
//     // const transaction: Transaction | undefined = namespace.get('transaction');
//     req.transaction = transaction;
//
//     return next.handle().pipe(
//       tap(
//         async () => {
//           logger('next');
//           await transaction.commit();
//         },
//         async (error) => {
//           logger(error, 'error');
//         },
//         async () => {
//           logger('complete');
//         },
//       ),
//       catchError(async (err) => {
//         await transaction.rollback();
//         throw new HttpException(err.response, err.status);
//       }),
//     );
//   }
// }
