import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { link } from 'fs';
import { text } from 'stream/consumers';

@Injectable()
export class WhatsappService {
  private readonly apiVersion = 'v20.0';
  private readonly phoneNumberId = '395027383692372'; // Replace with your Phone-Number-ID
  private readonly accessToken = 'EAASha2uGnYgBOy142B3w6WWSI3WUwf8Ok7bZCL0uJ7KjpfTeJrnAXe24yb4UOwU7ZCOnTm15LpmsjbXlqkXLZBGtOcZC7svlPcZBWS7cJCW1P4tlaHjXxqZAndgxWoIMkBhsyXViWxu3tnUKMRxzkq6XZAzboErwI60mshi1xtkIeXMZADIZB9WHN3AGZBu9dNLiMuZA3LRmh7KVkr1SvkJXFgZD'; // Replace with your token
  httpService: any;

  //import axios from 'axios';

async sendMessage(to: string, templateName: string, languageCode: string) {
  const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',  // Change the type to 'template'
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error sending message: ${error.response?.data?.error?.message || error.message}`);
  }
}



async sendPaymentMessage(to: string, paymentAmount: string, customerName: string) {
  console.log("inside the service");

  const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  const vpa = 'vpa';
  const transactionId = '23332234';

  const upiLink = this.generateUpiLink(vpa, customerName, paymentAmount, 'INR', transactionId);

  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'payment', // Ensure this matches the template name configured in your WhatsApp account
      language: {
        code: 'en_US',
      },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'text',
              text: `Payment of $${paymentAmount}`,
            },
          ],
        },
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: customerName,
            },
            {
              type: 'text',
              text: `$${paymentAmount}`,
            },
          ],
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            {
              type: 'text',
              text: upiLink, // Pass the UPI link directly as text
            }
          ]
        }
      ],
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error sending message: ${error.response?.data?.error?.message || error.message}`);
  }
}






generateUpiLink(vpa: string, name: string, amount: string, currency: string, transactionId: string): string {
  const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}&tid=${encodeURIComponent(transactionId)}`;
  return upiLink;
}


}
