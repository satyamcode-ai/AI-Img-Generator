import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import moment from "moment";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    logoutUser,
    createNewChat,
    axios,
    fetchUsersChats,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;

      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        {
          headers: { Authorization: token },
        }
      );
      if (data.success) {
        await fetchUsersChats(); // ✅ refresh chats only
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/50 border-r border-[#80609F]/50 backdrop-blur-xl transition-all duration-500 max-md:absolute left-0 z-1 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_light : assets.logo_dark}
        alt=""
        className="w-full max-w-43"
      />

      {/* new chat button */}
      <button
        onClick={createNewChat}
        className="flex items-center justify-center w-full mt-10 py-2.5 bg-gradient-to-r from-[#3D81F6] to-[#A456F7] rounded-md font-medium text-sm transition-all duration-300 cursor-pointer text-white hover:from-[#2A6CEB] hover:to-[#8945E5]"
      >
        <span className="mr-2 test-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>{" "}
        New Chat
      </button>

      {/* search conversation */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} alt="" className="w-4 not-dark:invert" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations"
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* recent chats */}
      {chats.length > 0 && <p className="mt-4 text-sm mb-4">Recent Chats</p>}

      <div>
        {chats
          .filter((chat) =>
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              onClick={() => {
                navigate("/");
                setSelectedChat(chat._id); // ✅ store only ID
                setIsMenuOpen(false);
              }}
              key={chat._id}
              className="p-2 px-4 dark:bg-[#51317C]/10 rounded-md cursor-pointer flex text-sm  justify-between group mb-2"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].content.slice(
                        0,
                        32
                      )
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                onClick={(e) =>
                  toast.promise(deleteChat(e, chat._id), {
                    loading: "deleting...",
                  })
                }
                src={assets.bin_icon}
                alt=""
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>

      {/* community images */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-2.5 mt-auto border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img
          src={assets.gallery_icon}
          className="w-4.5 not-dark:invert"
          alt=""
        />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* credit purchase option */}
      <div
        onClick={() => {
          navigate("/credits"), setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-2.5 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="" />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>
        </div>
      </div>
      <p className="text-xs text-center mt-2">
        Purchase credits to use QuickGPT
      </p>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between gap-2 p-2.5 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            readOnly
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Account */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
        <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>
        {user && (
          <img
            src={assets.logout_icon}
            onClick={logoutUser} // ✅ Logout here
            className="h-5 cursor-pointer not-dark:invert hidden group-hover:block"
          />
        )}
      </div>

      {/* Close button on mobile */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        alt=""
      />
    </div>
  );
};

export default Sidebar;
