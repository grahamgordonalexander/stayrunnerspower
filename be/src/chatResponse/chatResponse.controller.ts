import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatResponseService } from './chatResponse.service';
// import fetch from 'node-fetch';
// import { CreateChatDto } from './dtos/chatResponse.dto';


@Controller('chatResponse')
export class WebhookController {
  constructor(private readonly chatResponseService: ChatResponseService) {}

//   @Post('post-data-customer')
//   async postData(@Body() body: any) {
//      console.log('Received data:', body);
//     const input = body.message;
//     //console.log("input",input)

//     try {
//       const response = await fetch(
//         // `https://dialogflow.googleapis.com/v2/projects/lmbtest-9vbo/agent/sessions/${sessionId}:detectIntent`,
//         "https://console.dialogflow.com/v1/integrations/messenger/webhook/17bdb646-a3c1-46e8-9330-ba834c540806/sessions/webdemo-e696a4cc-e66b-495c-9d34-720e8e49b151?platform=webdemo",
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             // Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Replace with your Dialogflow service account access token
//           },
//           body: JSON.stringify({
//             queryInput: {
//               text: {
//                 text: input,
//                 languageCode: 'en',
//               },
//             },
//           }),
//         }
//       );
//   // console.log("response", response);
  
//   let responseData1;
//   const responseData = await response.text();
//   if (responseData.startsWith(')]}\'')) {
//     responseData1 = responseData.substring(')]}\'' .length); // Remove the prefix
//   }

//   const data = JSON.parse(responseData1);
//    console.log("Data",data);

//   if(data.webhookStatus !== undefined){
//     console.log("webhook<===>",data.webhookStatus);
// return "Please wait for the localhost's response.."
//     //save_db()
//   }
//   else{
//     const res = data.queryResult.fulfillmentText;
//     return res;
//   }

//     } catch (error) {
//       console.error('Error handling webhook:', error);
//       throw error;
//     }

//   }


//   @Post('post-data-localhost')
//   async postData1(@Body() body: any) {
//      console.log('Received data:', body);
//     const input = body.message;
//     //console.log("input",input)

//     try {
//       const response = await fetch(
//         // `https://dialogflow.googleapis.com/v2/projects/lmbtest-9vbo/agent/sessions/${sessionId}:detectIntent`,
//         "https://console.dialogflow.com/v1/integrations/messenger/webhook/17bdb646-a3c1-46e8-9330-ba834c540806/sessions/webdemo-e696a4cc-e66b-495c-9d34-720e8e49b151?platform=webdemo",
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             // Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Replace with your Dialogflow service account access token
//           },
//           body: JSON.stringify({
//             queryInput: {
//               text: {
//                 text: input,
//                 languageCode: 'en',
//               },
//             },
//           }),
//         }
//       );
//   // console.log("response", response);
//   let responseData1;
//   const responseData = await response.text();
//   if (responseData.startsWith(')]}\'')) {
//     responseData1 = responseData.substring(')]}\'' .length); // Remove the prefix
//   }

//   const data = JSON.parse(responseData1);
//    console.log("Data",data);

//   if(data.webhookStatus !== undefined){
//     console.log("webhook<===>",data.webhookStatus);
// return "Please wait for the customer's response.."
//     //save_db()
//   }
//   else{
//     const res = data.queryResult.fulfillmentText;
//     return res;
//   }

//     } catch (error) {
//       console.error('Error handling webhook:', error);
//       throw error;
//     }

//   }



  @Post()
  handleWebhook(@Body() requestBody: any): any {
    // Parse request body
    const intent = requestBody.queryResult.intent.displayName;
    const parameters = requestBody.queryResult.parameters;
    // const output_contexts = requestBody.outputContexts;

    if (intent === 'customer.price') {
      const price = parameters.number;
      console.log(price);

      // const response = {
     
      //   fulfillmentText: `I can paying $${price}. Would you be willing to accept this price?`,
      // };

      //   const response = {
      //     fulfillmentText: 'I am offering $60. Would you be willing to accept this price?'

      //   };

      return null;
    }
     else if (intent === 'localhost.price') {

      // const response = {
      //   fulfillmentText: 'I can paying $45. Would you be willing to accept this price?'
      // };

      return null;
    }
  }
}
