import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import socket_test from "./socket-test";

const profile = JSON.parse(localStorage.getItem("profile"));
const usernames = [
  {
    name: "user1",
    value: "quangnguyen01",
  },
  {
    name: "user2",
    value: "user660533d356e3641be6dddd18",
  },
];
export default function ChatTest() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");

  const getProfile = (username) => {
    axios
      .get(`/users/${username}`, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        setReceiver(res.data.result._id);
        alert("Now you can chat with " + res.data.result.name);
      });
  };

  useEffect(() => {
    socket_test.auth = {
      _id: profile._id,
    };
    socket_test.connect();

    socket_test.on("receiver private message", (data) => {
      const content = data.content;
      setMessages((messages) => [
        ...messages,
        {
          content,
          isSender: false,
        },
      ]);
    });

    return () => {
      socket_test.disconnect();
    };
  }, []);

  const send = (e) => {
    e.preventDefault();
    setValue("");
    socket_test.emit("private message", {
      content: value,
      to: receiver, // id of the user client 2
    });
    setMessages((messages) => [
      ...messages,
      {
        content: value,
        isSender: true,
      },
    ]);
  };

  return (
    <div>
      <h1>Chat Test</h1>

      <div>
        {usernames.map((username) => (
          <div key={username.name}>
            <button onClick={() => getProfile(username.value)}>
              {username.name}
            </button>
          </div>
        ))}
      </div>

      <div className="chat">
        {messages.map((message, index) => (
          <div key={index}>
            <div className="message-container">
              <div
                className={
                  message.isSender ? "message-right message" : "message"
                }
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send}>
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
