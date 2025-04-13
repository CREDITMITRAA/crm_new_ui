// src/services/socketService.js
import { io } from "socket.io-client";
import { BASE_URL } from "../utilities/AppConstants";
import {
  addOnlineUser,
  removeOnlineUser,
  setOnlineUsers,
} from "../features/online-users/onlineUserSlice";
import { showInteractiveNotification } from "../features/interactive-notifications/interactiveNotificationsSlice";
import fifty_calls_done from '../assets/videos/interactive-notification-videos/fifty_calls_done.mp4'
import completed_all_calls from '../assets/videos/interactive-notification-videos/completed_all_calls.mp4'
import _100_calls_done from '../assets/videos/interactive-notification-videos/_100_calls_done.mp4'
import interested_leads_video from '../assets/videos/interactive-notification-videos/interested_leads.mp4'
import lead_approved from '../assets/videos/interactive-notification-videos/lead_approved.mp4'
import lead_rejected from '../assets/videos/interactive-notification-videos/lead_rejected.mp4'

let socket = null;
let storedDispatch = null

// Initialize socket connection
export const initializeSocket = (userId, dispatch) => {
  storedDispatch = dispatch
  if (!userId) {
    console.warn("User ID not provided, socket not initialized.");
    return;
  }

  socket = io(BASE_URL, {
    transports: ["websocket"],
    query: { userId },
    withCredentials: true,
  });

  console.log("Socket initialized with user ID:", userId);

  socket.on("user-online", ({ userId }) => {
    dispatch(addOnlineUser(userId));
  });

  socket.on("user-offline", ({ userId }) => {
    dispatch(removeOnlineUser(userId));
  });

  socket.on("online-users", (users) => {
    dispatch(setOnlineUsers(users));
  });

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server.");
  });
};

// Event Listener Registration
export const registerSocketEvents = (onLeadAssignment, dispatch) => {
  if (!socket) {
    console.warn("Socket not initialized.");
    return;
  }

  socket.on("leadAssignment", (data) => {
    console.log("Lead Assignment Notification:", data);
    onLeadAssignment?.(data);
  });

  socket.on("connected_50_calls", (data) => {
    console.log("connected_50_calls 50 calls", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: fifty_calls_done,
      message: data.message || "Congratulations! You've connected 50 calls!"
    }));
  });

  socket.on("connected_100_calls", (data) => {
    console.log("connected_100_calls", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: _100_calls_done,
      message: data.message || "Great job! You successfully completed your target today!"
    }));
  });

  socket.on("high_interested_leads", (data) => {
    console.log("high_interested_leads ", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: interested_leads_video, // Make sure to import this
      message: data.message || "High interest lead detected!"
    }));
  });

  socket.on("completed_all_calls", (data) => {
    console.log("completed_all_calls ", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: completed_all_calls, // Make sure to import this
      message: data.message || "Completed All Calls of the day"
    }));
  });

  socket.on("lead_approved", (data) => {
    console.log("lead_approved ", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: lead_approved, // Make sure to import this
      message: data.message || "Awesome job! Your lead is approved—keep them coming!"
    }));
  });

  socket.on("lead_rejected", (data) => {
    console.log("lead_rejected ", data);
    storedDispatch(showInteractiveNotification({
      show: true,
      videoSrc: lead_rejected, // Make sure to import this
      message: data.message || "Stay positive! Your approval will come soon—just keep pushing forward"
    }));
  });
};

// Emit Events
export const emitSocketEvent = (event, data) => {
  if (!socket) {
    console.warn("Socket not initialized.");
    return;
  }
  socket.emit(event, data);
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected.");
  }
};
