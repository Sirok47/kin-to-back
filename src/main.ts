import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './Settings/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // Swagger
  const swagConfig = new DocumentBuilder()
    .setTitle('Kin-to Backend API')
    .setDescription('sf')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swagConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.PORT);
}
bootstrap().catch(console.error);
//TODO: TESTSSSSS
