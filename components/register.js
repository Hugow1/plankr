import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "/utils/supabaseClient";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(JSON.stringify(error));
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center">
          Create new account
        </h1>

        <form className="flex flex-col p-6 mt-2" onSubmit={handleSubmit}>
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="mt-6 ">
            Password
          </label>
          <input
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="px-6 py-3 mt-10 text-lg font-semibold text-white bg-green-500 rounded-md focus:outline-none focus:ring-2"
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
