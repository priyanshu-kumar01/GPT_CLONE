import express from "express";
import { createChat, delChats, getChats } from "../controllers/chatController.js";
import { protect } from "../middlewares/Auth.js";

const chatRouter = express.Router();

chatRouter.get("/create",protect, createChat);
chatRouter.get("/getChat",protect, getChats);
chatRouter.post("/deleteChat",protect, delChats);

export default chatRouter;