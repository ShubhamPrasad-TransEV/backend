// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as path from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   //Set up Swagger
//   const config = new DocumentBuilder()
//     .setTitle('Backend API')
//     .setDescription('The backend API description')
//     .setVersion('1.0')
//     .addTag('swagger')
//     .build();

//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   });
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('swagger', app, document);
//   await app.listen(5000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplication } from '@nestjs/core'; // Importing the correct module
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule); // Use NestApplication, not NestExpressApplication

  // Serve static files from the "uploads" folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Images will be accessible via http://your-domain.com/uploads/
  });

  // Enable CORS if frontend and backend are on different domains/ports
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend runs on this port
    credentials: true,
  });

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend API') // Title of your API documentation
    .setDescription('The backend API description') // Short description
    .setVersion('1.0') // Version of the API
    .addTag('swagger') // Tag your API endpoints (optional)
    .build();

  // const document = SwaggerModule.createDocument(app, config);  // Create the Swagger document
  // SwaggerModule.setup('api', app, document);  // Set the Swagger UI at /api

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Start the app
  await app.listen(5000); // Listening on port 5000
}

bootstrap();
