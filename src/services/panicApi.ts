import { io, Socket } from "socket.io-client";

/**
 * This MUST point to backendofsafarsuraksha
 */
const SOCKET_URL = "https://backend-safarsuraksha.onrender.com";

/**
 * This interface EXACTLY matches backend payload
 */
export interface RealPanicAlert {
  id: number;
  touristId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: "HIGH";
  status: "ACTIVE";
  time: string;
}

let socket: Socket | null = null;

/**
 * Connect once to backend socket
 */
export const connectPanicSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to panic socket");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from panic socket");
    });
  }
  return socket;
};

/**
 * Listen for real-time panic alerts
 */
export const listenForPanicAlerts = (
  callback: (alert: RealPanicAlert) => void
) => {
  const s = connectPanicSocket();
  s.on("new-alert", callback);
};

/**
 * Cleanup (on page unmount)
 */
export const disconnectPanicSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
