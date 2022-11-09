"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const typeorm_1 = require("typeorm");
const Session_1 = require("./database/entities/Session");
const connect_typeorm_1 = require("connect-typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const sessionRepo = (0, typeorm_1.getRepository)(Session_1.TypeORMSession);
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
        store: new connect_typeorm_1.TypeormStore().connect(sessionRepo),
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map