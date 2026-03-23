import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://15.135.224.224:3000',
      'https://15.135.224.224:3000',
      'http://ec2-15-135-224-224.ap-southeast-2.compute.amazonaws.com:3000',
      'https://ec2-15-135-224-224.ap-southeast-2.compute.amazonaws.com:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean), // Frontend URLs
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'CVKing API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'CVKing Job Portal API Documentation',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 CVKing API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
