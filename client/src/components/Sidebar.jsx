import { useEffect, useState } from "react";
import ChatSelectionProfile from "./ChatSelectionProfile";
import useIsLogin from "../hooks/useIsLogin";
import axios from "axios";
import ProfileBanner from "./ProfileBanner";

export default function Sidebar({ onEnterRoom }) {
  const [isContact, setIsContact] = useState(false);
  const { user } = useIsLogin();
  const [rooms, setRooms] = useState(null);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    if (!rooms) {
      fetchRooms();
    } else if (!contacts) {
      fetchContacts();
    }
  }, [isContact]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios({
        method: "get",
        url: "http://localhost:3000/rooms",
        headers: {
          username: localStorage.username,
        },
      });
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios({
        method: "get",
        url: "http://localhost:3000/contacts",
        headers: {
          username: localStorage.username,
        },
      });
      setContacts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRoom = async (usernameTarget) => {
    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/rooms",
        data: {
          username: usernameTarget,
        },
        headers: {
          username: localStorage.username,
        },
      });
      setIsContact(false);
      fetchRooms();
    } catch (error) {
      console.log(error);
    }
  };

  const enterRoom = async (roomId, targetProfile) => {
    onEnterRoom(roomId, targetProfile);
  };

  return (
    <div className="bg-gray-200 flex flex-col">
      {/* profile */}
      <div className="bg-gray-100 h-fit py-3 px-4 flex justify-between">
        <ProfileBanner user={user} />
        <button
          onClick={() => {
            setIsContact(!isContact);
          }}
          className="px-5 rounded-full text-xl hover:bg-gray-200"
        >
          +
        </button>
      </div>
      {/* chatroom */}
      <div className="flex flex-col gap-2 h-[50rem] overflow-scroll">
        {isContact && (
          <>
            <h3 className="font-semibold p-2">Contacts</h3>
            {contacts?.map((el) => (
              <ChatSelectionProfile
                key={el?._id}
                profile={el}
                isContact={isContact}
                onAddRoom={addRoom}
              />
            ))}
          </>
        )}
        {!isContact && (
          <>
            <h3 className="font-semibold p-2">Chat</h3>
            {rooms?.map((el) => (
              <ChatSelectionProfile
                key={el?._id}
                profile={el?.users.find(
                  (ele) => ele.username !== user.username
                )}
                isContact={isContact}
                roomId={el?._id}
                onEnterRoom={enterRoom}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
