import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Get Log Level From Environment Variables.
    // Hardcoding to only Error and Warn for this task
    logger: ['error', 'warn'],
  });
  await app.listen(3000);
}
bootstrap();
