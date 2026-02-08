import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI || '');
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Error: ${(error as Error).message}`);
//     process.exit(1); // Exit process with failure
//   }
// };

// export default connectDB;

export const connectDB = async () => {
  try {
    console.log("⏳ connectDB() called");

    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
