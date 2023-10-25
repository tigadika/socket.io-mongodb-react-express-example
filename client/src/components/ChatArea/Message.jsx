import parse from "html-react-parser";

export default function Message({ message, user }) {
  return (
    <div
      key={message?.time}
      className={`bg-violet-50 px-3 py-2 rounded-lg mb-2 w-fit flex items-end ${
        message?.sender === user.username
          ? "self-end bg-violet-300"
          : "bg-white"
      }`}
    >
      <div className="flex flex-col">{parse(message?.message)}</div>
      <span className="text-xs text-gray-500 ml-3 text-left">
        {message?.time.split("T")[1].split(":").slice(0, 2).join(".")}
      </span>
    </div>
  );
}
