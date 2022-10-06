const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// Subscribe to unhandled rejection of any promise
const app = require('./app');

// Connect to the database
const dbConnectionString = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// REMOTE DATABASE
mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
  })
  .then((connection) => {
    console.log(`Successfully connected to natours database`);
  });

// LOCAL DATABASE
/*mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
}).then((con) => {
    console.log(`Successfully connected to natours database`);
});*/

// START SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`App is running on port ${port}...`)
);

process.on('unhandledRejection', (err) => {
  console.log(`${err.name}. ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`${err.name}. ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down...');
  server.close(() => console.log('Process terminated!'));
});
