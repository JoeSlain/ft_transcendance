import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getRepository } from 'typeorm';
import { TypeORMSession } from './database/entities/Session';
import { TypeormStore } from 'connect-typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const sessionRepo = getRepository(TypeORMSession);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true
  });
  app.use(session({
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    secret: process.env.FT_SECRET,
    resave: false,
    saveUninitialized: false,
    //store: new TypeormStore().connect(sessionRepo),
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3001);
}
bootstrap();