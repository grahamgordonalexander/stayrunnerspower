// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import Groq from 'groq-sdk';

const myArray: any[] = [];
function findObject(bitId, userRole) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].bitId === bitId && myArray[i].userRole === userRole) {
      return myArray[i];
    }
  }
  return null; // Return null if object is not found
}
function findotherObject(bitId, userRole) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].bitId === bitId && myArray[i].userRole !== userRole) {
      return myArray[i];
    }
  }
  return null;
}
const groq = new Groq({
  // apiKey: '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',
  apiKey: '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',
});

function removeSocketById(myArray, socketIdToRemove) {
  // Find the object with the given socketIdToRemove
  const indexToRemove = myArray.findIndex(
    (obj) => obj.socketId === socketIdToRemove,
  );
  if (indexToRemove !== -1) {
    const bitIdToRemove = myArray[indexToRemove].bitId;
    const userRoleToRemove = myArray[indexToRemove].userRole;
    const socketIdRomove = myArray[indexToRemove].socketId;

    // Remove the object from the array
    myArray.splice(indexToRemove, 1);
    console.log(`Deleted object with socketId ${socketIdRomove} `);
    return { bitIdToRemove, userRoleToRemove, socketIdRomove }; // Return the bitId of the removed object
  } else {
    return null; // Return null if socketIdToRemove is not found in any object
  }
}

const MESSAGES = [
  {
    role: 'system',
    content: `You are the HOTEL BOOKING AGENT and your name is "LMB Bot". 
    You job is to act as a middle man between CUSTOMER and HOTEL OWNER. 
    DO NOT TELL THE CUSTOMER OR OWNER THAT YOU ARE MIDDLE MAN. 
    You will recieve both Customer [customer] and Hotel Owner [owner] messages. 
    You have to take the CUSTOEMR massages, parse it for OWNER and vice versa. 
    Make sure both can not share the personal communication information like phone number or email address. 
    If the message is from customer it is starts with [customer] and if the message is from owner it is starts with [owner]. 
    If the messages should be send to Owner, start the message with [owner].
    If the messages should be send to Customer, start the message with [customer].
    You must follow the same format for both. 
    If you are unable to understand the message then just reply with "I don't understand".
    If you are unable to answer the question then just reply with "I can't help you with that".
    make sure that conversation is not too long.
    Make sure the reply is short and concise unless it is necessary to answer the question.
    Do not reply anything except the short to the point reply.
    Do not reply to both [customer] and [owner] except Deal completed message.
    NO NOTES ARE REQUIRED.
    NO SUGGESTIONS ARE REQUIRED.
    DO NOT ADD EXTRA INFORMATION.
    MAKE SURE THE REPLY IS SHORT AND CONCISE.
    Do not reply of the topic.
    If the Accepted message is from Owner you send confirmation message and ask to please confirm this Deal to customer and when the customer confirm
    the deal then, send completed message to both [owner] & [customer] in this format , and vice versa.


    
   
    `,
    //    make sure that if you send completed message in first line you send receiver side and then sender side.
    // make sure that after order is completed, make shure that [customer] will not send message to [owner], you just reply to [customer] "We Apologize, this Order is already completed and repeat this message again".
    // make sure that after order is completed, make shure that [Owner] will not send message to [customer], you just reply to [owner] "We Apologize, this Order is already completed and repeat this message again".
    // If the message is not relevant to the topic from customer or owner then just reply with "I don't understand" and make sure that the reply only 1 sentence and not add extra informations.
  },
  // send the order info to both customer and owner
  // {"role": "user", "content": `
  // Customer want to book the room for 2024-02-15 to 2024-02-17 for a single person with 1 bed and willing to pay 150$.

  //   [owner] Price is lower. I would like to give the room for 200$`},
  // {"role": "assistant", "content": "[customer] Room is available for 200$. Would you like to book it?"},
  // {"role": "user", "content": "What's the score of the Warriors game?"}
];

const addUserMessage = (new_message, messages_history, role = 'user') => { 
  messages_history.push({
    role: role,
    content: new_message,
  });
  return messages_history;
};

const getGroqChatCompletion = async (messages) => {
  // console.log('function called');
  return groq.chat.completions.create({
    messages: messages,
    // model: "mixtral-8x7b-32768",
    model: 'llama3-70b-8192',
  });
};

@WebSocketGateway(5000, {

 cors: true 

 })

