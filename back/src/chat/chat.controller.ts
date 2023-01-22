import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/database";
import { Repository } from "typeorm";
import { ChatService } from "./chat.service";
import { TwoFactorGuard } from "src/auth/2fa/2fa.guard";
import { ChannelService } from "./channel.service";
import { MessageService } from "./message.service";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService
  ) {}

  @Get("privateChannels")
  @UseGuards(TwoFactorGuard)
  async getPrivateChannels(@Req() req) {
    const chans = await this.channelService.getPrivateChannels(req.user.id);

    return chans;
  }

  @Get("publicChannels")
  @UseGuards(TwoFactorGuard)
  async getPublicChannels(@Req() req) {
    const chans = await this.channelService.getPublicChannels();

    return chans;
  }

  @Get("getNewMessages")
  @UseGuards(TwoFactorGuard)
  async getNewMessages(@Req() req) {
    const convs = await this.messageService.getNewMessages(req.user.id);

    return convs;
  }
}
