import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.mongooseCache = cached;

export async function connect() {
  const uri = process.env.MONGODB_URI;

  if (!uri?.trim()) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.connection && mongoose.connection.readyState === 1) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri)
      .then((connection) => {
        console.info(
          `MongoDB connected to database "${connection.connection.name}".`,
        );
        return connection;
      })
      .catch((error: unknown) => {
        cached.promise = null;
        cached.connection = null;
        throw error;
      });
  }

  cached.connection = await cached.promise;
  return cached.connection;
}
