import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    // Use the existing database connection if already connected
    return mongoose.connection;
  }
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    print(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw new Error("MongoDB connection failed.");
  }
};

export default dbConnect;
