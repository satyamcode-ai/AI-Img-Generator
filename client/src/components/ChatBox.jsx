import React, { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import Message from "./Message.jsx";
import {
  FaMagic,
  FaCity,
  FaUserAstronaut,
  FaDragon,
  FaRocket,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const samplePrompts = [
  { text: "A futuristic cityscape at sunset", icon: <FaCity /> },
  { text: "A cyberpunk astronaut on Mars", icon: <FaUserAstronaut /> },
  { text: "A fantasy castle on floating islands", icon: <FaDragon /> },
  { text: "A steampunk airship in the clouds", icon: <FaRocket /> },
  { text: "A serene forest with glowing plants", icon: <FaMagic /> },
];

const Chatbox = () => {
  const { chats, selectedChat, theme, user, axios, token, setUser, fetchUsersChats } =
    useAppContext();

  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const activeChat = chats.find((c) => c._id === selectedChat);

  const handleSampleClick = (text) => {
    setPrompt(text);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast("Login to send message");
    if (!activeChat) return toast.error("No active chat selected");

    try {
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");

      // Optimistic update (show user message instantly)
      activeChat.messages.push({
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
        isImage: false,
      });

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: activeChat._id, prompt: promptCopy, isPublished },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        // Refresh chats from backend so state is always correct
        await fetchUsersChats();

        // decrease credits
        setUser((prev) => ({
          ...prev,
          credits: prev.credits - (mode === "image" ? 2 : 1),
        }));
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 max-md:mt-14 2xl:pr-30">
      {/* chat messages */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll">
        {(!activeChat || activeChat.messages.length === 0) && !loading && (
          <>
            <p className="text-center text-gray-400 mt-35 text-4xl sm:text-6xl dark:text-white">
              Ask me anything!
            </p>
            <section className="flex-wrap justify-center gap-6 hidden sm:flex px-20 mt-10">
              {samplePrompts.map((promptObj, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(promptObj.text)}
                  className="flex items-center gap-2 text-gray-400 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg hover:bg-white/20"
                >
                  {promptObj.icon}
                  <span>{promptObj.text}</span>
                </button>
              ))}
            </section>
          </>
        )}

        {activeChat?.messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 justify-center my-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-150"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-300"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* input box */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option value="image">Image</option>
          <option value="text">Text</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex1 w-full text-sm outline-none"
          required
        />

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="w-8 cursor-pointer"
          />
        </button>
      </form>

      <p className="text-xs lg:text-sm text-gray-300 text-center">
        Try asking anything about tech, travel, or code.
      </p>
    </div>
  );
};

export default Chatbox;
