const mongoose = require("mongoose");

const connectionOfDb = () => {
  mongoose
    .connect(process.env.MONGO_DB, {
      dbName: 'video-course-application',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      // Throwing an error in a promise chain without a downstream .catch
      // will result in an unhandled promise rejection, crashing the app.
      console.error(`Could not connect to MongoDB: ${err}`);
      process.exit(1);
    });
};

module.exports = connectionOfDb;
