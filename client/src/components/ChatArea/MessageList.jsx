import { useEffect, useRef } from "react";
import TypingIndicator from "./TypingIndicator";
import Message from "./Message";

export default function MessageList({ messages, user, isTyping, roomId }) {
  const scroller = useRef(null);
  useEffect(() => {
    scroller.current.scrollIntoView();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col p-2 overflow-scroll">
      {messages &&
        messages.map((el, i) => <Message message={el} user={user} key={i} />)}
      {isTyping && <TypingIndicator />}
      <div ref={scroller} className="h-[1px]"></div>
    </div>
  );
}
