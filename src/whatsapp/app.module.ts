import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// import { WhatsappService } from './whatsapp.service';
// import { WhatsappController } from './whatsapp.controller';

import { WhatsappService } from './Services';
import { WhatsappController } from './controller';

@Module({
  imports: [HttpModule],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
