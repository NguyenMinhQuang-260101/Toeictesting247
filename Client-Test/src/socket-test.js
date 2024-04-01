import io from "socket.io-client";
const socket_test = io(import.meta.env.VITE_API_URL);

export default socket_test;
