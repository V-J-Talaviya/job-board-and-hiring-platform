import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

let connected = false;

export async function connectDatabase(): Promise<void> {
  if (connected || !MONGODB_URI) return;

  mongoose.set("strictQuery", true); // strict query mode

  await mongoose.connect(MONGODB_URI);
  connected = true;

  console.log(`[db] database connected successfully`);

  mongoose.connection.on("disconnected", () => {
    connected = false;
    console.warn("[db] connection lost");
  });
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connected = false;
}
