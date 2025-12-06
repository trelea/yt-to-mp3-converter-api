import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  /**
   * @description Create the Nest application.
   */
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  /**
   * @description Use the validation pipe.
   */
  app.useGlobalPipes(new ValidationPipe());
  /**
   * @description Enable the versioning.
   */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  /**
   * @description Enable the CORS.
   */
  app.enableCors({
    origin: configService
      .get('FRONTEND_URLS')
      .split(',')
      .map((url: string) => url.trim()),
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  /**
   * @description Listen on the port.
   */
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
