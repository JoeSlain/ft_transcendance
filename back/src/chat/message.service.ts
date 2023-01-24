import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChanMessage, Conversation, DirectMessage, User } from "src/database";
import { In, Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
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
    let message = this.msgRepo.create({
      content: data.content,
      from: data.from,
      channel: data.channel,
    });
    message = await this.msgRepo.save(message);
    return message;
  }

  async getNewMessages(id: number) {
    const user = await this.userRepo.findOne({
      relations: [
        "conversations",
        "conversations.messages",
        "conversations.messages.from",
        "conversations.users",
      ],
      where: {
        id,
        conversations: {
          newMessages: true,
        },
      },
    });

    if (!user) return null;
    const convs = user.conversations;

    const ret = [];
    while (convs.length) {
      const conv = convs.shift();
      ret.push({
        id: conv.id,
        messages: conv.messages.reverse(),
        to: conv.users[0].id === id ? conv.users[1] : conv.users[0],
        show: true,
      });
    }

    return ret;
  }

  async findConvById(id: number) {
    return await this.convRepo.findOne({
      where: {
        id,
      },
      relations: ["users", "messages", "messages.from"],
    });
  }

  async getConversation(me: User, to: User) {
    const user = await this.userRepo.findOne({
      relations: [
        "conversations",
        "conversations.messages",
        "conversations.messages.from",
        "conversations.users",
      ],
      where: {
        id: me.id,
      },
    });

    const conv = user.conversations.find((conv) =>
      conv.users.find((user) => user.id === to.id)
    );

    if (!conv) {
      return null;
    }
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

  async createDm(from: User, content: string) {
    const dm = this.dmRepo.create({ from, content });

    return await this.dmRepo.save(dm);
  }

  async pushDm(conversation: Conversation, dm: DirectMessage) {
    conversation.messages.push(dm);
    conversation.newMessages = true;
    return await this.convRepo.save(conversation);
  }
}
