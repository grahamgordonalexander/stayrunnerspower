// components/Chat.tsx
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Input } from "@/components/ui/input"
import {
  EnterIcon
} from "@radix-ui/react-icons"
import { MessagesContext } from "@/context/messages";
import { FC, HTMLAttributes, useContext, useRef } from "react";
import { nanoid } from "nanoid";
import { Message } from "@/validators/message";
import { Button } from "@/components/ui/button"

<<<<<<< HEAD
const socket = io('https://soc.m59media.com');
=======
const socket = io('https://api.m59media.com');
>>>>>>> a8b88b4cfe48527302a586ec0a464186de5a213f

const TestChat: React.FC = () => {
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);

  const [message, setMessage] = useState<string>('');
  // const [messages1, setMessages] = useState<{ sender: string, message: string, bidId: string, userRole: string }[]>([]);
  // const [messages1, setMessages] = useState<string>('');
  const [data, setData] = useState<any>();
  const [disable,  setDisable] = useState<boolean>(false); // [disable]
  const Accepted = "Accepted"
  useEffect(() => {
    socket.on('message', (msg) => {
      console.log(msg);
      // setMessages((prevMessages) => [...prevMessages, msg]);
      // setMessages(msg);

      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: msg,
      };
// console.log("responseMessage",responseMessage);
      // add new message to state
      addMessage(responseMessage);
    });
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("userData");
      setData(data);
      console.log(data);
     
      // data ? JSON.parse(data) : null;
    }
    
    return () => {
      socket.off('message');
    };

  }, []);



  //     setIsMessageUpdating(true);

  const sendMessage = () => {
    if(data !== undefined && data !== null && data !== '') {
      const data1 = JSON.parse(data);
      const bidId = data1.bitId;
      const userRole = data1.userRole;
      // console.log("bidId",bidId);
      // console.log("userRole",userRole);
      if (bidId !== undefined && userRole !== undefined){
        const id = nanoid();
        const responseMessage: Message = {
          id,
          isUserMessage: true,
          text: message,
        };
  // console.log("responseMessage",responseMessage);
        // add new message to state
        addMessage(responseMessage);


        socket.emit('message', { sender: 'User', message, bidId, userRole });
        setMessage('');
      }
      
      // socket.emit('message', { sender: 'User', message, bidId, userRole });
    }
    // if (typeof window !== "undefined") {
    //   const data = localStorage.getItem("userData");
     
      // data ? JSON.parse(data) : null;
    // }
    // socket.emit('message', { sender: 'User', message });
    
  };

  const sendMessageBtn = () => {
    if (data !== undefined && data !== null && data !== ''){
      const data1 = JSON.parse(data)
      const bidId = data1.bitId;
      const userRole = data1.userRole;
      if (bidId !== undefined && userRole !== undefined){
        setDisable(true);
        const id = nanoid();
        const responseMessage: Message = {
          id,
          isUserMessage: true,
          text :Accepted
        }
        addMessage(responseMessage);
// console.log("responseMessagebtn",responseMessage);
socket.emit('message', { sender : 'User', message: Accepted, bidId, userRole});


      }
    }
  }

  return (
    <>
    <div className="px-4 w-[100%] borde-4 mx-auto h-10 rounded-lg bnng-red-800 flex  justify-center items-center">
  {/* <TestChat  /> */}
  <Input
   value={message}
      onChange={(e) => setMessage(e.target.value)}
       placeholder="Write a message..."
       disabled={disable}
  />
  <button onClick={sendMessage} disabled={disable}>
  <EnterIcon style={{ fontSize: '40px' , height: '25px', width: '25px' }}/>
  </button>
  </div>
   <div className=" mt-2 w-[90%] mx-auto  rounded-lg flex  justify-center items-center">

  <Button onClick={sendMessageBtn} disabled={disable} style={{ width: '100%' }}>Click here to Confirm Deal </Button>
  </div>
    </>
  );
};

export default TestChat;
