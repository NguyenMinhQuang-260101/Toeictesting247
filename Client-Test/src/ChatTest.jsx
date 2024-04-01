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
  const [conversations, setConversations] = useState([]);
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

    socket_test.on("receiver_message", (data) => {
      const { payload } = data;
      setConversations((conversations) => [...conversations, payload]);
    });

    return () => {
      socket_test.disconnect();
    };
  }, []);

  useEffect(() => {
    if (receiver) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          setConversations(res.data.result.conversations);
        });
    }
  });

  const send = (e) => {
    e.preventDefault();
    setValue("");
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver,
    };
    socket_test.emit("send_message", {
      payload: conversation,
    });
    setConversations((conversations) => [
      ...conversations,
      {
        ...conversation,
        _id: new Date().getTime(),
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
        {conversations.map((conversation) => (
          <div key={conversation._id}>
            <div className="message-container">
              <div
                className={
                  conversation.sender_id === profile._id
                    ? "message-right message"
                    : "message"
                }
              >
                {conversation.content}
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
