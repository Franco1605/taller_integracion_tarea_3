import io from "socket.io-client";

export const socket1 = io("wss://​le-18262636.bitzonte.com", {
  path: "/stocks",
});
