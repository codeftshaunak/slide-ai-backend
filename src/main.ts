import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
  });
  
  // const app = await NestFactory.create(AppModule);



  // app.useGlobalPipes(
  //   new CustomValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  app.enableCors({
    origin: ['http://localhost:3006','http://localhost:4200', 'http://localhost:3000'
      ,'https://community.cofounderslab.com','https://cofounderslab.com',
      'https://staging.cofounderslab.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }

);

    // Set up a route to respond with a welcome message
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/', (req, res) => {
      res.send('Welcome AI');
    });

  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API ZEEWORK.Co')
    .setDescription('The API documentation')
    // .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  app.setGlobalPrefix('api/v1');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';
  

  await app.listen(port, host);
  console.log(`API swagger is running on http://${host}:${port}/api/doc`);
}

bootstrap();
