import mongoose from "mongoose";
const dbConfig = process.env.MONGO_URL

export const configure = () => {
  const connect = () => {
    mongoose.connect(dbConfig);
  };
  connect();

  const db = mongoose.connection;

  db.on("connected", () => {
    console.info("DB Connected");
  });

  db.on("error", (err) => {
    console.error("Mongoose default connection error: " + err);
  });

  db.on("disconnected", () => {
    console.info("Again going to connect DB");
    connect();
  });
};