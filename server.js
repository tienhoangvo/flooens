const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB_URI = process.env.DB_URI.replace('<PWD>', process.env.DB_PWD);

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => {
    console.log('DB connected successully');
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(`AT:${promise}\nREASON:${reason}`);

  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err, origin) => {
  console.log('UNCAUGHT EXCEPTION!💥 Shutting down...');
  console.log(`CAUGHT EXCEPTION: ${err.stack}\nEXCEPTION ORIGIN: ${origin}`);

  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👌👌SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
