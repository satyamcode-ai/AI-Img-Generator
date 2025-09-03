import React, { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Chatbox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Login from "./pages/Login";
import Community from "./pages/Community";
import Loading from "./pages/Loading.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { assets } from "./assets/assets";
import './assets/prism.css'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation();

  if(pathname === '/loading'){
    return <Loading/>
  }

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>

          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
      </div>
    </>
  );
};

export default App;
