import mongoose from 'mongoose'

export const connectDB = async () => {
  console.log('connecting to ', process.env.mongoHost)
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return true
  }
  // Use new db connection
  await mongoose.connect(process.env.mongoHost || '', {});
  return true
};
