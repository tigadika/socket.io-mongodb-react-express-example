import axios from "axios";
import useIsLogin from "./hooks/useIsLogin";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";

export default function App() {
  const { isLogin, setIsLogin } = useIsLogin();
  const loginHandler = async (input) => {
    try {
      const { data } = await axios({
        method: "post",
        url: "http://localhost:3000/login",
        data: input,
      });
      console.log(data);
      setIsLogin(data.user);
    } catch (error) {
      console.log(error);
    }
  };
  if (!isLogin)
    return (
      <>
        <LoginPage loginHandler={loginHandler} />
      </>
    );
  if (isLogin)
    return (
      <>
        <HomePage />
      </>
    );
}
