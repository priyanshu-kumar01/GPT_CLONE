import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";


const app = express();

await connectDB();

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req,res)=>{res.send("Hello world");});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.listen(port, ()=>{
    console.log(`App is Listning on ${port} `);
})
