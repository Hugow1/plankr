import Footer from "./footer";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { formatTime } from "../utils/formatTime";

export default function Home(session) {
  // all variables are declared here
  const [planking, setPlanking] = useState(false);
  const [oldTime, setOldTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);
  const [userID, setUserID] = useState(null);

  // Get the latest time from the db
  useEffect(() => {
    getTime();
  }, [session]);

  async function getTime() {
    try {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("timeTable")
        .select(`time`)
        .eq("uid", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setOldTime(data[data.length - 1].time);
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }

  // Update the time in the db

  async function updateTime({ timer }) {
    try {
      const user = supabase.auth.user();

      const updates = {
        uid: user.id,
        time: timer,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("timeTable").insert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }

  // Timer construction
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 10);
    }, 10);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
    updateTime({ timer });
  };

  return (
    <>
      {!planking ? (
        <div className="flex flex-col items-center w-full max-w-md px-20 mx-auto mt-20">
          <h1 className="mb-5 text-5xl font-bold text-center">Lets Plank!</h1>
          <p className="mb-2 text-center">
            Plank using this app. The goal is to improve your own plank time bit
            by bit.
          </p>
          <p className="text-center">
            Every new plank session can be a bit longer than the previous.
          </p>
          <div className="flex flex-col items-center mt-10">
            <span className="text-3xl font-semibold">Previous time:</span>
            <span className="text-2xl">{formatTime(oldTime)}</span>
            <button
              onClick={() => setPlanking(true)}
              className="px-8 py-3 mt-5 text-xl text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Beat it!
            </button>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md px-20 mx-auto mt-20">
          <h1 className="mb-5 text-5xl font-bold text-center">Lets Plank!</h1>
          <div className="flex flex-col items-center mt-10">
            <span className="text-3xl font-semibold">Previous time:</span>
            <span className="text-2xl">{formatTime(oldTime)}</span>
          </div>
          <span className="text-5xl mt-28">{formatTime(timer)}</span>
          {!isActive ? (
            <button
              onClick={() => handleStart()}
              className="px-8 py-3 mt-5 text-xl text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Start!
            </button>
          ) : (
            <button
              onClick={() => handlePause()}
              className="px-8 py-3 mt-5 text-xl text-white bg-red-500 rounded-md hover:bg-blue-700"
            >
              Stop
            </button>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}
