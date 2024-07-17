require("dotenv").config();
const { env } = require("~/config/environment");

const MONGODB_URI = env.MONGODB_URI;
const DATABASE_NAME = env.DATABASE_NAME;

const { MongoClient, ServerApiVersion } = require("mongodb");

let databaseInstance = null;

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Kết nối tới database
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  databaseInstance = mongoClientInstance.db(DATABASE_NAME);
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

export const GET_DB = () => {
  if (!databaseInstance) throw new Error("Must connect to DB first");
  return databaseInstance;
};
