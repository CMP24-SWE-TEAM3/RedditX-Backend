const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const dbConnect = () => {
  // Connect to the database
  const dbConnectionString = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  // REMOTE DATABASE
  mongoose
    .connect(dbConnectionString, {
      useNewUrlParser: true,
    })
    .then((connection) => {
      console.log(`Successfully connected to database`);
    });
};

module.exports = dbConnect;
