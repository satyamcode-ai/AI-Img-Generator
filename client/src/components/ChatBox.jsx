import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/Appcontext.jsx";
import { assets } from "../assets/assets.js";
import Message from "./Message.jsx";
import { FaMagic, FaCity, FaUserAstronaut, FaDragon, FaRocket } from "react-icons/fa";

const samplePrompts = [
  { text: "A futuristic cityscape at sunset", icon: <FaCity /> },
  { text: "A cyberpunk astronaut on Mars", icon: <FaUserAstronaut /> },
  { text: "A fantasy castle on floating islands", icon: <FaDragon /> },
  { text: "A steampunk airship in the clouds", icon: <FaRocket /> },
  { text: "A serene forest with glowing plants", icon: <FaMagic /> },
];

const Chatbox = () => {
  const { selectedChat, theme } = useAppContext();

  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(""); // ✅ single state for input
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  // handle sample button click
  const handleSampleClick = (text) => {
    setPrompt(text); // ✅ directly update input state
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Here you can handle sending prompt (API call etc.)
    setLoading(true);

    // fake response push (example)
    const newMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, newMessage]);

    setPrompt(""); // clear input after submit
    setLoading(false);
  };

  // sync messages with selected chat
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  // auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 max-md:mt-14 2xl:pr-30">
      {/* chat messages */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll">
        {messages.length === 0 && (
          <div>
            <p className="text-center text-gray-400 mt-35 text-4xl sm:text-6xl dark:text-white">
              Ask me anything!
            </p>
          </div>
        )}

        {messages.length === 0 && (
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
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* three dots loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
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

      {/* prompt input box */}
      <form
        onSubmit={onsubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
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
