const MongodbConfiguration = {
    databaseConnection: {
      protocol: "mongodb",
      hostname: process.env.MONGO_DB_HOSTNAME || "localhost",
      port: process.env.MONGO_DB_PORT || 27017,
      database: process.env.MONGO_DB_DATABASE || "liveDatabase",
      uri() {
        // return this.protocol + "://" + process.env.MONGO_DB_ADDRESSES + "/" + process.env.MONGO_DB_DATABASE || "liveDashboard" + "?replicaSet=rs0&retryWrites=true&w=majority";
        return process.env.MONGO_URI
        },
    }
  };
  
  export default MongodbConfiguration;