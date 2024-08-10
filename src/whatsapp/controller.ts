import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './Services';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}
  private readonly VERIFY_TOKEN = 'schemax';

  @Post('send-message')
  async sendMessage(
    @Body('to') to: string,
    @Body('templateName') templateName: string,
    @Body('languageCode') languageCode: string,
  ) {
    return this.whatsappService.sendMessage(to, templateName, languageCode);
  }



   @Get('receive')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
  ) {

    console.log(verifyToken);
    console.log(mode);
    console.log(challenge);
    if (mode === 'subscribe' && verifyToken === this.VERIFY_TOKEN) {
      return challenge; // Echo back the challenge
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  } 

  @Post('receive')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    try {
      if (body.object) {
        const entry = body.entry?.[0]?.changes?.[0]?.value;
        const message = entry?.messages?.[0];

        if (message) {
          const from = message.from; // Sender's phone number
          const msgBody = message.text?.body; // Message text body
          const businessPhoneNumberId = entry.metadata?.phone_number_id;

          console.log('Received message from:', from);
          console.log('Message body:', msgBody);
          console.log('Business phone number ID:', businessPhoneNumberId);

          // Prepare a response message
          const responseMessage = 'Message received'; // Customize your response here
          const templateName = 'payment_reminder';
          const languageCode = 'en_US';
          const templateParameters = [
            { type: 'text', text: 12 }, // amount placeholder
            { type: 'text', text: 'mm' }    // name placeholder
          ];
          // Send the response message
          await this.whatsappService.sendPaymentMessage(from,"10","ss");

          //res.sendStatus(HttpStatus.OK); // Acknowledge receipt of the message
        } else {
          //res.sendStatus(HttpStatus.OK); // Acknowledge receipt, even if no message is present
        }
      } else {
        //res.sendStatus(HttpStatus.NOT_FOUND); // Respond with a 404 status if the object field is missing
      }
    } catch (error) {
      console.error('Error processing incoming message:', error);
      //res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR); // Respond with an error status
    }
  }






 
 
}
