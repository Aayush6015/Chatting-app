import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// IMPORTANT: JSON parsing middleware MUST come first
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

// Then other middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())

app.on("error",(error)=>{
    console.log("ERR",error);
    throw error
})

//routes
import userRouter from "./routes/user.routes.js"
import conversationRouter from "./routes/conversation.routes.js"
import messageRouter from "./routes/message.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/conversations",conversationRouter)
app.use("/api/v1/messages",messageRouter)

export {app}