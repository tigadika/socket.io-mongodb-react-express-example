import React from "react";

export default function ProfileBanner({ user }) {
  return (
    <div className="flex gap-2 items-center">
      <img
        src={user.imageUrl}
        alt=""
        className="w-[50px] h-[50px] object-cover rounded-full shadow-sm"
      />
      <div>{user.username}</div>
    </div>
  );
}
