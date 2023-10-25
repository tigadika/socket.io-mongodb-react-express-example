import { useRef } from "react";

export default function MessageInput({ onSubmit, onTyping }) {
  const messageRef = useRef(null);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.code === "Enter") {
      onSubmit(e, getMessageContent(), messageRef);
    }
    if (!e.metaKey && !e.ctrlKey) {
      onTyping();
    }
  };

  const getMessageContent = () => {
    const messageContent = messageRef.current.textContent;
    return messageContent.trim();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-between py-2 gap-3">
        <div
          contentEditable="true"
          className="w-full bg-white px-2 py-3 rounded-lg"
          ref={messageRef}
          onKeyDown={handleKeyDown}
        ></div>
        <button className="px-2 py-3 h-fit bg-violet-400 text-white rounded-lg hover-bg-violet-600 active-bg-violet-700">
          Send
        </button>
      </div>
    </form>
  );
}
