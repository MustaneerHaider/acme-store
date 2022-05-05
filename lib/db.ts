import mongoose from 'mongoose'

export default function connectToDB() {
  if (mongoose.connections[0].readyState) return
  else mongoose.connect(process.env.MONGO_URI!)
}
