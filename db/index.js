const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://root:${process.env.DATABASE_PASSWORD}@cluster0.v6uxj.gcp.mongodb.net/<welou>?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.log('Could not connect to MongoDB because:', error);
  }
};

module.exports = {
  connect,
};
