"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMSession = exports.User = exports.entities = void 0;
const User_1 = require("./entities/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Session_1 = require("./entities/Session");
Object.defineProperty(exports, "TypeORMSession", { enumerable: true, get: function () { return Session_1.TypeORMSession; } });
exports.entities = [User_1.User, Session_1.TypeORMSession];
//# sourceMappingURL=index.js.map