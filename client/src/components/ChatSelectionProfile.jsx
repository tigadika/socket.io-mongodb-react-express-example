export default function ChatSelectionProfile({
  profile,
  isContact,
  onAddRoom,
  onEnterRoom,
  roomId,
}) {
  const handleOnClick = () => {
    if (!isContact) {
      onEnterRoom(roomId, profile);
    } else {
      onAddRoom(profile.username);
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className="flex gap-2 items-center p-2 hover:bg-gray-300 hover:cursor-pointer"
    >
      <img
        src={profile.imageUrl}
        alt=""
        className="w-[50px] h-[50px] object-cover rounded-full shadow-sm"
      />
      <div>{profile.username}</div>
    </div>
  );
}
