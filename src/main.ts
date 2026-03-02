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
    .setVersion('0.3')
    .build();
  const document = SwaggerModule.createDocument(app, swagConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      url: '/docs-json',
    },
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });
  app.getHttpAdapter().get('/docs-json', (req, res) => {
    res.json(document);
  });

  await app.listen(config.PORT);
}
bootstrap().catch(console.error);
//TODO: TESTSSSSS
