const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  age: Number,
  avatar: String,
  books: [String],
  chatRequests: [String],
  chatInvites: [String],
  previousConnections: [String],
  gender: String,
  county: String,
  createdAt: { type: Date, default: Date.now },
  currentChatId: String,
  deletedAt: { type: Date, default: Date.now },
  description: String,
  facebookId: String,
  firstName: String,
  hobbies: [String],
  id: String,
  interest: String,
  lastName: String,
  modifiedAt: { type: Date, default: Date.now },
  movies: [String],
  music: [String],
  rejectedPeople: [String],
  series: [String],
  sports: [String],
  walkthrough: { type: String, default: 'uncompleted' },
  fcmToken: String,
});

module.exports = mongoose.model('User', userSchema);
