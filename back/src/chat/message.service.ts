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
    /*const user = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.conversations", "conv")
      .leftJoinAndSelect("conv.messages", "msg")
      .leftJoinAndSelect("conv.users", "users")
      .leftJoinAndSelect("msg.from", "from")
      .where("user.id = :id AND conv.newMessages = :new", { id, new: true })
      .orderBy({ "msg.id": "ASC" })
      .getOne();*/
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return;

    let convs = await this.convRepo
      .createQueryBuilder("conv")
      .leftJoinAndSelect("conv.messages", "msg")
      .leftJoinAndSelect("conv.user1", "user1")
      .leftJoinAndSelect("conv.user2", "user2")
      .leftJoinAndSelect("msg.from", "from")
      .where("conv.user1.id = :uid1 AND conv.new1 = :new1", {
        uid1: id,
        new1: true,
      })
      .orWhere("conv.user2.id = :uid2 AND conv.new2 = :new2", {
        uid2: id,
        new2: true,
      })
      .orderBy({ "msg.id": "ASC" })
      .getMany();

    if (convs && user.blocked)
      convs = convs.filter(
        (conv) =>
          !user.blocked.includes(conv.user1.id) &&
          !user.blocked.includes(conv.user2.id)
      );

    console.log("convs", convs);

    const ret = [];
    while (convs.length) {
      let conv = convs.shift();
      //conv = await this.updateNewMessages(conv, id);
      ret.push({
        id: conv.id,
        messages: conv.messages,
        to: conv.user1.id === id ? conv.user2 : conv.user1,
        show: false,
      });
    }

    return ret;
  }

  async findConvById(id: number) {
    return await this.convRepo.findOne({
      where: {
        id,
      },
      relations: ["user1", "user2", "messages", "messages.from"],
    });
  }

  async getConversation(me: User, to: User) {
    /*const user = await this.userRepo.findOne({
      relations: [
        "conversations",
        "conversations.messages",
        "conversations.messages.from",
        "conversations.user1",
        'conversations.user2'
      ],
      where: {
        id: me.id,
      },
    });

    const conv = user.conversations.find((conv) =>
      conv.users.find((user) => user.id === to.id)
    );*/

    const conv = await this.convRepo.findOne({
      relations: {
        messages: {
          from: true,
        },
        user1: true,
        user2: true,
      },
      where: [
        {
          user1: {
            id: me.id,
          },
          user2: {
            id: to.id,
          },
        },
        {
          user1: {
            id: to.id,
          },
          user2: {
            id: me.id,
          },
        },
      ],
    });

    if (!conv) {
      return null;
    }
    return conv; /*{
      id: conv.id,
      messages: conv.messages,
      to,
      show: true,
    };*/
  }

  async createConversation(me: User, to: User) {
    let conv = this.convRepo.create({
      user1: me,
      user2: to,
    });

    conv = await this.convRepo.save(conv);
    return conv; /*{
      id: conv.id,
      messages: [],
      to,
      show: true,
    };*/
  }

  async createDm(from: User, content: string) {
    const dm = this.dmRepo.create({ from, content });

    return await this.dmRepo.save(dm);
  }

  async pushDm(conversation: Conversation, dm: DirectMessage) {
    if (dm.from.id === conversation.user1.id) conversation.new2 = true;
    else conversation.new1 = true;
    conversation.messages.push(dm);
    return await this.convRepo.save(conversation);
  }

  async updateNewMessages(conv: Conversation, userId: number) {
    if (userId === conv.user1.id) conv.new1 = false;
    else if (userId === conv.user2.id) conv.new2 = false;
    return await this.convRepo.save(conv);
  }
}
