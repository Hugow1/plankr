import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/auth";
import Register from "../components/register";
import Footer from "../components/footer";
import Home from "../components/home";

export default function Index() {
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
        <div className="flex flex-col justify-center w-full max-w-md min-h-screen mx-auto">
          <div className="flex flex-col justify-center w-full px-20 mt-20 text-center">
            <h1 className="mb-5 text-5xl font-bold">Plankr</h1>
            <p className="mb-2">
              Your personal planking counter and statics app in one place.
            </p>
            <p>Are you the best planker?</p>
          </div>
          {auth && (
            <>
              <Auth />
              <button
                className="px-6 py-3 mt-10 text-lg font-semibold text-white bg-green-500 rounded-md focus:outline-none focus:ring-2"
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
