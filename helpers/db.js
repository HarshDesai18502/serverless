const mongoose = require("mongoose");

let conn = null;

const uri = process.env.MONGODB_URL;

const connectToDatabase = async function connection() {
  if (conn == null) {
    conn = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
};
module.exports = { connectToDatabase };
