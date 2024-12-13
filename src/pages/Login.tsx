import React, { useState } from "react";
import useTitle from "../hooks/useTitle";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../utils/API";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MiniLoader from "../components/MiniLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  useTitle({ title: "Login" });
  const router = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showToast = (type: "success" | "error" | "warn", message: string) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setLoading(true);

    try {
      const response = await API.post("auth/login", userData);
      if (response.success) {
        const { accessToken, type } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userDetails", JSON.stringify(response.data));

        router(type === "seller" ? "/seller" : "/shipper");
        showToast("success","Login Successfully")
      } else {
        if (response.error?.code === "ERR_USER_NOT_FOUND") {
          setEmailError("No user found with this email address.");
        } else if (response.error?.code === "ERR_WRONG_PASSWORD") {
          setPasswordError("Incorrect password.");
        } else {
          setEmailError("Invalid email");
        }
        showToast("error", "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Request Error:", err);
      setEmailError("An error occurred, please try again.");
      showToast("warn", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, email: e.target.value });
    if (emailError) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, password: e.target.value });
    if (passwordError) {
      setPasswordError(null);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-96">
          <form onSubmit={handleFormSubmit} className="flex flex-col w-full">
            <h1 className="text-black font-bold text-5xl text-center">
              Sign in
            </h1>
            <p className="mt-10 mb-1 text-black">Email</p>
            <input
              className="rounded-full p-3 bg-black/5 outline-none w-full text-black"
              type="text"
              name="email"
              required
              value={userData.email}
              onChange={handleEmailChange}
            />
            <p className="text-red-500">{emailError}</p>

            <p className="mt-4 mb-1 text-black">Password</p>
            <div className="relative">
              <input
                className="rounded-full p-3 bg-black/5 outline-none w-full text-black"
                type={passwordVisible ? "text" : "password"}
                name="password"
                required
                value={userData.password}
                onChange={handlePasswordChange}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <p className="text-red-500">{passwordError}</p>

            <div className="flex justify-end pt-2">
              <NavLink className="text-blue-800" to="/auth/forgotpassword">
                Forgot Password
              </NavLink>
            </div>

            {loading ? (
              <MiniLoader />
            ) : (
              <button
                type="submit"
                className="rounded-full p-3 px-5 transition text-white bg-black hover:bg-black/80 min-w-[92px] mt-5 duration-300"
              >
                Login
              </button>
            )}

            <div className="mt-10 flex gap-2 text-black">
              <span>Don't have an account?</span>
              <Link
                to="/auth/register"
                className="text-black hover:text-black/80 duration-300"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
