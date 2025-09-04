import React, { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Chatbox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Login from "./pages/Login";
import Community from "./pages/Community";
import Loading from "./pages/Loading.jsx";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext.jsx";

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden invert dark:invert-0"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          {!user ? (
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : (
            <Route
              path="*"
              element={
                <div className="flex h-screen w-screen">
                  <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <Routes>
                    <Route path="/" element={<Chatbox />} />
                    <Route path="/credits" element={<Credits />} />
                    <Route path="/community" element={<Community />} />
                  </Routes>
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;
