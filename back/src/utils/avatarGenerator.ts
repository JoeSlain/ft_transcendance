import axios from "axios";
import fs = require('fs');

export default function avatarGenerator(id42 : number) : any
{
    let avatar : any = null;
    const req = `https://avatars.dicebear.com/api/adventurer-neutral/:${id42.toString()}.svg`;
    console.log("id42 " + id42 + " req: " + req);
    axios.get(req, avatar)
    .then((response) => {
        console.log("Avatar generate success")
        fs.writeFileSync(avatar, `./${id42}_avatar.svg`);
    })
    .catch((e) => {
        console.log(`Error avatar generator: ${e}`);
    })
        
}