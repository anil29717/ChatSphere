import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { socket } from "../socket";
import { toast, ToastContainer } from "react-toastify";
import { Send } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ChatRoom = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const location = useLocation();
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/messages/${userId}`);
        setMessages(res.data.messages);
        setReceiver(res.data.receiver);
        console.log("📥 Messages loaded from API:", res.data.messages);

      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join", user.id);

    // socket.on("receive_message", (newMessage) => {
    //   const inChatWith = location.pathname.includes(`/chats/${newMessage.sender}`);
    //   if (!inChatWith) {
    //     toast.info(`📩 New message from ${newMessage.senderName || "someone"}`);
    //   }

    //   const isRelevant =
    //     (newMessage.sender === userId && newMessage.receiver === user.id) ||
    //     (newMessage.sender === user.id && newMessage.receiver === userId);

    //   if (isRelevant) {
    //     setMessages((prev) => {
    //       const exists = prev.some((msg) => msg._id === newMessage._id);
    //       if (exists) return prev;
    //       return [...prev, newMessage];
    //     });
    //   }

    socket.on("receive_message", (newMessage) => {
      const isNotSender = newMessage.sender !== user.id;
      const inChatWith = location.pathname.includes(`/chats/${newMessage.sender}`);

      // ✅ Show toast + browser notification only if user is the receiver
      if (isNotSender && !inChatWith) {
        toast.info(`📩 New message from ${newMessage.senderName || "someone"}`);

        // ✅ Play notification sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch((err) => {
          console.warn("🔇 Unable to play sound:", err);
        });

        // ✅ Show browser notification
        if (Notification.permission === "granted") {
          const notification = new Notification("New Message", {
            body: `${newMessage.senderName || "Someone"}: ${newMessage.message}`,
            icon: "/chat-icon.png",
          });

          notification.onclick = () => {
            window.focus();
            window.location.href = `/chats/${newMessage.sender}`;
          };
        }
      }

      // ✅ Update chat if the message is for this conversation
      const isRelevant =
        (newMessage.sender === userId && newMessage.receiver === user.id) ||
        (newMessage.sender === user.id && newMessage.receiver === userId);

      if (isRelevant) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === newMessage._id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    });


    socket.on("typing", () => setIsTyping(true));
    socket.on("stop_typing", () => setIsTyping(false));

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [user, userId, location.pathname]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageData = {
      senderId: user.id,
      receiverId: userId,
      message: text,
    };

    socket.emit("send_message", messageData); // Backend will save and emit

    setText(""); // Clear input
    socket.emit("stop_typing", userId);
  };



  const handleTyping = () => {
    socket.emit("typing", userId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", userId);
    }, 1000);
  };

  return (
    <div className="flex flex-col  bg-black text-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-center items-center gap-3 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {receiver?.profileImage && (
            <img
              src={receiver.profileImage}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div className="text-left">
            <p className="font-semibold text-white">{receiver?.name}</p>
            <p className="text-sm text-zinc-400">@{receiver?.username}</p>
          </div>
        </div>
      </div>


      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map((msg, i) => {
          const senderId =
            typeof msg.sender === "string" ? msg.sender : msg.sender._id;
          const isOwn = senderId === user.id;
          const img = isOwn ? user.profileImage : receiver?.profileImage;

          return (
            <div
              key={i}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end`}
            >
              {!isOwn && (
                <img
                  src={img}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2 object-cover border border-zinc-700"
                />
              )}

              <div
                className={`max-w-[75%] p-3 rounded-xl shadow-md ${isOwn
                  ? "bg-blue-600 text-white rounded-br-none ml-auto"
                  : "bg-zinc-800 text-white rounded-bl-none"
                  }`}
              >
                <div className="whitespace-pre-line">{msg.message}</div>
                <div className="text-[10px] text-zinc-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isOwn && msg.isRead ? " • Read" : ""}
                </div>
              </div>


            </div>

          );
        })}

        {isTyping && (
          <p className="italic text-sm text-zinc-500 animate-pulse">
            {receiver?.name || "User"} is typing...
          </p>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t border-zinc-700 bg-zinc-900">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2 rounded-full focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
