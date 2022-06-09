import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/auth";
import Register from "../components/register";
import Footer from "../components/footer";
import Home from "../components/home";

export default function home() {
  const [session, setSession] = useState(null);
  const [register, setRegister] = useState(false);
  const [auth, setAuth] = useState(true);

  function showRegister() {
    setRegister(true);
    setAuth(false);
  }

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="">
      {!session ? (
        <div className="max-w-md mx-auto flex flex-col justify-center w-full min-h-screen">
          <div className="flex flex-col justify-center w-full text-center px-20 mt-20">
            <h1 className="text-5xl font-bold mb-5">Plankr</h1>
            <p className="mb-2">
              Your personal planking counter and statics app in one place.
            </p>
            <p>Are you the best planker?</p>
          </div>
          {auth && (
            <>
              <Auth />
              <button
                className="mt-10 text-lg text-white font-semibold bg-green-500 py-3 px-6 rounded-md focus:outline-none focus:ring-2"
                onClick={() => showRegister()}
              >
                Register
              </button>
            </>
          )}
          {register && <Register />}
        </div>
      ) : (
        <div>
          <Home session={session} />
        </div>
      )}
    </div>
  );
}
