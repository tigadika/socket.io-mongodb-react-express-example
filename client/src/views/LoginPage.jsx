import { useState } from "react";

export default function LoginPage({ loginHandler }) {
  const [form, setForm] = useState({
    username: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    loginHandler(form);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 bg-white rounded-lg shadow-md border w-1/3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h2 className="text-center font-semibold text-xl">Login</h2>
            <input
              name="username"
              type="text"
              className="w-full px-2 py-3 rounded-lg border"
              placeholder="username"
              onChange={handleChange}
            />
            <button className="w-full rounded-lg bg-violet-500 text-white py-3 hover:bg-violet-600 active:bg-violet-700">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
