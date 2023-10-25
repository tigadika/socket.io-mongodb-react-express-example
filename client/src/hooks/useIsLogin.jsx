import { useState } from "react";

export default function useIsLogin() {
  const getLoginStatus = () => {
    return localStorage.username ? true : false;
  };

  const getUser = () => {
    return localStorage.username ? localStorage : null;
  };

  const [isLogin, setIsLogin] = useState(getLoginStatus());
  const [user, setUser] = useState(getUser());

  const saveLoginStatus = (user) => {
    localStorage.username = user.username;
    localStorage.email = user.email;
    localStorage.imageUrl = user.imageUrl;
    setIsLogin(true);
    setUser(user);
  };

  return {
    isLogin,
    setIsLogin: saveLoginStatus,
    user,
  };
}
