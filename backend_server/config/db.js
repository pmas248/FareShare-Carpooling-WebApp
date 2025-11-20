const mongoose = require('mongoose');

module.exports = () => {
  // Jest automatically sets NODE_ENV to 'test', so this will skip real Mongo connections
  if (process.env.NODE_ENV === 'test') {
    console.log('⏭  Skipping real DB connect in test mode');
    return Promise.resolve();
  }

  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
};
