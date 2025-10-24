import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Глобальный фильтр ошибок
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Разрешаем CORS
  app.enableCors({
    ...corsConfig,
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:9000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:9000',
        'http://localhost:5000',
        ...(process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || []),
      ];

      if (!origin) {
        console.log('🌐 No origin (likely Postman or curl)');
        return callback(null, true);
      }

      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        console.log(`🟢 CORS allowed for: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked for: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
  });

  // ✅ Порт
  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}

// ✅ Без ошибок ESLint: ловим ошибки при старте
bootstrap().catch((err) => {
  console.error('❌ Ошибка при запуске приложения:', err);
});
