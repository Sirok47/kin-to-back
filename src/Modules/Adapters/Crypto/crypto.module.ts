import { Module } from '@nestjs/common';
import { HashService } from './bcrypt/bcrypt.adapter';
import { CRYPTO_SYMBOL } from './crypto.interface';

@Module({
  providers: [
    {
      provide: CRYPTO_SYMBOL,
      useClass: HashService,
    },
  ],
  exports: [CRYPTO_SYMBOL],
})
export class HashModule {}
