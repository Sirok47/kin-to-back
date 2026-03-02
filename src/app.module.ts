import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './Modules/MenuCRUD/menu.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { TypeormConfig } from '../typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeormConfig), AuthModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
