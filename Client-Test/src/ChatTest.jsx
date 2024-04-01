import { useEffect } from "react";

import { useState } from "react";
import socket_test from "./socket-test";

const profile = JSON.parse(localStorage.getItem("profile"));
export default function ChatTest() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket_test.auth = {
      _id: profile._id,
    };
    socket_test.connect();

    socket_test.on("receiver private message", (data) => {
      const content = data.content;
      setMessages((messages) => [...messages, content]);
    });

    return () => {
      socket_test.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue("");
    socket_test.emit("private message", {
      content: value,
      to: "660533d356e3641be6dddd18", // id of the user client 2
    });
  };

  return (
    <div>
      <h1>Chat Test</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
