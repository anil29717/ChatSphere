// src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000"); // Replace with your backend URL if deployed
