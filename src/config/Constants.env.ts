export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/iptv";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || 123456;
export const JWT_SECRET = process.env.JWT_SECRET || "temporary-secret";
