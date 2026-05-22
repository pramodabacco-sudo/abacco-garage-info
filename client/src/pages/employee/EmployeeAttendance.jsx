import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

const EmployeeAttendance = () => {

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [loading, setLoading] =
    useState(false);

  const [isCheckedIn, setIsCheckedIn] =
    useState(false);

  const [watchId, setWatchId] =
    useState(null);

  const fetchStatus =
    async () => {
      try {

        const response =
          await API.get(
            "/api/attendance"
          );

        const active =
          response.data.find(
            (item) =>
              item.userId ===
                user.id &&
              item.status ===
                "CHECKED_IN"
          );

        if (active) {

          setIsCheckedIn(true);

        } else {

          setIsCheckedIn(false);
        }

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {
    fetchStatus();
  }, []);

  const startTracking =
    async (
      attendanceId
    ) => {

      if (
        !navigator.geolocation
      ) {

        alert(
          "Geolocation not supported"
        );

        return;
      }

      // const id =
      //   navigator.geolocation.watchPosition(

      //     async (
      //       position
      //     ) => {

      //       try {

      //         await API.post(
      //           "/api/location/save",
      //           {
      //             userId:
      //               user.id,

      //             attendanceId,

      //             latitude:
      //               position.coords.latitude,

      //             longitude:
      //               position.coords.longitude,
      //           }
      //         );

      //         console.log(
      //           "Location Saved"
      //         );

      //       } catch (error) {

      //         console.log(error);
      //       }
      //     },

      //     (error) => {

      //       console.log(error);
      //     },

      //     {
      //       enableHighAccuracy:
      //         true,

      //       maximumAge: 0,

      //       timeout: 10000,
      //     }
      //   );
    let lastSavedTime = 0;

    const id =
      navigator.geolocation.watchPosition(

        async (
          position
        ) => {

          const now =
            Date.now();

          // save only every 1 minute
          if (
            now -
              lastSavedTime <
            60000
          ) {
            return;
          }

          lastSavedTime =
            now;

          try {

            await API.post(
              "/api/location/save",
              {
                userId:
                  user.id,

                attendanceId,

                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude,
              }
            );

            console.log(
              "Location Saved"
            );

          } catch (error) {

            console.log(error);
          }
        },

        (error) => {

          console.log(error);
        },

        {
          enableHighAccuracy:
            true,

          maximumAge: 30000,

          timeout: 10000,
        }
      );
      setWatchId(id);
    };

  const stopTracking =
    () => {

      if (watchId) {

        navigator.geolocation.clearWatch(
          watchId
        );

        setWatchId(null);

        console.log(
          "Tracking Stopped"
        );
      }
    };

  const handleCheckIn =
    async () => {

      const confirmStart =
        window.confirm(
          "Are you sure you want to start working? Your live location tracking will begin."
        );

      if (!confirmStart)
        return;

      try {

        setLoading(true);

        const response =
          await API.post(
            "/api/attendance/check-in",
            {
              userId:
                user.id,
            }
          );

        const attendanceId =
          response.data
            .attendanceId;

        await startTracking(
          attendanceId
        );

        await fetchStatus();

      } catch (error) {

        alert(
          error.response?.data
            ?.message
        );

      } finally {

        setLoading(false);
      }
    };

 const handleCheckOut =
  async () => {

    const confirmStop =
      window.confirm(
        "Are you sure you want to check out? Your live location tracking will stop."
      );

    if (!confirmStop)
      return;

    try {

      setLoading(true);

      await API.post(
        "/api/attendance/check-out",
        {
          userId:
            user.id,
        }
      );

      stopTracking();

      await fetchStatus();

    } catch (error) {

      alert(
        error.response?.data
          ?.message
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-10">

      <div className="max-w-xl mx-auto bg-white border border-neutral-200 p-6 md:p-10">

        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
          — WORK STATUS —
        </p>

        <h1 className="text-3xl font-light text-neutral-900 mb-3">
          Employee Attendance
        </h1>

        <p className="text-sm text-neutral-500 mb-10">
          Start and end your work session.
        </p>

        <div className="flex flex-col items-center justify-center">

          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center text-white text-lg font-semibold mb-8 ${
              isCheckedIn
                ? "bg-green-500"
                : "bg-neutral-400"
            }`}
          >
            {isCheckedIn
              ? "WORKING"
              : "OFFLINE"}
          </div>

          {!isCheckedIn ? (

            <button
              onClick={
                handleCheckIn
              }
              disabled={loading}
              className="w-full bg-black text-white py-3 hover:bg-neutral-800 transition-all"
            >
              {loading
                ? "Starting..."
                : "Start Working"}
            </button>

          ) : (

            <button
              onClick={
                handleCheckOut
              }
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 hover:bg-red-600 transition-all"
            >
              {loading
                ? "Ending..."
                : "Check Out"}
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default EmployeeAttendance;