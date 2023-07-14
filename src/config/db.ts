import Mongoose from "mongoose";
import MongodbConfiguration from "./mongodbConfiguration";
Mongoose.Promise = global.Promise;

Mongoose.connection.on("disconnected", () => {
  console.error(
    `!!!!!!!!!! Database Disconnected @ ${MongodbConfiguration.databaseConnection.uri()} !!!!!!!!!!`
  );
});
Mongoose.connection.on("reconnected", () => {
  console.warn(
    `!!!!!!!!!! Database Reconnected @ ${MongodbConfiguration.databaseConnection.uri()} !!!!!!!!!!`
  );
});
Mongoose.connection.on("close", () => {
  console.log("Connection Closed");
});
Mongoose.connection.on("error", (err) => {
  console.error("error", err);
});

const db = async () => {
  await Mongoose.connect(
    MongodbConfiguration.databaseConnection.uri() as string,
    {
      authSource: process.env.MONGO_DB_AUTHDB || "admin",
      user: process.env.MONGO_DB_USER || "devops",
      pass: process.env.MONGO_DB_PASSWORD || "devops007",
    }
  );

  const db = Mongoose.connection;

  db.on("error", console.error.bind(console, "Connection Error:"));

  db.once("open", () => {
    console.log(
      `${process.env.NAME?.toUpperCase()}: Connected to Database @ ${MongodbConfiguration.databaseConnection.uri()}`
    );
  });
};

export default db;
