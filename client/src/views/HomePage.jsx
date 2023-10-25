import { useState } from "react";
import ChatRoom from "../components/ChatRoom";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const [roomId, setRoomId] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);

  const handleChatRoom = (roomId, targetProfile) => {
    setRoomId(roomId);
    setTargetProfile(targetProfile);
  };

  return (
    <div className="h-screen p-10">
      <div className="grid grid-cols-3 h-full">
        <Sidebar onEnterRoom={handleChatRoom} />
        <ChatRoom roomId={roomId} targetProfile={targetProfile} />
      </div>
    </div>
  );
}
