export default function TypingIndicator() {
  return (
    <div className="bg-white w-fit px-3 py-4 rounded-lg flex gap-1">
      <div className="bg-violet-300 p-1 w-2 h-2 rounded-full animate-bounce bullet-one"></div>
      <div className="bg-violet-300 p-1 w-2 h-2 rounded-full animate-bounce bullet-two"></div>
      <div className="bg-violet-300 p-1 w-2 h-2 rounded-full animate-bounce bullet-three"></div>
    </div>
  );
}
