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

  const handleCheckIn =
    async () => {
      try {

        setLoading(true);

        await API.post(
          "/api/attendance/check-in",
          {
            userId:
              user.id,
          }
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
      try {

        setLoading(true);

        await API.post(
          "/api/attendance/check-out",
          {
            userId:
              user.id,
          }
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