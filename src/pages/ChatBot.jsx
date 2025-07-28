import { useState } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { type: "aira", text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "aira", text: "Maaf, Aira sedang tidak bisa dijangkau 😳" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-gradient-to-b bg-[#45cad7] text-white min-h-screen py-5 mb-20">
      <div className="max-w-4xl mx-auto bg-[#e8fdff] min-h-screen rounded-2xl p-6 shadow-lg flex flex-col justify-between">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.type === "aira" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 rounded-xl shadow-md max-w-sm ${
                  msg.type === "aira"
                    ? "bg-white text-black"
                    : "bg-[#45cad7] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-black p-3 rounded-xl shadow-md max-w-sm italic opacity-70">
                Aira sedang mengetik...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="mt-4 flex items-center bg-white rounded-full shadow-md px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ketik pesan..."
            className="flex-1 outline-none text-black bg-transparent px-2 py-1"
          />
          <button
            onClick={sendMessage}
            className="bg-[#45cad7] text-white rounded-full p-2 hover:bg-[#3cbcc6] transition cursor-pointer"
          >
            <i class="ri-send-plane-line ri-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
