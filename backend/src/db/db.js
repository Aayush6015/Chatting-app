// // config/database.js
// import 'dotenv/config'
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Database connection error:', error.message);
//     process.exit(1);
//   }
// };

// // Handle connection events
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('Mongoose connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('Mongoose disconnected');
// });

// // Close connection when app terminates
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('Mongoose connection closed through app termination');
//   process.exit(0);
// });

// export default connectDB;

// the above code is to be used


import mongoose from "mongoose";
// import {DB_NAME} from "../constants.js"

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`)
    }
    catch(error)
    {
        console.log("MONGODB connection error",error)
        process.exit(1)
    }
}

export default connectDB