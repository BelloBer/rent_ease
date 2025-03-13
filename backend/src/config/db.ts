//backend//src//config//db.ts
import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGO_URI;
console.log("Loaded MONGO_URI:", MONGO_URI); // ✅ Debugging Line

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing from environment variables.");
}


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      // No need for deprecated options like useNewUrlParser or useUnifiedTopology
      dbName: 'RentEase', // Optional: Specify DB name directly
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
