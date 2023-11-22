// lib
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import useIsLogin from "../hooks/useIsLogin";

// comp
import ProfileBanner from "./ProfileBanner";
import MessageList from "./ChatArea/MessageList";
import MessageInput from "./ChatArea/MessageInput";

const socket = io.connect(":3000");
export default function ChatRoom({ roomId, targetProfile }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useIsLogin();
  let timeIn;
  let timeOut;

  const handleSubmit = (input, ref) => {
    const time = new Date()
      .toLocaleString("en-UK", { hour12: false })
      .replace(", ", "T");
    socket.emit(
      "SEND_MSG_TO_ROOM",
      input,
      user.username,
      targetProfile.username,
      time
    );

    // maybe it's not best practice
    // ref.current.innerHTML = "";
  };

  const handleTyping = () => {
    timeIn = setTimeout(() => {
      socket.emit("TYPE_MSG_TO_ROOM");
    }, 200);
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      socket.emit("TYPE_STOP_MSG_TO_ROOM");
    }, 800);
  };

  useEffect(() => {
    if (roomId) {
      socket.emit("JOIN_ROOM_CHAT", roomId);
    }
  }, [roomId, socket]);

  useEffect(() => {
    if (roomId) {
      getRoomById(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    const handleReceivedMessage = (content) => {
      console.log(content, "from server");
      setMessages((prevMessages) => [...prevMessages, content]);
    };

    const handleReceivedTypingStatus = (status) => {
      setIsTyping(status);
    };

    socket.on("SEND_MSG_CLIENT_ROOM", handleReceivedMessage);
    socket.on("SEND_TYPING_CLIENT_ROOM", handleReceivedTypingStatus);
    socket.on("SEND_TYPING_STOP_CLIENT_ROOM", handleReceivedTypingStatus);

    // clean up from previous render
    return () => {
      socket.off("SEND_MSG_CLIENT_ROOM", handleReceivedMessage);
      socket.off("SEND_TYPING_CLIENT_ROOM", handleReceivedTypingStatus);
      socket.off("SEND_TYPING_STOP_CLIENT_ROOM", handleReceivedTypingStatus);
    };
  }, [socket]);

  const getRoomById = async (roomId) => {
    try {
      const { data } = await axios({
        method: "get",
        url: `http://localhost:3000/rooms/${roomId}`,
        headers: {
          username: localStorage.username,
        },
      });
      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!roomId) {
    return (
      <div className="col-span-2 bg-gray-200 border-l border-gray-300 flex justify-center items-center">
        <p className="tracking-tight text-xl italic">
          Click on chat to start chatting..
        </p>
      </div>
    );
  }

  if (roomId) {
    return (
      <div className="col-span-2 bg-gray-300 flex flex-col">
        <div className="bg-gray-100 h-fit py-3 px-4 flex justify-between border-l border-gray-300">
          <ProfileBanner user={targetProfile} />
        </div>
        <div
          id="messageContainer"
          className="flex flex-col h-[50rem] justify-end p-2"
        >
          <MessageList messages={messages} user={user} isTyping={isTyping} />
          <MessageInput onSubmit={handleSubmit} onTyping={handleTyping} />
        </div>
      </div>
    );
  }
}
