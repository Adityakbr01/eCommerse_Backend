// import { log } from "console";
// import mongoose from "mongoose";

// // Connect to MongoDB
// const connectDB = process.env.MONGODB_URI;
// log(connectDB);
// const ConnectDB = async () => {
//   console.log(process.env.MONGODB_URI);
//   try {
//     await mongoose.createConnection(connectDB as string);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// export default ConnectDB;

// src/db.ts
import mongoose from "mongoose";

const mongoUri = Bun.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
