import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import toast from "react-hot-toast";

const LoginPage = () => {
  const { axios, fetchUser, navigate, setToken } = useAppContext();

  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await axios.post("/api/auth/login", {
      email: loginEmail,
      password: loginPassword,
    });

    if (data.success) {
      // Save token
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message || "Login successful");

      // Now fetch user with token set
      await fetchUser();
      navigate("/");
    } else {
      toast.error(data.message || "Login failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      if (data.success) {
        // Save token
        localStorage.setItem("token", data.token);
        setToken(data.token);

        toast.success(data.message || "Signup successful");
        await fetchUser();
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#650965] to-[#15156b] p-4 font-sans">
      <div className="flex flex-col lg:flex-row w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 flex items-center justify-center p-5 lg:p-10 bg-gradient-to-br from-[#10109b] to-[#bb0dbb] text-white relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
          {/* Background shapes */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-20"
              width="350"
              height="350"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="100" fill="currentColor" />
            </svg>
            <svg
              className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
              width="450"
              height="450"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="100" fill="currentColor" />
            </svg>
          </div>
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold mb-3">
              Welcome to QuickGPT!
            </h1>
            <p className="text-sm opacity-80 max-w-sm mx-auto lg:mx-0">
              You’re just one step away from unlocking the power of imagination,
              With our AI Image Generator.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 p-5 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Create. Explore. Inspire.
          </h2>

          <br />

          <p className="text-gray-600 text-sm">
            🎯 Customize styles and details with ease.
          </p>

          <br />

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-10">
              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  PASSWORD
                </label>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showLoginPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.06 13.91l5.47 5.47a2 2 0 0 0 2.83 0L21.91 8.06M10.16 2.06L5.47 6.74a2 2 0 0 0-2.83 0L1.06 8.06M21.94 13.94l-5.47-5.47a2 2 0 0 0-2.83 0L2.06 13.94"></path>
                      <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-colors shadow-md text-sm"
              >
                LOGIN
              </button>
              <p className="text-center text-gray-500 text-xs">
                Don't have an account?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  PASSWORD
                </label>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showSignupPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.06 13.91l5.47 5.47a2 2 0 0 0 2.83 0L21.91 8.06M10.16 2.06L5.47 6.74a2 2 0 0 0-2.83 0L1.06 8.06M21.94 13.94l-5.47-5.47a2 2 0 0 0-2.83 0L2.06 13.94"></path>
                      <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-colors shadow-md text-sm"
              >
                SIGN UP
              </button>
              <p className="text-center text-gray-500 text-xs">
                Already have an account?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
