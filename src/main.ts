import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'fastify-compress';
import { fastifyHelmet } from 'fastify-helmet';

async function bootstrap() {
  const httpsOptions = {
    allowHTTP1: true,
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_CA),
  };
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ http2: true, https: httpsOptions }),
  );
  const config = new DocumentBuilder()
    .setTitle('Users API example')
    .setDescription('The users API description')
    .setVersion('1.0')
    .build();
  await app.register(compression);
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'unsafe-inline'", "'self'"],
        fontSrc: [],
        imgSrc: ['data:', "'self'"],
        scriptSrc: ["'unsafe-inline'", "'self'"],
        objectSrc: ['none'],
        baseUri: ['none'],
        frameAncestors: ['none'],
        frameSrc: ['none'],
        blockAllMixedContent: [],
        upgradeInsecureRequests: [],
      },
    },
    noSniff: true,
    hsts: true,
    xssFilter: true,
    frameguard: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
