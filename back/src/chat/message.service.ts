import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChanMessage, Conversation, DirectMessage, User } from "src/database";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(ChanMessage) private msgRepo: Repository<ChanMessage>,
    @InjectRepository(DirectMessage) private dmRepo: Repository<DirectMessage>,
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>
  ) {}

  async findById(id: number) {
    const message = await this.msgRepo.find({
      where: {
        id,
      },
      relations: {
        from: true,
        channel: true,
      },
    });
    return message[0];
  }

  async createChanMessage(data: any) {
    console.log("create chan message, with data", data);
    let message = this.msgRepo.create({
      content: data.content,
      from: data.from,
      channel: data.channel,
    });
    message = await this.msgRepo.save(message);
    console.log("create message", message);
    return message;
  }

  async getNewMessages(id: number) {
    const convs = await this.convRepo.find({
      relations: {
        users: true,
      },
      where: {
        newMessages: true,
        users: {
          id,
        },
      },
    });

    console.log("new messages", convs);
    return convs;
  }

  async getConversation(me: User, to: User) {
    const conv = await this.convRepo.findOne({
      relations: {
        users: true,
        messages: true,
      },
      where: [
        {
          users: {
            id: me.id,
          },
        },
        {
          users: {
            id: to.id,
          },
        },
      ],
    });

    return {
      id: conv.id,
      messages: conv.messages,
      to,
      show: true,
    };
  }

  async createConversation(me: User, to: User) {
    const users = [me, to];
    let conv = this.convRepo.create({
      users,
    });

    conv = await this.convRepo.save(conv);
    return {
      id: conv.id,
      messages: [],
      to,
      show: true,
    };
  }
}
