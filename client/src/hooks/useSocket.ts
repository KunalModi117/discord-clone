import { appconfig } from "@discord/utils/app.config";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = ({ channelId }: { channelId: string }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(appconfig.apiBaseUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to socket.io", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket.io");
      setIsConnected(false);
    });

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [channelId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
