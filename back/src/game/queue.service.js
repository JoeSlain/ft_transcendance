"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QueueService = void 0;
var common_1 = require("@nestjs/common");
var QueueService = /** @class */ (function () {
    function QueueService() {
        this.queue = [];
        this.intervals = new Map();
    }
    QueueService.prototype.findOpponent = function (userId, elo, eloRange) {
        var maxElo = elo + eloRange;
        var index = this.queue.findIndex(function (user) { return userId !== user.id && user.elo >= elo - 100 && user.elo <= maxElo; });
        console.log("find opponent");
        console.log("user elo = ".concat(elo));
        console.log("max elo search = ".concat(maxElo));
        if (index >= 0) {
            console.log("opponent elo found = ".concat(this.queue[index].elo));
            console.log("removing opponent ".concat(this.queue[index].username, " from queue"));
            var opponent = this.queue[index];
            this.stopQueue(opponent.id, index);
            return opponent;
            //return this.queue.splice(index, 1)[0];
        }
        return null;
    };
    QueueService.prototype.checkQueued = function (index, userId) {
        return this.queue[index] && this.queue[index].id === userId;
    };
    QueueService.prototype.stopQueue = function (userId, index) {
        if (index === undefined) {
            console.log("index undefined");
            index = this.queue.findIndex(function (user) { return user.id === userId; });
            if (index >= 0) {
                console.log("index found", index);
                this.queue.splice(index, 1);
            }
        }
        else if (this.checkQueued(index, userId)) {
            this.queue.splice(index, 1);
        }
        this.deleteInterval(userId);
    };
    QueueService.prototype.queueUp = function (user) {
        return this.queue.push(user) - 1;
    };
    QueueService.prototype.addInterval = function (userId, intervalId) {
        this.deleteInterval(userId);
        this.intervals.set(userId, intervalId);
    };
    QueueService.prototype.deleteInterval = function (userId) {
        console.log('delete interval enter');
        console.log("get interval ".concat(userId, " : ").concat(this.intervals.get(userId)));
        if (this.intervals.has(userId)) {
            var intervalId = this.intervals.get(userId);
            console.log("delete interval ".concat(intervalId));
            clearInterval(intervalId);
            var del = this.intervals["delete"](userId);
            console.log("deleted ? ".concat(del));
        }
    };
    QueueService = __decorate([
        (0, common_1.Injectable)()
    ], QueueService);
    return QueueService;
}());
exports.QueueService = QueueService;