export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: {
      sender: string;
      message: string;
      bidId: string;
      userRole: string;
    },
  ): void {
    console.log('socketId==>', client.id, 'payload==>', payload);
    // this.server.emit('message', payload);
    // client.emit('message', payload);
    let ROOM;
    if (payload.userRole === 'localhost') {
      payload.userRole = 'owner';
    }
    // console.log("payload",payload);
    const MESSAGETEXT = `[${payload.userRole}] ${payload.message}`;
    console.log('MESSAGETEXT', MESSAGETEXT);
    // console.log(myArray)
    const foundObject = findObject(payload.bidId, payload.userRole);

    if (!foundObject) {
      const user = {
        bitId: payload.bidId,
        userRole: payload.userRole,
        socketId: client.id,
      };
      myArray.push(user);
      console.log(myArray);
    } else {
      console.log(`${payload.userRole} socketID already exists:`);
    }

    const receiverobject = findotherObject(payload.bidId, payload.userRole);
    console.log('Receiverobject', receiverobject);
    if (receiverobject === null) {
      if (payload.userRole === 'owner') {
        console.log('in the owner');

        client.emit('message', 'Please wait for Customer to join...');
      } else {
        // console.log("in the customer",payload);
        // const message = "Please wait for localhost to join..."
        // client.emit('message', message);
        client.emit('message', 'Please wait for localhost to join...');
        //  client.emit('message', payload);
      }
    } else {
      ROOM = receiverobject.socketId;
      console.log('ROOM', ROOM);

      const callPostData = async (msg, ROOM) => {
        try {
        // console.log("Received data:", msg);
        const input = msg;

        let messages = addUserMessage(input, MESSAGES);
        // console.log("messages--->", messages);
        const chatCompletion = await getGroqChatCompletion(messages);
        // Print the completion returned by the LLM.
        const ai_reply = chatCompletion.choices[0]?.message?.content || '';

        messages = addUserMessage(ai_reply, messages, 'assistant');
        console.log('messages Histroy---->', messages);
        const lastobj = messages[messages.length - 1];

        // Print lastobj to console
        // console.log("lastobj", lastobj);

        const startIdx = lastobj.content.indexOf('['); // find the index of '['
        const endIdx = lastobj.content.indexOf(']'); // find the index of ']'

        if (startIdx !== -1 && endIdx !== -1) {
          const msgRoutePath = lastobj.content.substring(startIdx, endIdx + 1); // extract substring including '[' and ']'
          const AIMessageRoute = msgRoutePath.slice(1, -1);
          console.log('AIMessageRoute----->>', AIMessageRoute); // prints [customer]
          let AIMessage = lastobj.content.substring(endIdx + 1).trim();
          console.log('AIMessage----->>', AIMessage);

          // double route messages
          const  doubleMsgIdx = AIMessage.indexOf('[');
          const doubleMsgEndIdx = AIMessage.indexOf(']');

         

          if (doubleMsgIdx !== -1 && doubleMsgEndIdx !== -1) {
            const doubleMsgRoutePath = AIMessage.substring(doubleMsgIdx, doubleMsgEndIdx + 1);
            const doubleAIMessageRoute = doubleMsgRoutePath.slice(1, -1);
            console.log('doubleAIMessageRoute----->>', doubleAIMessageRoute); // prints [customer]
            const doubleAIMessage = AIMessage.substring(doubleMsgEndIdx + 1).trim();
            console.log('doubleAIMessage----->>', doubleAIMessage);

            // client.emit('message',doubleAIMessage);
           //extract first Al message
           const AIMessage1 = AIMessage.substring(0, doubleMsgIdx).trim();
           console.log('AIMessage1----->>', AIMessage1);
           AIMessage = AIMessage1;

    setTimeout(() => {
  client.emit('message',doubleAIMessage);
    }, 3000);

          }



          const receiverobj = findotherObject(payload.bidId, payload.userRole);
          const receiverRoute = receiverobj.userRole;

          if (receiverRoute === AIMessageRoute) {
            console.log('Same Route');
            client.to(ROOM).emit('message', AIMessage);
            client.emit('message', 'Please wait for response..');
          } else {
            console.log('Different Route');
            client.emit('message', 'I dont know what to say');
          }
        } else {
          console.log('msg Route Path not found.');
          // socket.emit("receive-message", "I dont understand what to say");
          client.emit('message', lastobj.content);
        }
      } catch (error) {
          // Handle the error here
    console.error('Error occurred:', error.message);
    return { error: 'Service Unavailable' };
      }
      };
      const msg = MESSAGETEXT;
      callPostData(msg, ROOM);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const socketIdToRemove = client.id;
    if (myArray !== null && myArray.length > 0) {
      const RomiveBitID = removeSocketById(myArray, socketIdToRemove);
      if (RomiveBitID !== null) {
        console.log('RomiveBitID', RomiveBitID);
        const bitIDD = RomiveBitID.bitIdToRemove;
        const userRolee = RomiveBitID.userRoleToRemove;
        console.log('bitIDD', bitIDD);
        console.log('userRolee', userRolee);
        const otherUser = findotherObject(bitIDD, userRolee);

        if (otherUser !== null) {
          console.log('otherUser', otherUser);
          const otherUserSocketId = otherUser.socketId;
          console.log('other user socketId', otherUserSocketId);
          if (otherUser.userRole === 'customer') {
            client
              .to(otherUserSocketId)
              .emit('message', 'Localhost disconnected');
          } else if (otherUser.userRole === 'owner') {
            client
              .to(otherUserSocketId)
              .emit('message', 'Customer disconnected');
          }
        }
      }
    }
  }

 
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
