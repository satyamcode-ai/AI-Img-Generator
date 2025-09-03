import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets.js";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // fetch user (dummy for now)
  const fetchUser = useCallback(async () => {
    try {
      setUser(dummyUserData);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, []);

  // fetch chats (dummy for now)
  const fetchUsersChats = useCallback(async () => {
    try {
      setChats(dummyChats);
      if (dummyChats.length > 0) setSelectedChat(dummyChats[0]);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  }, []);

  // toggle theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // when user changes -> fetch chats
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, fetchUsersChats]);

  // fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    backendUrl,
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
