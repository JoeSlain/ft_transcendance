import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UsersModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
