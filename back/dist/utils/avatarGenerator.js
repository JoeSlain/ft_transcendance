"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
function avatarGenerator(id42) {
    let avatar = null;
    const req = `https://avatars.dicebear.com/api/adventurer-neutral/:${id42.toString()}.svg`;
    console.log("id42 " + id42 + " req: " + req);
    axios_1.default.get(req, avatar)
        .then((response) => {
        console.log("Avatar generate success");
        fs.writeFileSync(avatar, `./${id42}_avatar.svg`);
    })
        .catch((e) => {
        console.log(`Error avatar generator: ${e}`);
    });
}
exports.default = avatarGenerator;
//# sourceMappingURL=avatarGenerator.js.map