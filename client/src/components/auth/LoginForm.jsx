import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const LoginForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }

    } catch (error) {

      alert(error.response.data.message);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >

        <h2 className="text-3xl font-bold text-center mb-8">
          Garage CRM Login
        </h2>

        <div className="mb-5">

          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
          />

        </div>

        <div className="mb-6">

          <label className="block text-sm font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
          />

        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default LoginForm;