const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "chat-app-dev";

let database;

function getDb() {
  return database;
}

async function connect() {
  try {
    await client.connect();
    const db = await client.db(dbName);

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    database = db; // reassign database disini

    return db;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect, getDb };
