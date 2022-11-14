"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: true,
        credentials: true
    });
    app.use(session({
        cookie: {
            maxAge: 86400000,
        },
        secret: process.env.FT_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map