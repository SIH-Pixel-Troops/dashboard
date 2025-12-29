import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectPanicSocket = (
  onAlert: (alert: any) => void
) => {
  socket = io("https://backend-safarsuraksha.onrender.com"); // backend URL

  socket.on("connect", () => {
    console.log("✅ Dashboard connected to panic socket");
  });

  socket.on("new-alert", (alert) => {
    console.log("🚨 New alert received:", alert);
    onAlert(alert);
  });
};

export const disconnectPanicSocket = () => {
  if (socket) socket.disconnect();
};
