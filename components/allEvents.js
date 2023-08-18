import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = Cookies.get("_id");
  let Allset = false;
  if (userId !== undefined) {
    Allset = true;
  }
  // console.log("UserId: ", userId);
  useEffect(() => {
    fetch("/api/auth/fetchevents")
      .then((response) => response.json())
      .then((data) => {
        const events_data = data.documents.reverse();
        setEvents(events_data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error while fetching user data:", error);
        setLoading(false);
      });
  }, []);
  const checkregister = (eventregistered) => {
    for (let i = 0; i < eventregistered.length; i++) {
      for (let j = 0; j < eventregistered[i].length; j++) {
        const objid = eventregistered[i][j];
        if (objid["$id"] === userId) {
          return true;
        }
      }
    }
    return false;
  };
  const handleRegister = async (event) => {
    try {
      const response = await fetch(`/api/auth/register?eventId=${event._id}&userId=${userId}`);
      if (response.ok) {
        window.location.reload();
        // console.log("Registered for event:", eventId);
      } else {
        console.log("Registration failed for event:", event.name);
        console.log("Response from server failed", response.data);
      }
    } catch (error) {
      console.error("Error while registering:", error);
    }
  };
  return (
    <main className="container p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <h1 className="text-2xl font-semibold text-gray-600">Loading... Please Wait</h1>
        ) : (
          events.map((event) => (
            <div key={event._id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition">
              <h2 className="text-xl font-semibold mb-2">{event.title || "Not Mentioned"}</h2>
              <p className="text-gray-600">{event.date || "Not Mentioned"}</p>
              <p className="mt-2">{event.desc || "Not Mentioned"}</p>
              <p className="mt-2">
                <strong>Location:</strong> {event.location?.type || "Not Mentioned"}
              </p>
              <p className="mt-2">
                <strong>Deadline:</strong> {event.deadline || "Not Mentioned"}
              </p>
              <p className="mt-2">
                <strong>Date:</strong> {event.date || "Not Mentioned"}
              </p>
              <p className="mt-2">
                <strong>Time:</strong> {event.time || "Not Mentioned"}
              </p>
              {session && (
                <button
                  className={`mt-4 px-4 py-2 rounded-md hover:bg-blue-600 ${
                    checkregister(event.registered)
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => {
                    if (confirm('Do you want to confirm Registration for the event  "' + event.title + `"`)) {
                      handleRegister(event);
                    } else {
                      console.log("Registration cancelled");
                    }
                  }}
                  disabled={checkregister(event.registered)}
                >
                  {checkregister(event.registered) ? "Registered" : "Register"}
                </button>
              )}
              {!Allset && !session && <div className="text-red-600">Login and fill data in setting to Register</div>}
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default AllEvents;
