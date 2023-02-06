import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "src/database";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TwoFactorGuard } from "src/auth/2fa/2fa.guard";
import { UsersService } from "./users.service";
import { NotifService } from "./notifs.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

class PostDTO {
  content: string;
}

@Controller("users")
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly notifService: NotifService
  ) {}

  @Get("")
  @UseGuards(TwoFactorGuard)
  async findMe(@Req() req): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: req.user.id });

    /*console.log('get profile', req.user.id);
        console.log(user);*/
    return user;
  }

  @Get("userid/:id")
  @UseGuards(TwoFactorGuard)
  async findOneById(@Param() params: { id: string }): Promise<User | null> {
    console.log(
      "🚀 ~ file: users.controller.ts:49 ~ UsersController ~ findOneById ~ params",
      params
    );

    const user = await this.userRepository.findOneBy({
      id: parseInt(params.id),
    });

    console.log("get profile", user.username);
    return user;
  }

  @Get("username/:username")
  @UseGuards(TwoFactorGuard)
  async findOneByUsername(@Param() params): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      username: params.username,
    });

    /*console.log('find by username')
        console.log(user);*/
    return user;
  }

  @Post("addFriend")
  @UseGuards(TwoFactorGuard)
  async addFriend(@Req() req, @Body() { username }) {
    /*console.log(username);
        console.log('me', req.user.username);*/
    const user = await this.usersService.addFriend(req.user, username);

    return user;
  }

  @Get("friends")
  @UseGuards(TwoFactorGuard)
  async getFriends(@Req() req) {
    console.log("get friends");
    const users = await this.usersService.getFriends(req.user);

    //console.log('friends', users)
    return users;
  }

  @Post("deleteFriend")
  @UseGuards(TwoFactorGuard)
  async deleteFriend(@Req() req, @Body() { userId }) {
    //console.log('delete friend')
    const users = await this.usersService.deleteFriend(req.user, userId);

    return users;
  }

  @Get("notifs")
  @UseGuards(TwoFactorGuard)
  async getNotifs(@Req() req) {
    const notifs = await this.notifService.getNotifs(req.user.id);

    console.log("notifs", notifs);
    return notifs;
  }
  /**
   * @brief Updates user in database
   * @param req : userType
   * @returns updated user
   */
  @Post("updateUser")
  @UseGuards(TwoFactorGuard)
  async updateUser(@Req() req) {
    console.log("REQUEST BODY: ", req.body);
    const user = await this.usersService.updateUser(req.body.user);
    console.log("🚀 ~ file: users.controller.ts:109  UPDATEUSER", user);

    return user;
  }

  /**
   * @brief Updates user's username in database
   * @param req : userType
   * @returns updated user
   */
  @Post("updateUsername")
  @UseGuards(TwoFactorGuard)
  async updateUsername(@Req() req) {
    console.log("REQUEST BODY: ", req.body);
    const user = await this.usersService.updateUsername(
      req.body.id,
      req.body.username
    );
    return user;
  }

  @Post("uploadAvatar")
  @UseGuards(TwoFactorGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          if (!file.originalname)
            callback(new Error("error uploading avatar"), file.fieldname);
          else {
            console.log("filename", file.originalname);
            const filename = file.originalname;
            callback(null, filename);
          }
        },
      }),
    })
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    console.log(
      "🚀 ~ file: users.controller.ts:135 ~ UsersController ~ req",
      req
    );

    const ret = await this.usersService.uploadAvatar(
      req.user.id,
      file.filename
    );
    console.log(
      "🚀 ~ file: users.controller.ts:138 ~ UsersController ~ ret",
      ret
    );
    return ret;
  }

  @Get("getAvatar")
  @UseGuards(TwoFactorGuard)
  getAvatar(@Req() req, @Res() res) {
    const path = req.user.avatar;

    console.log("path", path);
    if (path) return res.sendFile(path, { root: "./uploads" });
    console.log("error geting avatar: invalid file path");
  }

  @Get("getAvatar/:id")
  @UseGuards(TwoFactorGuard)
  async getAvatarById(@Param() params, @Res() res) {
    const user = await this.usersService.getById(params.id);
    if (user && user.avatar)
      return res.sendFile(user.avatar, { root: "./uploads" });
    console.log("error getting avatar: invalid user or file path");
  }

  @Post("blockUser")
  @UseGuards(TwoFactorGuard)
  async blockUser(@Req() req, @Body() { userId }) {
    //console.log('delete friend')
    const user = await this.usersService.block(req.user.id, userId);

    return user;
  }

  @Get("games/:id")
  @UseGuards(TwoFactorGuard)
  async getGames(@Param() params) {
    console.log(`get games ${params.id}`);
    const games = await this.usersService.getGames(params.id);
    console.log("returned games", games);

    return games;
  }
}
