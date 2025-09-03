import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// ✅ Automatically attach token on each request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // ✅ will store only chatId
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Keep token in sync with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ✅ Fetch user
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/data");
      if (data.success) {
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setUser(null);
      setToken(null); // clear token if invalid/expired
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // ✅ Logout user
  const logoutUser = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken(null);
      toast.success("Logged out successfully");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Create new chat
  const createNewChat = useCallback(async () => {
    try {
      if (!user) return toast("Login to create a new chat");

      navigate("/");
      const { data } = await axios.post("/api/chat/create");
      if (data.success) {
        await fetchUsersChats();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [user, navigate]);

  // ✅ Fetch user chats
  const fetchUsersChats = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/chat/get");

      if (data.success) {
        setChats(data.chats);

        if (data.chats.length === 0 && !selectedChat) {
          await createNewChat();
        } else if (data.chats.length > 0 && !selectedChat) {
          setSelectedChat(data.chats[0]._id); // ✅ always store ID only
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [createNewChat, selectedChat]);

  // ✅ Theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Fetch chats when user changes
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, fetchUsersChats]);

  // ✅ Fetch user on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token, fetchUser]);

  const value = {
    createNewChat,
    fetchUsersChats,
    loadingUser,
    token,
    setToken,
    axios,
    navigate,
    user,
    setUser,
    fetchUser,
    logoutUser,
    chats,
    setChats,
    selectedChat,       // ✅ always an ID
    setSelectedChat,    // ✅ should only be called with chatId
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
