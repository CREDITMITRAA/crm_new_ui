// src/hooks/useSocket.js
import { useEffect } from "react";
import { disconnectSocket, initializeSocket, registerSocketEvents } from "../services/socket-service";
import { useDispatch } from "react-redux";


const useSocket = (userId,onNotificationReceived) => {
    const dispatch = useDispatch()
  useEffect(() => {
    if (!userId) return;

    initializeSocket(userId,dispatch);

    registerSocketEvents((data) => {
      console.log("New lead assignment:", data);
    //   alert(data.message);
      onNotificationReceived(data)
    });

    return () => {
      disconnectSocket();
    };
  }, [userId,onNotificationReceived,dispatch]);
};

export default useSocket;
