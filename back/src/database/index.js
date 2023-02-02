"use strict";
exports.__esModule = true;
exports.Secret = exports.Conversation = exports.DirectMessage = exports.Restriction = exports.Game = exports.ChanMessage = exports.Channel = exports.Notif = exports.TypeORMSession = exports.User = exports.entities = void 0;
var User_1 = require("./entities/User");
exports.User = User_1.User;
var Session_1 = require("./entities/Session");
exports.TypeORMSession = Session_1.TypeORMSession;
var Notif_1 = require("./entities/Notif");
exports.Notif = Notif_1.Notif;
var Channel_1 = require("./entities/Channel");
exports.Channel = Channel_1.Channel;
var ChanMessage_1 = require("./entities/ChanMessage");
exports.ChanMessage = ChanMessage_1.ChanMessage;
var Game_1 = require("./entities/Game");
exports.Game = Game_1.Game;
var Restriction_1 = require("./entities/Restriction");
exports.Restriction = Restriction_1.Restriction;
var DirectMessages_1 = require("./entities/DirectMessages");
exports.DirectMessage = DirectMessages_1.DirectMessage;
var Conversation_1 = require("./entities/Conversation");
exports.Conversation = Conversation_1.Conversation;
var Secret_1 = require("./entities/Secret");
exports.Secret = Secret_1.Secret;
exports.entities = [
    User_1.User,
    Session_1.TypeORMSession,
    Notif_1.Notif,
    Channel_1.Channel,
    ChanMessage_1.ChanMessage,
    Game_1.Game,
    Restriction_1.Restriction,
    DirectMessages_1.DirectMessage,
    Conversation_1.Conversation,
    Secret_1.Secret,
];
