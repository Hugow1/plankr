import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../components/footer";
import { formatTime } from "../utils/formatTime";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Stats() {
  const [session, setSession] = useState(null);
  const [oldTime, setOldTime] = useState([]);

  // Get session data
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Get the latest time from the db
  useEffect(() => {
    getTime();
  }, [session]);

  async function getTime() {
    try {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("timeTable")
        .select(`time, updated_at`)
        .eq("uid", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const newData = data.reduce(function (a, b) {
          a[b.updated_at] = (a[b.updated_at] || 0) + b.time;
          return a;
        }, {});
        setOldTime(newData);
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }

  // format value in the oldTime array with formatTime function
  const formattedOldTime = Object.keys(oldTime).map((key) => {
    return {
      date: key,
      time: formatTime(oldTime[key]),
    };
  });

  console.log(formattedOldTime.map((item) => item.time));

  const lineData = {
    labels: formattedOldTime.map((item) => item.date),
    datasets: [
      {
        data: formattedOldTime.map((item) => item.time),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      {!session ? (
        <div className="flex flex-col justify-center w-full max-w-md min-h-screen mx-auto">
          <div className="flex flex-col justify-center w-full px-20 mt-20 text-center">
            <h1 className="mb-5 text-5xl font-bold">Plankr</h1>
            <p className="mb-2">You must login to view this pages. </p>
            <Link href="/">Click here to login</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center w-full max-w-md mx-auto">
            <div className="flex flex-col w-full px-20 mt-20 text-center">
              <h1 className="mb-5 text-5xl font-bold">Plankr</h1>
              <p className="mb-2">Your awesome stats!</p>
            </div>
            <Line data={lineData} width={400} height={400} options={options} />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
