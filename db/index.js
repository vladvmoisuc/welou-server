const mongoose = require('mongoose');

const connect = async () => {
  try {
    // await mongoose.connect(
    //   `mongodb+srv://welou:${process.env.DATABASE_PASSWORD}@cluster0.v6uxj.gcp.mongodb.net/<welou>?retryWrites=true&w=majority`,
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   }
    // );
    await mongoose.connect(
      `mongodb+srv://welou:rXVRIwco1GauTTUb@cluster0.v6uxj.gcp.mongodb.net/<welou>?retryWrites=true&w=majority`,
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
